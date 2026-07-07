
const PaymentService = require("./payment.service");

/**
 * ========================
 * 💰 PAYMENT CONTROLLER
 * HTTP LAYER ONLY (CLEAN ARCHITECTURE)
 * ========================
 */
class PaymentController {

  /**
   * ========================
   * 💰 CREATE PAYMENT
   * ========================
   */
  async create(req, res) {

    try {

      const payment = await PaymentService.createPayment({
        userId: req.user.userId,
        ...req.body
      });

      return res.status(201).json({
        success: true,
        message: "Payment created successfully",
        data: payment
      });

    } catch (err) {

      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
  }

  /**
   * ========================
   * ✅ CONFIRM PAYMENT
   * ========================
   */
  async confirm(req, res) {

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
  }

  /**
   * ========================
   * 📊 GET USER PAYMENTS
   * ========================
   */
  async getMyPayments(req, res) {

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
  }

  /**
   * ========================
   * 🔎 GET PAYMENT BY REFERENCE
   * ========================
   */
  async getByReference(req, res) {

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
  }
}

module.exports = new PaymentController();
