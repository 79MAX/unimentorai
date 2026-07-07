const functions = require('firebase-functions');
const admin = require('firebase-admin');
const rateLimiter = require('../middleware/rateLimiter');
const { getSecret } = require('../security/secretManager');

/**
 * Kkiapay — clés private + secret uniquement côté serveur (SDK Node : x-api-key, x-secret-key, x-private-key).
 * La clé publique reste utilisable dans l’app pour le widget.
 *
 * firebase functions:config:set kkiapay.public_key="..." kkiapay.private_key="..." kkiapay.secret_key="..."
 * Option sandbox : kkiapay.sandbox="true"
 *
 * Gen 2 / .env : KKIAPAY_PUBLIC_KEY, KKIAPAY_PRIVATE_KEY, KKIAPAY_SECRET_KEY, KKIAPAY_SANDBOX=true
 */

async function getKkiapayConfig() {
  const sandboxRaw =
    process.env.KKIAPAY_SANDBOX ||
    '';
  const sandbox =
    String(sandboxRaw).toLowerCase() === 'true' ||
    sandboxRaw === true ||
    sandboxRaw === '1';
  return {
    publicKey:
      await getSecret('KKIAPAY_PUBLIC_KEY'),
    privateKey:
      await getSecret('KKIAPAY_PRIVATE_KEY'),
    secretKey:
      await getSecret('KKIAPAY_SECRET_KEY'),
    sandbox,
  };
}

function assertKkiapayConfigured(cfg) {
  if (!cfg.publicKey || !cfg.privateKey || !cfg.secretKey) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'Kkiapay non configuré (public_key, private_key, secret_key / variables KKIAPAY_*)'
    );
  }
}

function baseUrl(cfg) {
  return cfg.sandbox ? 'https://api-sandbox.kkiapay.me' : 'https://api.kkiapay.me';
}

async function kkiapayPost(path, body) {
  const cfg = await getKkiapayConfig();
  assertKkiapayConfigured(cfg);
  const url = `${baseUrl(cfg)}${path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': cfg.publicKey,
      'x-secret-key': cfg.secretKey,
      'x-private-key': cfg.privateKey,
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch (_) {
    json = { raw: text };
  }
  if (!res.ok) {
    const msg =
      (json && (json.message || json.reason || json.error)) || text || res.statusText;
    throw new functions.https.HttpsError(
      'failed-precondition',
      `Kkiapay ${res.status}: ${String(msg).slice(0, 500)}`
    );
  }
  return json;
}

function sanitizeMetadata(uid, raw) {
  const out = { firebase_uid: uid };
  if (!raw || typeof raw !== 'object') return out;
  for (const [k, v] of Object.entries(raw)) {
    const key = String(k).slice(0, 40);
    if (!key) continue;
    out[key] = v == null ? '' : String(v).slice(0, 500);
  }
  return out;
}

/**
 * Crée une transaction (même intention que l’ancien appel client) — authentification par les 3 clés serveur.
 */
exports.createKkiapayTransaction = functions.https.onCall(
  rateLimiter.withRateLimitCallable(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Authentification requise');
    }

    const amount = data?.amount;
    const currency = (data?.currency || 'XOF').toString();
    const description = (data?.description || 'UniMentorAI').toString().slice(0, 500);
    const customerEmail = (data?.customerEmail || context.auth.token.email || context.auth.uid)
      .toString()
      .slice(0, 200);

    if (typeof amount !== 'number' || !Number.isFinite(amount)) {
      throw new functions.https.HttpsError('invalid-argument', 'amount requis (nombre)');
    }
    if (amount < 1 || amount > 50_000_000) {
      throw new functions.https.HttpsError('invalid-argument', 'amount hors limites');
    }

    const uid = context.auth.uid;
    const meta = sanitizeMetadata(uid, data?.metadata);

    const payload = {
      amount,
      currency,
      description,
      customer: {
        email: customerEmail,
      },
      metadata: meta,
    };

    const result = await kkiapayPost('/api/v1/transactions', payload);

    const transactionId =
      result.transactionId ||
      result.transaction_id ||
      result.id ||
      result.data?.transactionId;

    if (transactionId) {
      const db = admin.firestore();
      await db
        .collection('payments')
        .doc(String(transactionId))
        .set(
          {
            userId: uid,
            method: 'kkiapay',
            status: result.status || 'pending',
            kkiapayTransactionId: String(transactionId),
            amount,
            currency,
            source: 'kkiapay_create',
            metadata: meta,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
    }

    return {
      transactionId: transactionId ? String(transactionId) : null,
      status: result.status || null,
    };
  }, functions)
);

/**
 * Vérifie une transaction (équivalent SDK : POST /api/v1/transactions/status).
 */
exports.verifyKkiapayTransaction = functions.https.onCall(
  rateLimiter.withRateLimitCallable(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Authentification requise');
    }
    const transactionId = data?.transactionId;
    if (!transactionId || typeof transactionId !== 'string' || transactionId.length > 120) {
      throw new functions.https.HttpsError('invalid-argument', 'transactionId invalide');
    }

    const uid = context.auth.uid;
    const db = admin.firestore();
    const payRef = db.collection('payments').doc(String(transactionId));
    const paySnap = await payRef.get();
    if (paySnap.exists) {
      const owner = paySnap.data().userId;
      if (owner && owner !== uid) {
        throw new functions.https.HttpsError('permission-denied', 'Transaction non autorisée');
      }
    }

    const result = await kkiapayPost('/api/v1/transactions/status', { transactionId });

    const statusStr = (result.status || result.state || '').toString().toUpperCase();
    const success = statusStr === 'SUCCESS' || result.status === 'success';

    const meta = result.metadata || {};
    if (meta.firebase_uid && meta.firebase_uid !== uid) {
      throw new functions.https.HttpsError('permission-denied', 'Transaction non autorisée');
    }

    await payRef.set(
      {
        userId: uid,
        method: 'kkiapay',
        status: result.status || statusStr || 'unknown',
        kkiapayTransactionId: String(transactionId),
        source: 'kkiapay_verify',
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return {
      transactionId: String(transactionId),
      status: result.status || statusStr,
      success,
    };
  }, functions)
);

