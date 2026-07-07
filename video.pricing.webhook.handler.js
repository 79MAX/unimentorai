
/**
 * ==========================================
 * 🔔 VIDEO PRICING WEBHOOK HANDLER
 * UniMentorAI External Event Gateway
 * ==========================================
 * Handles external pricing/billing events:
 * - payment confirmations
 * - refunds
 * - subscription updates
 * - pricing triggers
 */

const crypto = require("crypto");

class VideoPricingWebhookHandler {

  constructor({ billingEngine, events, tracker }) {
    this.billingEngine = billingEngine;
    this.events = events;
    this.tracker = tracker;
  }

  /**
   * ==========================================
   * MAIN WEBHOOK ENTRY POINT
   * ==========================================
   */
  async handle(req, res) {

    try {

      const event = req.body;

      // ======================================
      // SECURITY CHECK (SIGNATURE VALIDATION)
      // ======================================
      if (!this.verifySignature(req)) {
        return res.status(401).json({
          error: "INVALID_SIGNATURE"
        });
      }

      // ======================================
      // ROUTE EVENT TYPE
      // ======================================
      switch (event.type) {

        case "payment.success":
          return this.handlePaymentSuccess(event, res);

        case "payment.failed":
          return this.handlePaymentFailed(event, res);

        case "refund.created":
          return this.handleRefund(event, res);

        case "subscription.updated":
          return this.handleSubscriptionUpdate(event, res);

        default:
          return res.json({
            status: "IGNORED_EVENT"
          });
      }

    } catch (error) {

      return res.status(500).json({
        error: "WEBHOOK_PROCESSING_ERROR",
        message: error.message
      });
    }
  }

  /**
   * ==========================================
   * PAYMENT SUCCESS HANDLER
   * ==========================================
   */
  handlePaymentSuccess(event, res) {

    const payment = event.data;

    // Update billing engine
    const record =
      this.billingEngine.confirmPayment(
        payment.billingId,
        {
          provider: payment.provider,
          transactionId: payment.transactionId
        }
      );

    // Log event
    this.events.paymentEvent({
      userId: payment.userId,
      sessionId: payment.sessionId,
      billingId: payment.billingId,
      amount: payment.amount,
      status: "SUCCESS"
    });

    // Track revenue
    this.tracker.track({
      type: "SESSION_REVENUE",
      userId: payment.userId,
      sessionId: payment.sessionId,
      amount: payment.amount,
      status: "recorded"
    });

    return res.json({
      status: "PAYMENT_CONFIRMED",
      record
    });
  }

  /**
   * ==========================================
   * PAYMENT FAILED HANDLER
   * ==========================================
   */
  handlePaymentFailed(event, res) {

    const payment = event.data;

    this.events.systemEvent({
      type: "PAYMENT_FAILED",
      userId: payment.userId,
      amount: payment.amount,
      status: "FAILED"
    });

    return res.json({
      status: "PAYMENT_FAILED_RECORDED"
    });
  }

  /**
   * ==========================================
   * REFUND HANDLER
   * ==========================================
   */
  handleRefund(event, res) {

    const refund = event.data;

    this.events.refundEvent({
      userId: refund.userId,
      billingId: refund.billingId,
      amount: refund.amount,
      status: "REFUNDED"
    });

    return res.json({
      status: "REFUND_PROCESSED"
    });
  }

  /**
   * ==========================================
   * SUBSCRIPTION UPDATE HANDLER
   * ==========================================
   */
  handleSubscriptionUpdate(event, res) {

    const sub = event.data;

    this.events.systemEvent({
      type: "SUBSCRIPTION_UPDATE",
      userId: sub.userId,
      metadata: {
        plan: sub.plan,
        status: sub.status
      }
    });

    return res.json({
      status: "SUBSCRIPTION_UPDATED"
    });
  }

  /**
   * ==========================================
   * SIGNATURE VERIFICATION (SECURITY CORE)
   * ==========================================
   */
  verifySignature(req) {

    const signature =
      req.headers["x-signature"];

    const payload =
      JSON.stringify(req.body);

    const secret =
      process.env.WEBHOOK_SECRET || "default_secret";

    const hash =
      crypto
        .createHmac("sha256", secret)
        .update(payload)
        .digest("hex");

    return hash === signature;
  }
}

module.exports =
  VideoPricingWebhookHandler;
