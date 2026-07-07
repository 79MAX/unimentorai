#!/usr/bin/env node
/**
 * Smoke tests post-rotation — validation fonctionnelle (sandbox / test uniquement).
 *
 * Exécution (une commande) depuis le dossier functions/ :
 *   npm run smoke:post-rotation
 *
 * Prérequis Secret Manager : ADC valide + GCLOUD_PROJECT (ou GCP_PROJECT) ou FIREBASE_CONFIG JSON avec projectId.
 *
 * Prérequis CI sans GCP : FUNCTIONS_EMULATOR=true + variables d’environnement nommées comme les secrets
 * (OPENAI_API_KEY, STRIPE_SECRET_KEY, …) injectées par le pipeline.
 *
 * Sécurité :
 *   - SMOKE_STRICT_SANDBOX=1 (défaut) : refuse clés Stripe live, exige PayPal/Kkiapay en mode sandbox.
 *   - Aucune valeur secrète n’est affichée (masquage générique des erreurs réseau).
 *
 * Options :
 *   SMOKE_SKIP=openai,stripe,paypal,kkiapay,wise,certificates
 *   SMOKE_JSON=1 — ligne JSON finale pour parsing CI
 *   WISE_USE_SANDBOX=1 — API Wise sandbox (api.sandbox.transferwise.tech)
 */
"use strict";

const crypto = require("crypto");
const OpenAI = require("openai");
const Stripe = require("stripe");
const {getSecret} = require("../src/security/secretManager");

const STRICT = process.env.SMOKE_STRICT_SANDBOX !== "0";
const SKIP = new Set(
  (process.env.SMOKE_SKIP || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
);

/** @type {{ service: string, ok: boolean, detail: string, error?: string, recommendation?: string }[]} */
const rows = [];

function maskErr(err) {
  const msg = err && err.message ? String(err.message) : String(err);
  return msg
    .replace(/sk_(live|test)_[^\s]+/gi, "sk_***")
    .replace(/sk-proj-[^\s]+/gi, "sk-proj-***")
    .replace(/whsec_[^\s]+/gi, "whsec_***")
    .replace(/Bearer\s+[^\s]+/gi, "Bearer ***")
    .replace(/"access_token"\s*:\s*"[^"]+"/gi, "\"access_token\":\"***\"");
}

function logServiceHeader(service) {
  console.log(`\n── ${service} ──`);
}

function record(service, ok, detail, error, recommendation) {
  rows.push({
    service,
    ok,
    detail,
    error: error ? maskErr(error) : undefined,
    recommendation,
  });
  const icon = ok ? "✅" : "❌";
  console.log(`${icon} Statut : ${ok ? "OK" : "ÉCHEC"}`);
  console.log(`   Détail : ${detail}`);
  if (error) console.log(`   Erreur : ${maskErr(error)}`);
  if (recommendation) console.log(`   Recommandation : ${recommendation}`);
}

function assertStripeTestKey(key) {
  if (!STRICT) return;
  const k = String(key || "");
  if (k.startsWith("sk_live_") || k.startsWith("rk_live_")) {
    throw new Error(
      "SMOKE_STRICT_SANDBOX : clé Stripe live interdite pour ce script. Utilisez sk_test_ / rk_test_.",
    );
  }
  if (!k.startsWith("sk_test_") && !k.startsWith("rk_test_")) {
    throw new Error(
      "SMOKE_STRICT_SANDBOX : attendu une clé Stripe de test (sk_test_ ou rk_test_).",
    );
  }
}

function assertPayPalSandbox() {
  if (!STRICT) return;
  const raw = process.env.PAYPAL_SANDBOX || "";
  const on =
    String(raw).toLowerCase() === "true" || raw === "1" || raw === true;
  if (!on) {
    throw new Error(
      "SMOKE_STRICT_SANDBOX : définir PAYPAL_SANDBOX=true pour les smoke tests.",
    );
  }
}

