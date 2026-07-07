
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const PaymentService = require("./payment.service");
const Payment = require("../models/payment.model");

/**
 * ========================
 * ⚡ STRIPE WEBHOOK HANDLER
 * ========================
 * Handles real-time Stripe events
 * - payment success
 * - payment failure
 * - subscription events (future)
 */

const stripeWebhook = async (req, res) => {

  const sig = req.headers["stripe-signature"];

  let event;

  try {

    // ========================
    // 🔐 VERIFY STRIPE SIGNATURE
    // ========================
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

  } catch (err) {

    console.error("❌ Webhook signature verification failed:", err.message);

    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ========================
  // 💰 PAYMENT SUCCESS
  // ========================
  if (event.type === "checkout.session.completed") {

    const session = event.data.object;

    try {

      const paymentId = session.metadata.paymentId;
      const transactionId = session.payment_intent;

      // ========================
      // 💰 UPDATE PAYMENT STATUS
      // ========================
      const payment = await PaymentService.confirmPayment(
        paymentId,
        transactionId
      );

      // ========================
      // 🚀 BUSINESS ACTIONS
      // ========================
      await PaymentService.postPaymentActions(payment);

      console.log("✅ Payment successfully processed via webhook");

    } catch (err) {

      console.error("❌ Payment processing error:", err.message);
    }
  }

  // ========================
  // ❌ PAYMENT FAILED
  // ========================
  if (event.type === "payment_intent.payment_failed") {

    const paymentIntent = event.data.object;

    console.log("❌ Payment failed:", paymentIntent.id);

    // Optional: update DB status
    // await Payment.findOneAndUpdate(...)
  }

  // ========================
  // 💎 SUBSCRIPTION EVENTS (FUTURE READY)
  // ========================
  if (event.type === "invoice.payment_succeeded") {

    console.log("💎 Subscription payment succeeded");
  }

  if (event.type === "customer.subscription.deleted") {

    console.log("⚠️ Subscription canceled");
  }

  // ========================
  // RESPONSE TO STRIPE
  // ========================
  res.json({ received: true });
};

module.exports = stripeWebhook;
