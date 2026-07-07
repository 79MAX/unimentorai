
const express = require("express");
const router = express.Router();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const PaymentService = require("./payment.service");
const authMiddleware = require("../auth/auth.middleware");

/**
 * ========================
 * 💰 STRIPE CHECKOUT SESSION
 * ========================
 * Create Stripe payment session for courses or subscriptions
 */
router.post("/stripe/checkout", authMiddleware, async (req, res) => {

  try {

    const { courseId, amount, currency = "usd", type } = req.body;

    // ========================
    // 💰 CREATE PAYMENT RECORD FIRST
    // ========================
    const payment = await PaymentService.createPayment({
      userId: req.user.userId,
      type,
      amount,
      method: "stripe",
      courseId
    });

    // ========================
    // ⚡ STRIPE CHECKOUT SESSION
    // ========================
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: type === "course" ? "Course Purchase" : "Subscription"
            },
            unit_amount: amount * 100 // Stripe uses cents
          },
          quantity: 1
        }
      ],

      // ========================
      // 🔁 SUCCESS / CANCEL URL
      // ========================
      success_url: `${process.env.CLIENT_URL}/payment/success`,
      cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,

      // ========================
      // 🧠 IMPORTANT METADATA
      // ========================
      metadata: {
        paymentId: payment._id.toString(),
        userId: req.user.userId,
        courseId: courseId || "",
        type
      }
    });

    return res.status(200).json({
      success: true,
      message: "Stripe checkout session created",
      url: session.url
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

/**
 * ========================
 * 🔎 GET STRIPE SESSION STATUS
 * ========================
 */
router.get("/stripe/session/:sessionId", authMiddleware, async (req, res) => {

  try {

    const session = await stripe.checkout.sessions.retrieve(
      req.params.sessionId
    );

    return res.status(200).json({
      success: true,
      data: session
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;