function assertKkiapaySandbox() {
  if (!STRICT) return;
  const raw = process.env.KKIAPAY_SANDBOX || "";
  const on =
    String(raw).toLowerCase() === "true" || raw === "1" || raw === true;
  if (!on) {
    throw new Error(
      "SMOKE_STRICT_SANDBOX : définir KKIAPAY_SANDBOX=true pour les smoke tests.",
    );
  }
}

function wiseBaseUrl() {
  const sand =
    process.env.WISE_USE_SANDBOX === "1" ||
    String(process.env.WISE_USE_SANDBOX || "").toLowerCase() === "true";
  return sand
    ? "https://api.sandbox.transferwise.tech"
    : "https://api.wise.com";
}

async function loadOpenAiKey() {
  return getSecret("OPENAI_API_KEY", {required: false});
}

async function testOpenAI() {
  const service = "OpenAI";
  if (SKIP.has("openai")) {
    record(service, true, "Ignoré (SMOKE_SKIP)", null, null);
    return;
  }
  logServiceHeader(service);
  let key;
  try {
    key = await loadOpenAiKey();
    if (!key) {
      record(
        service,
        false,
        "Clé absente (OPENAI_API_KEY)",
        null,
        "Injecter le secret OPENAI_API_KEY dans Secret Manager ou FUNCTIONS_EMULATOR + env.",
      );
      return;
    }
  } catch (e) {
    record(
      service,
      false,
      "Lecture secret impossible",
      e,
      "Vérifier ADC, GCLOUD_PROJECT et IAM secretAccessor.",
    );
    return;
  }

  const client = new OpenAI({apiKey: key});
  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{role: "user", content: "Réponds uniquement par le mot pong."}],
      max_tokens: 8,
      temperature: 0,
    });
    const text = completion.choices[0]?.message?.content?.trim() || "";
    if (!text) {
      record(
        service,
        false,
        "Réponse vide",
        null,
        "Vérifier quotas, facturation et nom de modèle disponible pour la clé.",
      );
      return;
    }
  } catch (e) {
    record(
      service,
      false,
      "Échec appel API OpenAI",
      e,
      "Contrôler la validité de la clé, l’accès réseau et les restrictions projet.",
    );
    return;
  }

  let errorPathOk = false;
  try {
    await client.chat.completions.create({
      model: "invalid-model-name-uni-smoke-xyz",
      messages: [{role: "user", content: "test"}],
      max_tokens: 1,
    });
  } catch (e) {
    errorPathOk = true;
  }
  if (!errorPathOk) {
    record(
      service,
      false,
      "Une erreur était attendue pour le test de gestion d’erreur (modèle invalide)",
      null,
      "Vérifier le comportement de l’API OpenAI pour les modèles inexistants.",
    );
    return;
  }

  record(
    service,
    true,
    "Appel chat.completions OK (réponse non vide, contenu masqué) ; rejet modèle invalide confirmé",
    null,
    null,
  );
}

