
/**
 * ==========================================
 * 💰 VIDEO BILLING ENGINE
 * UniMentorAI Revenue Core System
 * ==========================================
 * Converts video usage into real billing events:
 * - session billing
 * - real-time charging
 * - invoice generation
 * - revenue tracking
 */

const crypto = require("crypto");

class VideoBillingEngine {

  constructor() {
    this.billingEvents = [];
  }

  /**
   * ==========================================
   * CREATE BILLING RECORD FROM SESSION
   * ==========================================
   */
  createBillingRecord({ session, pricing, user }) {

    const record = {
      billingId: this.generateId(),

      userId: user.userId,
      sessionId: session.sessionId,
      roomId: session.roomId,

      amount: pricing.finalPrice,
      currency: pricing.currency || "USD",

      status: "pending",

      createdAt: Date.now(),

      metadata: {
        role: user.role,
        roomType: session.type,
        breakdown: pricing.breakdown
      }
    };

    this.billingEvents.push(record);

    return record;
  }

  /**
   * ==========================================
   * CONFIRM PAYMENT
   * ==========================================
   */
  confirmPayment(billingId, paymentData = {}) {

    const record =
      this.billingEvents.find(
        b => b.billingId === billingId
      );

    if (!record) {
      return null;
    }

    record.status = "paid";
    record.paymentProvider =
      paymentData.provider || "unknown";

    record.transactionId =
      paymentData.transactionId || null;

    record.paidAt = Date.now();

    return record;
  }

  /**
   * ==========================================
   * CANCEL BILLING
   * ==========================================
   */
  cancelBilling(billingId, reason = "") {

    const record =
      this.billingEvents.find(
        b => b.billingId === billingId
      );

    if (!record) return null;

    record.status = "cancelled";
    record.cancelReason = reason;
    record.cancelledAt = Date.now();

    return record;
  }

  /**
   * ==========================================
   * REVENUE CALCULATION
   * ==========================================
   */
  calculateRevenue(filter = {}) {

    const paid = this.billingEvents.filter(
      b => b.status === "paid"
    );

    const total = paid.reduce(
      (sum, b) => sum + b.amount,
      0
    );

    return {
      totalRevenue: total,
      totalTransactions: paid.length,
      averageTicket:
        paid.length ? total / paid.length : 0
    };
  }

  /**
   * ==========================================
   * USER BILLING HISTORY
   * ==========================================
   */
  getUserBillingHistory(userId) {

    return this.billingEvents.filter(
      b => b.userId === userId
    );
  }

  /**
   * ==========================================
   * SESSION BILLING SUMMARY
   * ==========================================
   */
  getSessionBilling(sessionId) {

    return this.billingEvents.find(
      b => b.sessionId === sessionId
    );
  }

  /**
   * ==========================================
   * FRAUD CHECK (LIGHTWEIGHT SAFETY)
   * ==========================================
   */
  detectAnomalies(record) {

    const flags = [];

    if (record.amount > 500) {
      flags.push("HIGH_VALUE_TRANSACTION");
    }

    if (!record.userId || !record.sessionId) {
      flags.push("MISSING_REFERENCE_DATA");
    }

    if (record.amount <= 0) {
      flags.push("INVALID_AMOUNT");
    }

    return flags;
  }

  /**
   * ==========================================
   * EXPORT INVOICE DATA
   * ==========================================
   */
  generateInvoice(billingId) {

    const record =
      this.billingEvents.find(
        b => b.billingId === billingId
      );

    if (!record) return null;

    return {
      invoiceId: "inv_" + billingId,
      userId: record.userId,
      amount: record.amount,
      currency: record.currency,
      status: record.status,
      issuedAt: Date.now()
    };
  }

  /**
   * ==========================================
   * REVENUE BY TIME WINDOW
   * ==========================================
   */
  revenueByPeriod(start, end) {

    const filtered = this.billingEvents.filter(
      b =>
        b.status === "paid" &&
        b.paidAt >= start &&
        b.paidAt <= end
    );

    return filtered.reduce(
      (sum, b) => sum + b.amount,
      0
    );
  }

  /**
   * ==========================================
   * ID GENERATOR
   * ==========================================
   */
  generateId() {

    return (
      "bill_" +
      Date.now() +
      "_" +
      crypto.randomBytes(4).toString("hex")
    );
  }
}

module.exports =
  new VideoBillingEngine();
