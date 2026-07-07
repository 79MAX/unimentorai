const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Stripe = require("stripe");

admin.initializeApp();
const db = admin.firestore();

const stripe = new Stripe(functions.config().stripe.secret, {
  apiVersion: "2023-10-16",
});

// ===============================
// 🔐 UTILS
// ===============================
function requireAuth(context) {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User not authenticated");
  }
  return context.auth.uid;
}

// ===============================
// 🚀 CREATE CHECKOUT SESSION
// ===============================
exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
  try {
    const userId = requireAuth(context);

    const { priceId, successUrl, cancelUrl, courseId } = data;

    if (!priceId || !successUrl || !cancelUrl) {
      throw new functions.https.HttpsError("invalid-argument", "Missing parameters");
    }

    // 🔁 Idempotency (anti double paiement)
    const existing = await db.collection("payments")
      .where("userId", "==", userId)
      .where("courseId", "==", courseId || null)
      .where("status", "==", "pending")
      .limit(1)
      .get();

    if (!existing.empty) {
      return { url: existing.docs[0].data().checkoutUrl };
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
        courseId: courseId || "",
      },
    });

    // 💾 Save pending payment
    await db.collection("payments").add({
      userId,
      courseId: courseId || null,
      status: "pending",
      checkoutUrl: session.url,
      stripeSessionId: session.id,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { url: session.url };

  } catch (error) {
    console.error("Checkout error:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});

// ===============================
// 🔔 STRIPE WEBHOOK (PRODUCTION SAFE)
// ===============================
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      functions.config().stripe.webhook_secret
    );
  } catch (err) {
    console.error("❌ Signature error:", err.message);
    return res.status(400).send(`Webhook Error`);
  }

  try {
    switch (event.type) {

      // ===============================
      // ✅ PAYMENT SUCCESS
      // ===============================
      case "checkout.session.completed": {
        const session = event.data.object;

        const userId = session.metadata.userId;
        const courseId = session.metadata.courseId || null;

        // 🔁 éviter double traitement
        const existing = await db.collection("payments")
          .where("stripeSessionId", "==", session.id)
          .where("status", "==", "success")
          .limit(1)
          .get();

        if (!existing.empty) {
          console.log("Already processed");
          break;
        }

        await db.collection("payments")
          .where("stripeSessionId", "==", session.id)
          .get()
          .then(snapshot => {
            snapshot.forEach(doc => {
              doc.ref.update({
                status: "success",
                amount: session.amount_total / 100,
                currency: session.currency,
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
              });
            });
          });

        // 🎓 Accès cours (IMPORTANT business)
        if (courseId) {
          await db.collection("course_access").add({
            userId,
            courseId,
            grantedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        }

        console.log("✅ Payment success:", userId);
        break;
      }

      // ===============================
      // ❌ PAYMENT FAILED
      // ===============================
      case "payment_intent.payment_failed": {
        console.log("❌ Payment failed:", event.data.object.id);
        break;
      }

      default:
        console.log("Unhandled:", event.type);
    }

    res.status(200).send("OK");

  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).send("Server error");
  }
});const axios = require("axios");

// ===============================
// 📱 MOBILE MONEY - KKIAPAY
// ===============================
exports.createMobileMoneyPayment = functions.https.onCall(async (data, context) => {
  try {
    const userId = requireAuth(context);

    const { amount, phone, courseId } = data;

    if (!amount || !phone) {
      throw new functions.https.HttpsError("invalid-argument", "Missing parameters");
    }

    // 🔁 Anti double paiement
    const existing = await db.collection("payments")
      .where("userId", "==", userId)
      .where("status", "==", "pending")
      .limit(1)
      .get();

    if (!existing.empty) {
      return existing.docs[0].data();
    }

    // 📡 Appel API Kkiapay
    const response = await axios.post(
      "https://api.kkiapay.me/api/v1/transactions",
      {
        amount: amount,
        phone: phone,
        reason: "Paiement UniMentorAI",
      },
      {
        headers: {
          "Authorization": `Bearer ${functions.config().kkiapay.secret_key}`,
          "Content-Type": "application/json",
        },
      }
    );

    const transaction = response.data;

    // 💾 Sauvegarde
    await db.collection("payments").add({
      userId,
      courseId: courseId || null,
      amount,
      phone,
      provider: "kkiapay",
      status: "pending",
      transactionId: transaction.transactionId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      success: true,
      transactionId: transaction.transactionId,
    };

  } catch (error) {
    console.error("Mobile Money error:", error.response?.data || error.message);
    throw new functions.https.HttpsError("internal", "Payment failed");
  }
});exports.kkiapayWebhook = functions.https.onRequest(async (req, res) => {
  try {
    const event = req.body;

    if (!event || !event.transactionId) {
      return res.status(400).send("Invalid");
    }

    const transactionId = event.transactionId;
    const status = event.status; // SUCCESS / FAILED

    const snapshot = await db.collection("payments")
      .where("transactionId", "==", transactionId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).send("Not found");
    }

    const doc = snapshot.docs[0];

    if (status === "SUCCESS") {
      await doc.ref.update({
        status: "success",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // 🎓 Donner accès au cours
      const payment = doc.data();

      if (payment.courseId) {
        await db.collection("course_access").add({
          userId: payment.userId,
          courseId: payment.courseId,
          grantedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      console.log("✅ Mobile Money success");
    }

    if (status === "FAILED") {
      await doc.ref.update({
        status: "failed",
      });
    }

    res.status(200).send("OK");

  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).send("Error");
  }
});