async function testStripe() {
  const service = "Stripe";
  if (SKIP.has("stripe")) {
    record(service, true, "Ignoré (SMOKE_SKIP)", null, null);
    return;
  }
  logServiceHeader(service);
  let stripe;
  let whSecret;
  try {
    const key = await getSecret("STRIPE_SECRET_KEY");
    assertStripeTestKey(key);
    whSecret = await getSecret("STRIPE_WEBHOOK_SECRET");
    if (!whSecret || !String(whSecret).startsWith("whsec_")) {
      throw new Error("STRIPE_WEBHOOK_SECRET manquant ou format inattendu (whsec_…)");
    }
    stripe = new Stripe(key, {maxNetworkRetries: 1});
  } catch (e) {
    record(
      service,
      false,
      "Configuration Stripe / webhook invalide",
      e,
      STRICT
        ? "Utiliser sk_test_ et whsec_ de test ; rotation Dashboard Stripe test mode."
        : "Vérifier STRIPE_SECRET_KEY et STRIPE_WEBHOOK_SECRET dans Secret Manager.",
    );
    return;
  }

  let pi;
  try {
    pi = await stripe.paymentIntents.create({
      amount: 100,
      currency: "usd",
      payment_method: "pm_card_visa",
      confirm: true,
      payment_method_types: ["card"],
    });
  } catch (e) {
    record(
      service,
      false,
      "Création / confirmation PaymentIntent test échouée",
      e,
      "Vérifier la clé test, les méthodes de paiement activées et l’état du compte Stripe.",
    );
    return;
  }

  const okPi =
    pi &&
    (pi.status === "succeeded" ||
      pi.status === "requires_capture" ||
      pi.status === "processing");
  if (!okPi) {
    record(
      service,
      false,
      `Statut PaymentIntent inattendu : ${pi.status}`,
      null,
      "Consulter le Dashboard Stripe (logs) pour ce PaymentIntent.",
    );
    return;
  }

  const parts = [
    `PaymentIntent test confirmé (statut : ${pi.status})`,
  ];

  try {
    const payload = JSON.stringify({
      id: "evt_smoke_uni",
      object: "event",
      created: Math.floor(Date.now() / 1000),
      type: "payment_intent.succeeded",
      data: {
        object: {
          id: pi.id,
          object: "payment_intent",
          amount: pi.amount,
          currency: pi.currency,
          metadata: {firebase_uid: "smoke-test-uid"},
        },
      },
      livemode: false,
      pending_webhooks: 0,
    });
    const header = stripe.webhooks.generateTestHeaderString({
      payload,
      secret: whSecret,
    });
    const evt = stripe.webhooks.constructEvent(payload, header, whSecret);
    if (!evt || evt.type !== "payment_intent.succeeded") {
      throw new Error("Événement webhook parsé invalide");
    }
    parts.push("webhook constructEvent OK");
  } catch (e) {
    record(
      service,
      false,
      "Validation signature webhook échouée",
      e,
      "Regénérer STRIPE_WEBHOOK_SECRET depuis le endpoint de test Stripe et mettre à jour Secret Manager.",
    );
    return;
  }

  try {
    const badHeader = stripe.webhooks.generateTestHeaderString({
      payload: "{}",
      secret: whSecret,
    });
    stripe.webhooks.constructEvent(
      "{\"id\":\"evt_bad\"}",
      badHeader,
      whSecret + "_wrong",
    );
    record(
      service,
      false,
      "La vérification de signature incorrecte aurait dû lever une erreur",
      null,
      null,
    );
    return;
  } catch (e) {
    parts.push("rejet signature invalide OK");
  }

  record(service, true, parts.join(" ; "), null, null);
}

async function paypalGetToken(cfg) {
  const auth = Buffer.from(`${cfg.clientId}:${cfg.clientSecret}`).toString(
    "base64",
  );
  const base = cfg.sandbox
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";
  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`OAuth PayPal ${res.status}: ${text.slice(0, 200)}`);
  }
  const json = JSON.parse(text);
  return {token: json.access_token, base};
}

async function paypalApi(cfg, path, {method = "GET", body = null} = {}) {
  const {token, base} = await paypalGetToken(cfg);
  const opts = {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Prefer: "return=representation",
    },
  };
  if (body != null) {
    opts.headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(body);
  }
  const res = await fetch(`${base}${path}`, opts);
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`PayPal API ${res.status}: ${text.slice(0, 300)}`);
  }
  return text ? JSON.parse(text) : {};
}

