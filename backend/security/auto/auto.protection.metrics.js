 /**
 * ==================================================
 * AUTO PROTECTION METRICS V2
 * UniMentorAI Security Observability Layer
 * ==================================================
 *
 * 🎯 ROLE:
 * - Monitor autonomous security actions
 * - Measure false positives / effectiveness
 * - Provide tuning signals for AI system
 */

class AutoProtectionMetrics {
  constructor() {
    this.metrics = {
      totalEvents: 0,

      // Actions
      blocked: 0,
      restricted: 0,
      monitored: 0,
      quarantined: 0,

      // Safety
      blockedByGuard: 0,
      skippedActions: 0,

      // Quality signals
      falsePositives: 0,
      truePositives: 0,

      // Risk distribution
      riskLevels: {
        LOW: 0,
        MEDIUM: 0,
        HIGH: 0,
        CRITICAL: 0,
      },

      // Performance
      avgScore: 0,
    };
  }

  /**
   * 🚀 MAIN TRACKING FUNCTION
   */
  track(event = {}, decision = {}, result = {}) {
    this.metrics.totalEvents++;

    const score = event.score || 0;
    const action = decision.action || "UNKNOWN";

    /**
     * ==========================
     * ACTION TRACKING
     * ==========================
     */
    switch (action) {
      case "BLOCK":
        this.metrics.blocked++;
        break;
      case "RESTRICT":
        this.metrics.restricted++;
        break;
      case "MONITOR":
        this.metrics.monitored++;
        break;
    }

    /**
     * ==========================
     * QUARANTINE TRACKING
     * ==========================
     */
    if (result?.quarantined) {
      this.metrics.quarantined++;
    }

    /**
     * ==========================
     * SAFETY GATE TRACKING
     * ==========================
     */
    if (result?.blockedByGuard) {
      this.metrics.blockedByGuard++;
    }

    /**
     * ==========================
     * RISK DISTRIBUTION
     * ==========================
     */
    const level = event.level || "LOW";
    this.metrics.riskLevels[level]++;

    /**
     * ==========================
     * AVERAGE SCORE UPDATE
     * ==========================
     */
    this._updateAvgScore(score);
  }

  /**
   * ==========================
   * FALSE POSITIVE TRACKING
   * ==========================
   */
  markFalsePositive() {
    this.metrics.falsePositives++;
  }

  /**
   * ==========================
   * TRUE POSITIVE TRACKING
   * ==========================
   */
  markTruePositive() {
    this.metrics.truePositives++;
  }

  /**
   * ==========================
   * DASHBOARD SNAPSHOT
   * ==========================
   */
  getSnapshot() {
    return {
      ...this.metrics,

      /**
       * KEY KPIs
       */
      falsePositiveRate: this._falsePositiveRate(),
      protectionEfficiency: this._efficiencyRate(),
      systemAggressiveness: this._aggressivenessScore(),
    };
  }

  /**
   * ==========================
   * AVERAGE SCORE
   * ==========================
   */
  _updateAvgScore(score) {
    const total = this.metrics.totalEvents;

    this.metrics.avgScore =
      (this.metrics.avgScore * (total - 1) + score) / total;
  }

  /**
   * ==========================
   * FALSE POSITIVE RATE
   * ==========================
   */
  _falsePositiveRate() {
    const total = this.metrics.truePositives + this.metrics.falsePositives;

    if (total === 0) return 0;

    return this.metrics.falsePositives / total;
  }

  /**
   * ==========================
   * PROTECTION EFFICIENCY
   * ==========================
   */
  _efficiencyRate() {
    if (this.metrics.totalEvents === 0) return 0;

    return (
      (this.metrics.blocked + this.metrics.quarantined) /
      this.metrics.totalEvents
    );
  }

  /**
   * ==========================
   * SYSTEM AGGRESSIVENESS SCORE
   * ==========================
   */
  _aggressivenessScore() {
    if (this.metrics.totalEvents === 0) return 0;

    return (
      (this.metrics.blocked + this.metrics.restricted) /
      this.metrics.totalEvents
    );
  }

  /**
   * ==========================
   * RESET SYSTEM
   * ==========================
   */
  reset() {
    this.metrics = {
      totalEvents: 0,
      blocked: 0,
      restricted: 0,
      monitored: 0,
      quarantined: 0,
      blockedByGuard: 0,
      skippedActions: 0,
      falsePositives: 0,
      truePositives: 0,
      riskLevels: {
        LOW: 0,
        MEDIUM: 0,
        HIGH: 0,
        CRITICAL: 0,
      },
      avgScore: 0,
    };
  }
}

/**
 * ==========================
 * SINGLETON EXPORT
 * ==========================
 */
export const autoProtectionMetrics = new AutoProtectionMetrics();
