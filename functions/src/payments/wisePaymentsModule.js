const functions = require('firebase-functions');
const admin = require('firebase-admin');
const rateLimiter = require('../middleware/rateLimiter');
const { getSecret } = require('../security/secretManager');

/**
 * Intégration Wise (ex-TransferWise) — secrets uniquement côté serveur.
 *
 * Config Firebase :
 *   firebase functions:config:set wise.api_token="..." wise.profile_id="123456" wise.recipient_account_id="789012"
 * Variables d'environnement (Gen2) :
 *   WISE_API_TOKEN, WISE_PROFILE_ID, WISE_RECIPIENT_ACCOUNT_ID
 *
 * Documentation : https://api-docs.wise.com/
 * Flux typique : quote (v3) → transfer (v1) avec quoteUuid + targetAccount (compte bénéficiaire).
 */

async function getWiseApiToken() {
  return getSecret('WISE_API_TOKEN');
}

async function getWiseProfileId() {
  return getSecret('WISE_PROFILE_ID');
}

async function getWiseRecipientAccountId() {
  return getSecret('WISE_RECIPIENT_ACCOUNT_ID');
}

async function wiseFetch(path, { method = 'GET', body = null } = {}) {
  const token = await getWiseApiToken();
  if (!token) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'Wise non configuré (WISE_API_TOKEN / wise.api_token)'
    );
  }
  const url = `https://api.wise.com${path}`;
  const opts = {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
  if (body != null) {
    opts.body = JSON.stringify(body);
  }
  const res = await fetch(url, opts);
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch (_) {
    json = { raw: text };
  }
  if (!res.ok) {
    const msg = (json && json.message) || text || res.statusText;
    throw new functions.https.HttpsError(
      'failed-precondition',
      `Wise API ${res.status}: ${String(msg).slice(0, 500)}`
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
 * Crée un devis Wise (v3) — étape obligatoire avant un transfer.
 */
exports.createWiseQuote = functions.https.onCall(
  rateLimiter.withRateLimitCallable(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Authentification requise');
    }
    const profileId = await getWiseProfileId();
    if (!profileId) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'WISE_PROFILE_ID / wise.profile_id manquant'
      );
    }

    const sourceAmount = data?.sourceAmount;
    const sourceCurrency = (data?.sourceCurrency || 'usd').toString().toLowerCase();
    const targetCurrency = (data?.targetCurrency || sourceCurrency).toString().toLowerCase();

    if (typeof sourceAmount !== 'number' || !Number.isFinite(sourceAmount)) {
      throw new functions.https.HttpsError('invalid-argument', 'sourceAmount requis (nombre)');
    }
    if (sourceAmount < 1 || sourceAmount > 50000) {
      throw new functions.https.HttpsError('invalid-argument', 'sourceAmount hors limites');
    }
    if (!/^[a-z]{3}$/.test(sourceCurrency) || !/^[a-z]{3}$/.test(targetCurrency)) {
      throw new functions.https.HttpsError('invalid-argument', 'Devise invalide (3 lettres)');
    }

    const uid = context.auth.uid;
    const meta = sanitizeMetadata(uid, data?.metadata);

    const quoteBody = {
      sourceCurrency: sourceCurrency.toUpperCase(),
      targetCurrency: targetCurrency.toUpperCase(),
      sourceAmount,
    };

    const quote = await wiseFetch(`/v3/profiles/${profileId}/quotes`, {
      method: 'POST',
      body: quoteBody,
    });

    return {
      quoteUuid: quote.id || quote.quoteUuid || quote.uuid,
      profileId,
      expirationTime: quote.expirationTime || null,
      rate: quote.rate || null,
      sourceAmount: quote.sourceAmount,
      targetAmount: quote.targetAmount,
      metadata: meta,
    };
  }, functions)
);

/**
 * Finalise un transfer Wise à partir d’un quoteUuid (bénéficiaire = compte configuré côté serveur).
 */
exports.completeWiseTransfer = functions.https.onCall(
  rateLimiter.withRateLimitCallable(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Authentification requise');
    }

    const quoteUuid = data?.quoteUuid;
    if (!quoteUuid || typeof quoteUuid !== 'string') {
      throw new functions.https.HttpsError('invalid-argument', 'quoteUuid requis');
    }

    const recipientId = await getWiseRecipientAccountId();
    if (!recipientId) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'WISE_RECIPIENT_ACCOUNT_ID / wise.recipient_account_id manquant (compte bénéficiaire Wise)'
      );
    }

    const uid = context.auth.uid;
    const customerTransactionId = `um_${uid}_${Date.now()}`.slice(0, 128);

    const transferBody = {
      targetAccount: Number(recipientId),
      quoteUuid,
      customerTransactionId,
      details: {
        reference: (data?.reference || 'UniMentorAI').toString().slice(0, 200),
      },
    };

    const transfer = await wiseFetch('/v1/transfers', {
      method: 'POST',
      body: transferBody,
    });

    const db = admin.firestore();
    await db
      .collection('payments')
      .doc(String(transfer.id))
      .set(
        {
          userId: uid,
          method: 'wise',
          status: transfer.status || 'processing',
          wiseTransferId: transfer.id,
          quoteUuid,
          amount: data?.expectedAmount || null,
          currency: data?.currency || null,
          source: 'wise_transfer',
          metadata: sanitizeMetadata(uid, data?.metadata),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

    return {
      transferId: transfer.id,
      status: transfer.status,
      customerTransactionId,
    };
  }, functions)
);

/**
 * Lit le statut d’un transfer Wise et synchronise Firestore (vérif propriété via customerTransactionId prefix um_uid_).
 */
exports.verifyWiseTransfer = functions.https.onCall(
  rateLimiter.withRateLimitCallable(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Authentification requise');
    }
    const transferId = data?.transferId;
    if (!transferId) {
      throw new functions.https.HttpsError('invalid-argument', 'transferId requis');
    }

    const transfer = await wiseFetch(`/v1/transfers/${transferId}`, { method: 'GET' });
    const uid = context.auth.uid;
    const ref = transfer.customerTransactionId || '';
    if (!ref.startsWith(`um_${uid}_`)) {
      throw new functions.https.HttpsError('permission-denied', 'Transfer non autorisé');
    }

    const db = admin.firestore();
    const completed =
      transfer.status === 'outgoing_payment_sent' ||
      transfer.status === 'completed' ||
      transfer.status === 'funds_converted';

    await db
      .collection('payments')
      .doc(String(transfer.id))
      .set(
        {
          userId: uid,
          method: 'wise',
          status: transfer.status,
          wiseTransferId: transfer.id,
          source: 'wise_verify',
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

    return {
      transferId: transfer.id,
      status: transfer.status,
      completed,
    };
  }, functions)
);