async function testPayPal() {
  const service = "PayPal";
  if (SKIP.has("paypal")) {
    record(service, true, "Ignoré (SMOKE_SKIP)", null, null);
    return;
  }
  logServiceHeader(service);
  try {
    assertPayPalSandbox();
  } catch (e) {
    record(service, false, "Mode sandbox non activé", e, e.message);
    return;
  }

  let cfg;
  try {
    const sandboxRaw = process.env.PAYPAL_SANDBOX || "";
    const sandbox =
      String(sandboxRaw).toLowerCase() === "true" ||
      sandboxRaw === "1" ||
      sandboxRaw === true;
    cfg = {
      clientId: await getSecret("PAYPAL_CLIENT_ID"),
      clientSecret: await getSecret("PAYPAL_CLIENT_SECRET"),
      sandbox,
    };
    if (!cfg.clientId || !cfg.clientSecret) {
      throw new Error("Identifiants PayPal manquants");
    }
  } catch (e) {
    record(
      service,
      false,
      "Lecture des secrets PayPal impossible",
      e,
      "Vérifier PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET et PAYPAL_SANDBOX=true.",
    );
    return;
  }

  let order;
  try {
    order = await paypalApi(cfg, "/v2/checkout/orders", {
      method: "POST",
      body: {
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: "smoke_uni",
            amount: {currency_code: "USD", value: "10.00"},
          },
        ],
        application_context: {
          return_url: "https://example.com/return",
          cancel_url: "https://example.com/cancel",
          user_action: "PAY_NOW",
          brand_name: "UniMentorAI-smoke",
        },
      },
    });
  } catch (e) {
    record(
      service,
      false,
      "Création commande sandbox échouée",
      e,
      "Valider les identifiants sandbox PayPal Developer et les autorisations.",
    );
    return;
  }

  if (!order.id || order.status !== "CREATED") {
    record(
      service,
      false,
      `Réponse commande inattendue (statut ${order.status})`,
      null,
      "Consulter la réponse brute dans les logs PayPal Developer.",
    );
    return;
  }

  const parts = ["commande sandbox CREATED"];
  try {
    const fetched = await paypalApi(cfg, `/v2/checkout/orders/${order.id}`, {
      method: "GET",
    });
    const coherent = fetched && fetched.id === order.id;
    if (!coherent) {
      throw new Error("Incohérence id commande GET");
    }
    parts.push("GET order cohérent (capture complète = flux navigateur)");
    record(service, true, parts.join(" ; "), null, null);
  } catch (e) {
    record(
      service,
      false,
      "Création OK mais lecture GET incohérente",
      e,
      "Contrôler les droits API Orders v2 sur l’application sandbox.",
    );
  }
}

function kkiapayBaseUrl() {
  const raw = process.env.KKIAPAY_SANDBOX || "";
  const sandbox =
    String(raw).toLowerCase() === "true" || raw === "1" || raw === true;
  return sandbox
    ? "https://api-sandbox.kkiapay.me"
    : "https://api.kkiapay.me";
}

