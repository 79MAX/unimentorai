import express from "express";

const router = express.Router();

/* =========================
   🧠 USER STORE (MEMORY - À remplacer par MongoDB)
========================= */
const USERS = new Map();

/* =========================
   🧾 IDEMPOTENCE KEY STORE
   (Empêche le traitement double du même webhook)
========================= */
const PROCESSED_WEBHOOKS = new Map();
const IDEMPOTENCE_TTL = 24 * 60 * 60 * 1000; // 24h

/* =========================
   🔐 ALLOWED PROVIDERS
========================= */
const ALLOWED_PROVIDERS = new Set(["stripe"]);

/* =========================
   ✅ VALID STATUSES
========================= */
const SUCCESS_STATUSES = new Set([
  "success",
  "completed",
  "paid",
  "succeeded",
  "charge.succeeded",
  "checkout.session.completed"
]);

/* =========================
   🔑 STRIPE SIGNATURE VERIFICATION
   (CRUCIAL - Empêche les faux webhooks)
========================= */
function verifyStripeSignature(req, stripeSecret) {
  const signature = req.headers["stripe-signature"];
  
  if (!signature || !stripeSecret) {
    console.error("❌ Missing Stripe signature or secret");
    return false;
  }

  // Note: En production, utiliser la library stripe
  // const stripe = require("stripe")(stripeSecret);
  // try {
  //   const event = stripe.webhooks.constructEvent(
  //     req.body,
  //     signature,
  //     endpointSecret
  //   );
  //   return event;
  // } catch (err) {
  //   console.error("❌ Signature verification failed:", err.message);
  //   return null;
  // }

  // Version simplifiée pour cet exemple (voir ci-dessus pour la vraie)
  return signature.startsWith("sig_");
}

/* =========================
   🌍 PARSE EVENT (SUPPORT MULTI-FORMAT)
========================= */
function parseWebhookEvent(event) {
  // Stripe v3+ format (event directement dans body)
  if (event.type && event.data?.object) {
    return {
      provider: "stripe",
      email: event.data.object.customer_email || event.data.object.email,
      status: event.type.replace(".", "_"), // "charge.succeeded" -> "charge_succeeded"
      webhookId: event.id,
      created: event.created
    };
  }

  // Ancien format ou provider alternatif
  return {
    provider: event.provider || "UNKNOWN",
    email: event.customer_email || event.data?.customer_email || event.email || null,
    status: event.status || event.data?.status || null,
    webhookId: event.id || event.webhook_id || null,
    created: event.created || Date.now()
  };
}

/* =========================
   👤 FIND OR CREATE USER
========================= */
function findOrCreateUser(email) {
  let user = USERS.get(email);
  
  if (!user) {
    user = {
      email,
      plan: "FREE",
      createdAt: new Date().toISOString()
    };
  }
  
  return user;
}

/* =========================
   💎 UPGRADE USER TO PRO
========================= */
function upgradeToPro(user, provider, webhookId) {
  const now = new Date().toISOString();
  
  // Mettre à jour le user
  user.plan = "PRO";
  user.paymentProvider = provider;
  user.proActivatedAt = now;
  user.lastWebhookId = webhookId;
  
  // Sauvegarder
  USERS.set(user.email, user);
  
  return user;
}

/* =========================
   💰 STRIPE WEBHOOK ENDPOINT
========================= */
router.post("/stripe-webhook", async (req, res) => {

  const STRIPE_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
  const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;

  /* =========================
     1️⃣ SIGNATURE VERIFICATION (OBLIGATOIRE)
  ========================= */
  if (!verifyStripeSignature(req, STRIPE_SECRET)) {
    console.error("❌ Invalid Stripe signature");
    return res.status(403).json({
      success: false,
      code: "INVALID_SIGNATURE",
      message: "Invalid webhook signature"
    });
  }

  try {

    const rawEvent = req.body;
    
    /* =========================
       2️⃣ PARSE EVENT
    ========================= */
    const event = parseWebhookEvent(rawEvent);

    /* =========================
       3️⃣ BLOCKLIST PROVIDER
    ========================= */
    if (!ALLOWED_PROVIDERS.has(event.provider)) {
      console.error("❌ Blocked unknown provider:", event.provider);
      return res.status(400).json({
        success: false,
        code: "UNKNOWN_PROVIDER",
        message: "Provider not supported"
      });
    }

    const { email, status, webhookId } = event;

    /* =========================
       4️⃣ IDEMPOTENCE CHECK
    ========================= */
    if (webhookId && PROCESSED_WEBHOOKS.has(webhookId)) {
      console.log("⏭️ Duplicate webhook skipped:", webhookId);
      return res.status(200).json({
        success: true,
        code: "ALREADY_PROCESSED",
        message: "Webhook already processed"
      });
    }

    /* =========================
       5️⃣ VALIDATION
    ========================= */
    if (!email) {
      return res.status(400).json({
        success: false,
        code: "INVALID_EMAIL",
        message: "Email is required"
      });
    }

    if (!status || !SUCCESS_STATUSES.has(status)) {
      console.log("⚠️ Non-payment event skipped:", status);
      return res.status(200).json({ success: true }); // Retourner 200 pour dire à Stripe "recu"
    }

    /* =========================
       6️⃣ UPGRADE USER
    ========================= */
    let user = findOrCreateUser(email);
    
    // Ne pas downgrader si déjà PRO (optionnel: garder historique)
    if (user.plan === "FREE") {
      user = upgradeToPro(user, event.provider, webhookId);
      
      console.log("🚀 PRO ACTIVATED:", {
        email: user.email,
        provider: user.paymentProvider,
        webhookId
      });
    }

    /* =========================
       7️⃣ MARK AS PROCESSED
    ========================= */
    if (webhookId) {
      PROCESSED_WEBHOOKS.set(webhookId, Date.now());
      
      // Cleanup vieuxwebhooks ( toutes les 24h)
      const now = Date.now();
      for (const [id, time] of PROCESSED_WEBHOOKS) {
        if (now - time > IDEMPOTENCE_TTL) {
          PROCESSED_WEBHOOKS.delete(id);
        }
      }
    }

    /* =========================
       ✅ SUCCESS RESPONSE
    ========================= */
    return res.status(200).json({
      success: true,
      code: "PRO_ACTIVATED",
      message: "User upgraded to PRO",
      user: {
        email: user.email,
        plan: user.plan
      }
    });

  } catch (error) {
    console.error("[WEBHOOK_ERROR]", error);

    return res.status(500).json({
      success: false,
      code: "WEBHOOK_ERROR",
      message: "Webhook processing failed"
    });
  }
});

/* =========================
   🔧 UTILITY ROUTES (DEV ONLY)
========================= */
router.get("/users", (req, res) => {
  const adminKey = req.headers["x-admin-key"];
  
  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(403).json({ success: false, code: "FORBIDDEN" });
  }
  
  return res.json({
    count: USERS.size,
    users: Array.from(USERS.values()).map(u => ({
      email: u.email,
      plan: u.plan,
      activatedAt: u.proActivatedAt
    }))
  });
});

export default router;

