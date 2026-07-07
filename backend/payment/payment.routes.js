
const express = require("express");
const router = express.Router();

const PaymentService = require("./payment.service");
const authMiddleware = require("../auth/auth.middleware");

// ========================
// 💰 CREATE PAYMENT
// ========================
/**
 * @route   POST /api/payment/create
 * @desc    Create payment intent
 * @access  Private
 */
router.post("/create", authMiddleware, async (req, res) => {

  try {

    const payment = await PaymentService.createPayment({
      userId: req.user.userId,
      ...req.body
    });

    return res.status(201).json({
      success: true,
      message: "Payment created",
      data: payment
    });

  } catch (err) {

    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// ========================
// ✅ CONFIRM PAYMENT
// ========================
/**
 * @route   POST /api/payment/confirm
 * @desc    Confirm payment after gateway callback
 * @access  Private
 */
router.post("/confirm", authMiddleware, async (req, res) => {

  try {

    const { paymentId, transactionId } = req.body;

    const payment = await PaymentService.confirmPayment(
      paymentId,
      transactionId
    );

    return res.status(200).json({
      success: true,
      message: "Payment confirmed",
      data: payment
    });

  } catch (err) {

    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// ========================
// 📊 GET USER PAYMENTS
// ========================
/**
 * @route   GET /api/payment/my
 * @desc    Get logged-in user payments
 * @access  Private
 */
router.get("/my", authMiddleware, async (req, res) => {

  try {

    const payments = await PaymentService.getUserPayments(
      req.user.userId
    );

    return res.status(200).json({
      success: true,
      data: payments
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// ========================
// 🔎 GET PAYMENT BY REF
// ========================
/**
 * @route   GET /api/payment/:reference
 * @desc    Get payment by reference
 * @access  Private
 */
router.get("/:reference", authMiddleware, async (req, res) => {

  try {

    const payment = await PaymentService.getPaymentByReference(
      req.params.reference
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: payment
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;