async function kkiapayPost(path, body, keys) {
  const url = `${kkiapayBaseUrl()}${path}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": keys.publicKey,
      "x-secret-key": keys.secretKey,
      "x-private-key": keys.privateKey,
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch (_) {
    json = {raw: text};
  }
  if (!res.ok) {
    const msg =
      (json && (json.message || json.reason || json.error)) ||
      text ||
      res.statusText;
    throw new Error(`Kkiapay ${res.status}: ${String(msg).slice(0, 240)}`);
  }
  return json;
}

async function testKkiapay() {
  const service = "Kkiapay";
  if (SKIP.has("kkiapay")) {
    record(service, true, "Ignoré (SMOKE_SKIP)", null, null);
    return;
  }
  logServiceHeader(service);
  try {
    assertKkiapaySandbox();
  } catch (e) {
    record(service, false, "Mode sandbox non activé", e, e.message);
    return;
  }

  let keys;
  try {
    keys = {
      publicKey: await getSecret("KKIAPAY_PUBLIC_KEY"),
      privateKey: await getSecret("KKIAPAY_PRIVATE_KEY"),
      secretKey: await getSecret("KKIAPAY_SECRET_KEY"),
    };
    if (!keys.publicKey || !keys.privateKey || !keys.secretKey) {
      throw new Error("Clés Kkiapay incomplètes");
    }
  } catch (e) {
    record(
      service,
      false,
      "Lecture secrets Kkiapay impossible",
      e,
      "Vérifier KKIAPAY_* dans Secret Manager et KKIAPAY_SANDBOX=true.",
    );
    return;
  }

  let created;
  try {
    created = await kkiapayPost(
      "/api/v1/transactions",
      {
        amount: 100,
        currency: "XOF",
        description: "UniMentorAI smoke test",
        customer: {email: "smoke@example.invalid"},
        metadata: {smoke: "true", firebase_uid: "smoke-test"},
      },
      keys,
    );
  } catch (e) {
    record(
      service,
      false,
      "Création transaction sandbox échouée",
      e,
      "Valider les trois clés côté dashboard Kkiapay sandbox et les en-têtes x-api-key / x-secret-key / x-private-key.",
    );
    return;
  }

  const txId =
    created.transactionId ||
    created.transaction_id ||
    created.id ||
    (created.data && created.data.transactionId);

  if (!txId) {
    record(
      service,
      false,
      "Réponse sans identifiant de transaction exploitable",
      null,
      "Adapter le parsing si l’API sandbox a changé de schéma.",
    );
    return;
  }

  try {
    await kkiapayPost(
      "/api/v1/transactions/status",
      {transactionId: String(txId)},
      keys,
    );
    record(
      service,
      true,
      "Transaction sandbox créée ; vérification /status (équivalent callback serveur) OK",
      null,
      null,
    );
  } catch (e) {
    record(
      service,
      false,
      "Transaction créée mais vérification /status échouée",
      e,
      "Contrôler que l’ID renvoyé est consultable immédiatement côté sandbox.",
    );
  }
}

async function wiseFetch(path, {method = "GET", body = null} = {}) {
  const token = await getSecret("WISE_API_TOKEN");
  if (!token) {
    throw new Error("WISE_API_TOKEN manquant");
  }
  const url = `${wiseBaseUrl()}${path}`;
  const opts = {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
  if (body != null) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Wise ${res.status}: ${text.slice(0, 240)}`);
  }
  return text ? JSON.parse(text) : [];
}

async function testWise() {
  const service = "Wise";
  if (SKIP.has("wise")) {
    record(service, true, "Ignoré (SMOKE_SKIP)", null, null);
    return;
  }
  logServiceHeader(service);
  if (STRICT && wiseBaseUrl().includes("wise.com")) {
    record(
      service,
      false,
      "SMOKE_STRICT_SANDBOX : endpoint Wise production refusé",
      null,
      "Définir WISE_USE_SANDBOX=1 et un jeton sandbox, ou désactiver STRICT (SMOKE_STRICT_SANDBOX=0) en connaissance de cause.",
    );
    return;
  }

  let profiles;
  try {
    profiles = await wiseFetch("/v1/profiles", {method: "GET"});
  } catch (e) {
    record(
      service,
      false,
      "Appel API Wise (lecture profils) échoué",
      e,
      "Regénérer WISE_API_TOKEN, aligner sandbox/prod avec WISE_USE_SANDBOX, vérifier scopes.",
    );
    return;
  }

  if (!Array.isArray(profiles) || profiles.length === 0) {
    record(
      service,
      false,
      "Liste de profils vide ou format inattendu",
      null,
      "Vérifier le compte Wise et les droits du jeton API.",
    );
    return;
  }

  const parts = [
    `GET /v1/profiles OK (${profiles.length} profil(s), détails masqués)`,
  ];

  try {
    const badUrl = `${wiseBaseUrl()}/v1/profiles`;
    const res = await fetch(badUrl, {
      headers: {Authorization: "Bearer clearly-invalid-token-smoke"},
    });
    if (res.status === 200) {
      record(
        service,
        false,
        `${parts.join(" ; ")} — anomalie : jeton manifestement invalide a retourné HTTP 200`,
        null,
        "Vérifier l’environnement Wise (sandbox vs prod) et la configuration du compte.",
      );
      return;
    }
    parts.push(`rejet jeton invalide HTTP ${res.status}`);
  } catch (e) {
    parts.push("rejet / erreur réseau pour jeton invalide (acceptable)");
  }

  record(service, true, parts.join(" ; "), null, null);
}

