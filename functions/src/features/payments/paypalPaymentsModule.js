const functions = require('firebase-functions');
const admin = require('firebase-admin');
const rateLimiter = require('../middleware/rateLimiter');
const { getSecret } = require('../security/secretManager');

/**
 * PayPal Orders v2 — client_secret uniquement côté serveur.
 *
 * firebase functions:config:set paypal.client_id="..." paypal.client_secret="..."
 * Option sandbox : paypal.sandbox="true"
 *
 * Gen 2 : PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_SANDBOX=true
 * URLs de retour (optionnel) : paypal.return_url, paypal.cancel_url
 */

async function getPayPalConfig() {
  const sandboxRaw = process.env.PAYPAL_SANDBOX || '';
  const sandbox =
    String(sandboxRaw).toLowerCase() === 'true' ||
    sandboxRaw === true ||
    sandboxRaw === '1';
  return {
    clientId: await getSecret('PAYPAL_CLIENT_ID'),
    clientSecret: await getSecret('PAYPAL_CLIENT_SECRET'),
    sandbox,
    returnUrl:
      process.env.PAYPAL_RETURN_URL ||
      'https://unimentorai.app/paypal/return',
    cancelUrl:
      process.env.PAYPAL_CANCEL_URL ||
      'https://unimentorai.app/paypal/cancel',
  };
}

function apiBase(cfg) {
  return cfg.sandbox ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';
}

