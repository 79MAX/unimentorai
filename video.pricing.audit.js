
/**
 * ==========================================
 * 🧾 VIDEO PRICING AUDIT ENGINE
 * UniMentorAI Financial Integrity Layer
 * ==========================================
 * Audits pricing decisions for:
 * - consistency
 * - fraud detection
 * - pricing anomalies
 * - AI decision traceability
 */

class VideoPricingAudit {

  constructor({ events, tracker, collector }) {
    this.events = events;
    this.tracker = tracker;
    this.collector = collector;
  }

  /**
   * ==========================================
   * RUN FULL PRICING AUDIT
   * ==========================================
   */
  runFullAudit() {

    return {
      timestamp: Date.now(),

      anomalies: this.detectPricingAnomalies(),
      inconsistencies: this.detectInconsistencies(),
      revenueLeaks: this.detectRevenueLeaks(),

      summary: this.generateAuditSummary()
    };
  }

  /**
   * ==========================================
   * DETECT PRICING ANOMALIES
   * ==========================================
   */
  detectPricingAnomalies() {

    const anomalies = [];

    const events =
      this.events.events || [];

    // --------------------------------------
    // 1. Negative pricing anomaly
    // --------------------------------------
    const negative = events.filter(
      e => e.amount < 0
    );

    if (negative.length > 0) {
      anomalies.push("NEGATIVE_PRICING_DETECTED");
    }

    // --------------------------------------
    // 2. Extreme price spikes
    // --------------------------------------
    const extreme = events.filter(
      e => e.amount > 1000
    );

    if (extreme.length > 5) {
      anomalies.push("UNUSUAL_PRICE_SPIKES");
    }

    // --------------------------------------
    // 3. Zero revenue sessions
    // --------------------------------------
    const zeroRevenue =
      this.tracker.events.filter(
        e =>
          e.type === "SESSION_REVENUE" &&
          e.amount === 0
      );

    if (zeroRevenue.length > 20) {
      anomalies.push("HIGH_ZERO_REVENUE_SESSIONS");
    }

    return anomalies;
  }

  /**
   * ==========================================
   * DETECT PRICING INCONSISTENCIES
   * ==========================================
   */
  detectInconsistencies() {

    const inconsistencies = [];

    const events =
      this.events.events || [];

    const pricingMap = new Map();

    for (const e of events) {

      const key = `${e.sessionId}-${e.userId}`;

      if (pricingMap.has(key)) {

        const previous = pricingMap.get(key);

        if (Math.abs(previous - e.amount) > 50) {
          inconsistencies.push({
            type: "PRICE_VARIATION_IN_SESSION",
            sessionId: e.sessionId
          });
        }

      } else {
        pricingMap.set(key, e.amount);
      }
    }

    return inconsistencies;
  }

  /**
   * ==========================================
   * DETECT REVENUE LEAKS
   * ==========================================
   */
  detectRevenueLeaks() {

    const leaks = [];

    const totalRevenue =
      this.collector.getTotalRevenue();

    const trackedRevenue =
      this.tracker.events
        .filter(e => e.type === "SESSION_REVENUE")
        .reduce((sum, e) => sum + e.amount, 0);

    if (trackedRevenue < totalRevenue * 0.8) {
      leaks.push("POTENTIAL_REVENUE_TRACKING_GAP");
    }

    return leaks;
  }

  /**
   * ==========================================
   * AUDIT SUMMARY GENERATION
   * ==========================================
   */
  generateAuditSummary() {

    const anomalies =
      this.detectPricingAnomalies();

    const inconsistencies =
      this.detectInconsistencies();

    const leaks =
      this.detectRevenueLeaks();

    const riskScore =
      this.calculateRiskScore(
        anomalies,
        inconsistencies,
        leaks
      );

    return {
      anomalyCount: anomalies.length,
      inconsistencyCount: inconsistencies.length,
      leakCount: leaks.length,
      riskScore,
      status: this.getAuditStatus(riskScore)
    };
  }

  /**
   * ==========================================
   * RISK SCORE CALCULATION (0-100)
   * ==========================================
   */
  calculateRiskScore(anomalies, inconsistencies, leaks) {

    let score = 0;

    score += anomalies.length * 10;
    score += inconsistencies.length * 15;
    score += leaks.length * 20;

    return Math.min(score, 100);
  }

  /**
   * ==========================================
   * AUDIT STATUS CLASSIFICATION
   * ==========================================
   */
  getAuditStatus(score) {

    if (score < 20) return "HEALTHY";
    if (score < 50) return "WARNING";

    return "CRITICAL";
  }

  /**
   * ==========================================
   * EXPORT AUDIT REPORT
   * ==========================================
   */
  exportAuditReport() {

    const audit =
      this.runFullAudit();

    return {
      reportId: "audit_" + Date.now(),
      ...audit
    };
  }
}

module.exports =
  VideoPricingAudit;