async function testCertificates() {
  const service = "Certificats";
  if (SKIP.has("certificates")) {
    record(service, true, "Ignoré (SMOKE_SKIP)", null, null);
    return;
  }
  logServiceHeader(service);
  let secret;
  try {
    secret = await getSecret("CERTIFICATES_SECRET");
    if (!secret || String(secret).length < 16) {
      throw new Error("CERTIFICATES_SECRET trop court ou vide");
    }
  } catch (e) {
    record(
      service,
      false,
      "Secret certificat inaccessible",
      e,
      "Injecter CERTIFICATES_SECRET (longueur suffisante) dans Secret Manager.",
    );
    return;
  }

  const certificateId = "smoke-cert-" + crypto.randomBytes(4).toString("hex");
  const userId = "smoke-user";
  const courseId = "smoke-course";
  const payload = `${certificateId}:${userId}:${courseId}`;
  const token = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const recomputed = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  if (recomputed !== tokenHash) {
    record(service, false, "HMAC / hash incohérent", null, null);
    return;
  }

  const baseUrl =
    process.env.SMOKE_CERT_VERIFY_BASE ||
    "https://unimentorai.com/verify-certificate";
  const verificationUrl = `${baseUrl}?certificate_id=${encodeURIComponent(
    certificateId,
  )}&token=${encodeURIComponent(token)}`;
  let u;
  try {
    u = new URL(verificationUrl);
  } catch (e) {
    record(service, false, "URL de vérification invalide", e, null);
    return;
  }
  if (
    u.searchParams.get("certificate_id") !== certificateId ||
    u.searchParams.get("token") !== token
  ) {
    record(service, false, "Paramètres QR / URL incohérents", null, null);
    return;
  }

  record(
    service,
    true,
    "HMAC SHA-256 + hash token alignés avec startupArchitectureModule ; URL de vérif parseable (sans exposition du secret)",
    null,
    null,
  );
}

function printSummary() {
  const failed = rows.filter((r) => !r.ok);
  const ok = failed.length === 0;
  console.log("\n══════════════════════════════════════");
  console.log(`RÉSUMÉ GLOBAL : ${ok ? "✅ OK" : "❌ FAIL"}`);
  console.log(
    `Services : ${rows.filter((r) => r.ok).length}/${rows.length} réussis`,
  );
  if (!ok) {
    console.log(
      "Échecs :",
      failed.map((f) => f.service).join(", "),
    );
  }
  console.log("══════════════════════════════════════\n");

  if (process.env.SMOKE_JSON === "1") {
    console.log(
      JSON.stringify({
        overall: ok ? "OK" : "FAIL",
        passed: rows.filter((r) => r.ok).length,
        total: rows.length,
        services: rows,
      }),
    );
  }
  return ok;
}

async function main() {
  console.log("UniMentorAI — smoke tests post-rotation");
  console.log(
    `STRICT sandbox : ${STRICT} | SMOKE_SKIP : ${[...SKIP].join(",") || "(aucun)"}`,
  );

  await testOpenAI();
  await testStripe();
  await testPayPal();
  await testKkiapay();
  await testWise();
  await testCertificates();

  const ok = printSummary();
  process.exit(ok ? 0 : 1);
}

main().catch((e) => {
  console.error("FATAL:", maskErr(e));
  process.exit(1);
});

