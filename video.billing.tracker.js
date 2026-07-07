
/**
 * ==========================================
 * 📊 VIDEO BILLING TRACKER
 * UniMentorAI Revenue Intelligence Layer
 * ==========================================
 * Tracks full financial lifecycle of video usage:
 * - session revenue
 * - payment flow
 * - conversion tracking
 * - revenue analytics
 */

class VideoBillingTracker {

  constructor() {
    this.events = [];
  }

  /**
   * ==========================================
   * TRACK BILLING EVENT
   * ==========================================
   */
  track(event) {

    const record = {
      id: this.generateId(),

      type: event.type || "UNKNOWN",

      userId: event.userId,
      sessionId: event.sessionId,
      billingId: event.billingId,

      amount: event.amount || 0,
      currency: event.currency || "USD",

      status: event.status || "info",

      timestamp: Date.now(),

      metadata: event.metadata || {}
    };

    this.events.push(record);

    return record;
  }

  /**
   * ==========================================
   * SESSION REVENUE TRACKING
   * ==========================================
   */
  trackSessionRevenue({ sessionId, userId, amount }) {

    return this.track({
      type: "SESSION_REVENUE",
      sessionId,
      userId,
      amount,
      status: "recorded"
    });
  }

  /**
   * ==========================================
   * PAYMENT FLOW TRACKING
   * ==========================================
   */
  trackPaymentFlow({ billingId, userId, step, status }) {

    return this.track({
      type: "PAYMENT_FLOW",
      billingId,
      userId,
      metadata: {
        step
      },
      status
    });
  }

  /**
   * ==========================================
   * CONVERSION TRACKING (CRITICAL FOR SAAS)
   * ==========================================
   */
  trackConversion({ userId, from, to, value }) {

    return this.track({
      type: "CONVERSION",
      userId,
      metadata: {
        from,
        to,
        value
      },
      status: "success"
    });
  }

  /**
   * ==========================================
   * REVENUE ANALYTICS ENGINE
   * ==========================================
   */
  getRevenueAnalytics() {

    const paid = this.events.filter(
      e => e.type === "SESSION_REVENUE"
    );

    const totalRevenue = paid.reduce(
      (sum, e) => sum + (e.amount || 0),
      0
    );

    const conversions = this.events.filter(
      e => e.type === "CONVERSION"
    );

    return {
      totalRevenue,
      totalSessions: paid.length,
      totalConversions: conversions.length,
      averageRevenuePerSession:
        paid.length ? totalRevenue / paid.length : 0
    };
  }

  /**
   * ==========================================
   * USER REVENUE PROFILE
   * ==========================================
   */
  getUserRevenueProfile(userId) {

    const userEvents =
      this.events.filter(e => e.userId === userId);

    const revenue = userEvents
      .filter(e => e.type === "SESSION_REVENUE")
      .reduce((sum, e) => sum + e.amount, 0);

    return {
      userId,
      totalRevenue: revenue,
      sessions: userEvents.length
    };
  }

  /**
   * ==========================================
   * SESSION PROFITABILITY
   * ==========================================
   */
  getSessionPerformance(sessionId) {

    const sessionEvents =
      this.events.filter(e => e.sessionId === sessionId);

    const revenue = sessionEvents
      .filter(e => e.type === "SESSION_REVENUE")
      .reduce((sum, e) => sum + e.amount, 0);

    return {
      sessionId,
      revenue,
      eventCount: sessionEvents.length
    };
  }

  /**
   * ==========================================
   * DETECT REVENUE ANOMALIES
   * ==========================================
   */
  detectAnomalies() {

    const anomalies = [];

    const zeroRevenueSessions =
      this.events.filter(
        e =>
          e.type === "SESSION_REVENUE" &&
          e.amount === 0
      );

    if (zeroRevenueSessions.length > 10) {
      anomalies.push("HIGH_ZERO_REVENUE_SESSIONS");
    }

    return anomalies;
  }

  /**
   * ==========================================
   * TIME-BASED REVENUE ANALYSIS
   * ==========================================
   */
  revenueByTimeWindow(start, end) {

    return this.events
      .filter(e =>
        e.type === "SESSION_REVENUE" &&
        e.timestamp >= start &&
        e.timestamp <= end
      )
      .reduce((sum, e) => sum + e.amount, 0);
  }

  /**
   * ==========================================
   * EXPORT FINANCIAL SNAPSHOT
   * ==========================================
   */
  exportSnapshot() {

    return {
      totalEvents: this.events.length,
      analytics: this.getRevenueAnalytics(),
      anomalies: this.detectAnomalies()
    };
  }

  /**
   * ==========================================
   * ID GENERATOR
   * ==========================================
   */
  generateId() {

    return (
      "track_" +
      Date.now() +
      "_" +
      Math.random().toString(36).slice(2, 10)
    );
  }
}

module.exports =
  new VideoBillingTracker();