async function getAccessToken(cfg) {
  if (!cfg.clientId || !cfg.clientSecret) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'PayPal non configuré (client_id, client_secret)'
    );
  }
  const auth = Buffer.from(`${cfg.clientId}:${cfg.clientSecret}`).toString('base64');
  const res = await fetch(`${apiBase(cfg)}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch (_) {
    json = {};
  }
  if (!res.ok) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      `PayPal OAuth ${res.status}: ${String(text).slice(0, 400)}`
    );
  }
  return json.access_token;
}

async function paypalApi(cfg, path, { method = 'GET', body = null } = {}) {
  const token = await getAccessToken(cfg);
  const headers = {
    Authorization: `Bearer ${token}`,
    Prefer: 'return=representation',
  };
  if (body != null) {
    headers['Content-Type'] = 'application/json';
  }
  const opts = {
    method,
    headers,
  };
  if (body != null) opts.body = JSON.stringify(body);
  const res = await fetch(`${apiBase(cfg)}${path}`, opts);
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch (_) {
    json = { raw: text };
  }
  if (!res.ok) {
    const detail = (json && (json.message || json.details)) || text;
    throw new functions.https.HttpsError(
      'failed-precondition',
      `PayPal API ${res.status}: ${String(detail).slice(0, 500)}`
    );
  }
  return json;
}

function formatMoneyAmount(amount, currency) {
  const cur = (currency || 'USD').toString().toUpperCase();
  const n = Number(amount);
  if (!Number.isFinite(n)) return null;
  if (cur === 'JPY' || cur === 'HUF' || cur === 'TWD') {
    return String(Math.round(n));
  }
  return n.toFixed(2);
}

function findApproveUrl(links) {
  if (!Array.isArray(links)) return null;
  const hit = links.find(
    (l) => l && (l.rel === 'approve' || l.rel === 'payer-action') && l.href
  );
  return hit ? hit.href : null;
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
 * Crée une commande PayPal (intent CAPTURE) et renvoie l’URL d’approbation.
 */
exports.createPayPalOrder = functions.https.onCall(
  rateLimiter.withRateLimitCallable(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Authentification requise');
    }
    const cfg = await getPayPalConfig();
    const amount = data?.amount;
    const currency = (data?.currency || 'USD').toString().toUpperCase();
    const description = (data?.description || 'UniMentorAI').toString().slice(0, 500);
    const value = formatMoneyAmount(amount, currency);
    if (value == null) {
      throw new functions.https.HttpsError('invalid-argument', 'amount invalide');
    }
    if (!/^[A-Z]{3}$/.test(currency)) {
      throw new functions.https.HttpsError('invalid-argument', 'currency invalide');
    }

    const uid = context.auth.uid;
    const meta = sanitizeMetadata(uid, data?.metadata);
    const returnUrl = (data?.returnUrl || cfg.returnUrl).toString().slice(0, 500);
    const cancelUrl = (data?.cancelUrl || cfg.cancelUrl).toString().slice(0, 500);

    const orderBody = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: (data?.referenceId || `sub_${uid}`).toString().slice(0, 120),
          description,
          custom_id: uid,
          amount: {
            currency_code: currency,
            value,
          },
        },
      ],
      application_context: {
        return_url: returnUrl,
        cancel_url: cancelUrl,
        user_action: 'PAY_NOW',
        brand_name: 'UniMentorAI',
      },
    };

    const order = await paypalApi(cfg, '/v2/checkout/orders', {
      method: 'POST',
      body: orderBody,
    });

    const orderId = order.id;
    const approveUrl = findApproveUrl(order.links);

    if (orderId) {
      const db = admin.firestore();
      await db
        .collection('payments')
        .doc(String(orderId))
        .set(
          {
            userId: uid,
            method: 'paypal',
            status: order.status || 'CREATED',
            paypalOrderId: orderId,
            amount: Number(amount),
            currency,
            source: 'paypal_create_order',
            metadata: meta,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
    }

    return {
      orderId,
      status: order.status,
      approveUrl: approveUrl || null,
    };
  }, functions)
);

/**
 * Capture une commande après approbation PayPal dans le navigateur.
 */
exports.capturePayPalOrder = functions.https.onCall(
  rateLimiter.withRateLimitCallable(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Authentification requise');
    }
    const orderId = data?.orderId;
    if (!orderId || typeof orderId !== 'string' || orderId.length > 200) {
      throw new functions.https.HttpsError('invalid-argument', 'orderId invalide');
    }
    const uid = context.auth.uid;
    const db = admin.firestore();
    const payRef = db.collection('payments').doc(String(orderId));
    const snap = await payRef.get();
    if (snap.exists && snap.data().userId && snap.data().userId !== uid) {
      throw new functions.https.HttpsError('permission-denied', 'Commande non autorisée');
    }

    const cfg = await getPayPalConfig();
    const captured = await paypalApi(cfg, `/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      body: {},
    });

    const cap = captured.purchase_units && captured.purchase_units[0] && captured.purchase_units[0].payments
      ? captured.purchase_units[0].payments.captures &&
        captured.purchase_units[0].payments.captures[0]
      : null;
    const captureId = cap && cap.id;

    await payRef.set(
      {
        userId: uid,
        method: 'paypal',
        status: captured.status || 'COMPLETED',
        paypalOrderId: orderId,
        paypalCaptureId: captureId || null,
        source: 'paypal_capture',
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return {
      orderId,
      status: captured.status,
      success: captured.status === 'COMPLETED',
      captureId: captureId || null,
    };
  }, functions)
);

/**
 * Lit le statut d’une commande (après retour app / vérif manuelle).
 */
exports.getPayPalOrder = functions.https.onCall(
  rateLimiter.withRateLimitCallable(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Authentification requise');
    }
    const orderId = data?.orderId;
    if (!orderId || typeof orderId !== 'string' || orderId.length > 200) {
      throw new functions.https.HttpsError('invalid-argument', 'orderId invalide');
    }
    const uid = context.auth.uid;
    const db = admin.firestore();
    const snap = await db.collection('payments').doc(String(orderId)).get();
    if (snap.exists && snap.data().userId && snap.data().userId !== uid) {
      throw new functions.https.HttpsError('permission-denied', 'Commande non autorisée');
    }

    const cfg = await getPayPalConfig();
    const order = await paypalApi(cfg, `/v2/checkout/orders/${orderId}`, { method: 'GET' });

    const completed = order.status === 'COMPLETED';
    const approved = order.status === 'APPROVED';

    await db
      .collection('payments')
      .doc(String(orderId))
      .set(
        {
          userId: uid,
          method: 'paypal',
          status: order.status,
          paypalOrderId: orderId,
          source: 'paypal_get_order',
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

    return {
      orderId,
      status: order.status,
      completed,
      approved,
      needsCapture: approved && !completed,
    };
  }, functions)
);

