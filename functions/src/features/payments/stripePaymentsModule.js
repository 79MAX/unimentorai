const functions = require("firebase-functions");
const admin = require("firebase-admin");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const db = admin.firestore();

// ========================
// 🔐 HELPERS SECURITY
// ========================
function isValidAmount(amount) {
  return typeof amount === "number" && amount > 0 && amount <= 100000;
}

// ========================
// 💳 CREATE PAYMENT INTENT
// ========================
exports.createPaymentIntent = functions.https.onCall(async (data, context) => {
  try {
    if (!context.auth) {
      throw new functions.https.HttpsError("unauthenticated", "Login required");
    }

    const { amount, currency = "usd" } = data;

    if (!isValidAmount(amount)) {
      throw new functions.https.HttpsError("invalid-argument", "Invalid amount");
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      metadata: {
        userId: context.auth.uid
      }
    });

    await db.collection("payments").doc(paymentIntent.id).set({
      userId: context.auth.uid,
      amount,
      currency,
      status: "pending",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return {
      clientSecret: paymentIntent.client_secret
    };

  } catch (error) {
    console.error("createPaymentIntent error:", error);
    throw new functions.https.HttpsError("internal", "Payment init failed");
  }
});

// ========================
// 🔥 STRIPE WEBHOOK (CRITICAL)
// ========================
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature failed");
    return res.status(400).send("Invalid signature");
  }

  try {

    // ========================
    // 💰 PAYMENT SUCCESS
    // ========================
    if (event.type === "payment_intent.succeeded") {

      const payment = event.data.object;

      const ref = db.collection("payments").doc(payment.id);

      await ref.set({
        status: "succeeded",
        stripeId: payment.id,
        userId: payment.metadata.userId,
        amount: payment.amount / 100,
        currency: payment.currency,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

      console.log("Payment success:", payment.id);
    }

    // ========================
    // ❌ PAYMENT FAILED
    // ========================
    if (event.type === "payment_intent.payment_failed") {

      const payment = event.data.object;

      await db.collection("payments").doc(payment.id).set({
        status: "failed",
        userId: payment.metadata.userId,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    }

    return res.json({ received: true });

  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(500).send("Webhook processing failed");
  }
});

// ========================
// 📊 GET USER PAYMENTS
// ========================
exports.getUserPayments = functions.https.onCall(async (data, context) => {

  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Login required");
  }

  const snapshot = await db.collection("payments")
    .where("userId", "==", context.auth.uid)
    .orderBy("createdAt", "desc")
    .get();

  const payments = snapshot.docs.map(doc => doc.data());

  return { payments };
});
