
/**
 * ==========================================
 * 📒 VIDEO BILLING EVENTS LEDGER
 * UniMentorAI Financial Core System
 * ==========================================
 * Immutable event log for all billing operations:
 * - payments
 * - pricing changes
 * - refunds
 * - invoices
 * - system adjustments
 */

class VideoBillingEvents {

  constructor() {
    this.events = [];
  }

  /**
   * ==========================================
   * ADD EVENT (IMMUTABLE LOG ENTRY)
   * ==========================================
   */
  emit(event) {

    const record = {
      id: this.generateId(),

      type: event.type || "UNKNOWN",

      userId: event.userId || null,
      sessionId: event.sessionId || null,
      billingId: event.billingId || null,

      amount: event.amount || 0,
      currency: event.currency || "USD",

      status: event.status || "info",

      timestamp: Date.now(),

      metadata: event.metadata || {},

      hash: this.hashEvent(event)
    };

    this.events.push(record);

    return record;
  }

  /**
   * ==========================================
   * PAYMENT EVENTS
   * ==========================================
   */
  paymentEvent(data) {

    return this.emit({
      type: "PAYMENT",
      ...data
    });
  }

  /**
   * ==========================================
   * REFUND EVENTS
   * ==========================================
   */
  refundEvent(data) {

    return this.emit({
      type: "REFUND",
      ...data
    });
  }

  /**
   * ==========================================
   * INVOICE EVENTS
   * ==========================================
   */
  invoiceEvent(data) {

    return this.emit({
      type: "INVOICE",
      ...data
    });
  }

  /**
   * ==========================================
   * PRICING CHANGE EVENTS
   * ==========================================
   */
  pricingEvent(data) {

    return this.emit({
      type: "PRICING_CHANGE",
      ...data
    });
  }

  /**
   * ==========================================
   * SYSTEM BILLING EVENTS
   * ==========================================
   */
  systemEvent(data) {

    return this.emit({
      type: "SYSTEM_BILLING_EVENT",
      ...data
    });
  }

  /**
   * ==========================================
   * GET ALL EVENTS FOR USER
   * ==========================================
   */
  getUserEvents(userId) {

    return this.events.filter(
      e => e.userId === userId
    );
  }

  /**
   * ==========================================
   * GET SESSION BILLING HISTORY
   * ==========================================
   */
  getSessionEvents(sessionId) {

    return this.events.filter(
      e => e.sessionId === sessionId
    );
  }

  /**
   * ==========================================
   * LEDGER TOTAL REVENUE CALCULATION
   * ==========================================
   */
  calculateTotalRevenue() {

    return this.events
      .filter(e => e.type === "PAYMENT")
      .reduce((sum, e) => sum + (e.amount || 0), 0);
  }

  /**
   * ==========================================
   * DETECT FINANCIAL ANOMALIES
   * ==========================================
   */
  detectAnomalies() {

    const anomalies = [];

    const negative = this.events.filter(
      e => e.amount < 0
    );

    const duplicates = this.findDuplicatePayments();

    if (negative.length > 0) {
      anomalies.push("NEGATIVE_TRANSACTION_DETECTED");
    }

    if (duplicates.length > 0) {
      anomalies.push("POTENTIAL_DUPLICATE_PAYMENTS");
    }

    return anomalies;
  }

  /**
   * ==========================================
   * DUPLICATE PAYMENT DETECTION
   * ==========================================
   */
  findDuplicatePayments() {

    const map = new Map();
    const duplicates = [];

    for (const e of this.events) {

      const key =
        `${e.userId}-${e.sessionId}-${e.amount}`;

      if (map.has(key)) {
        duplicates.push(e);
      } else {
        map.set(key, true);
      }
    }

    return duplicates;
  }

  /**
   * ==========================================
   * EVENT HASHING (INTEGRITY CHECK)
   * ==========================================
   */
  hashEvent(event) {

    const str =
      `${event.type}-${event.userId}-${event.sessionId}-${event.amount}`;

    let hash = 0;

    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
    }

    return hash.toString();
  }

  /**
   * ==========================================
   * EXPORT FULL LEDGER SNAPSHOT
   * ==========================================
   */
  exportLedger() {

    return {
      totalEvents: this.events.length,
      totalRevenue: this.calculateTotalRevenue(),
      anomalies: this.detectAnomalies(),
      events: this.events.slice(-100)
    };
  }

  /**
   * ==========================================
   * CLEAR OLD EVENTS (ARCHIVING STRATEGY)
   * ==========================================
   */
  archive(keepLast = 1000) {

    this.events =
      this.events.slice(-keepLast);
  }

  /**
   * ==========================================
   * ID GENERATOR
   * ==========================================
   */
  generateId() {

    return (
      "evt_" +
      Date.now() +
      "_" +
      Math.random().toString(36).slice(2, 10)
    );
  }
}

module.exports =
  new VideoBillingEvents();
