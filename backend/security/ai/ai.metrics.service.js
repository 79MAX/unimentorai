 /**
 * ==================================================
 * AI METRICS SERVICE V2
 * UniMentorAI Fraud Intelligence Observability
 * ==================================================
 *
 * 🎯 PURPOSE:
 * - Track AI performance
 * - Monitor fraud detection efficiency
 * - Provide insights for tuning
 */

class AIMetricsService {
  constructor() {
    this.metrics = {
      totalEvents: 0,
      fraudDetected: 0,
      blockedUsers: 0,
      restrictedUsers: 0,
      falsePositives: 0,
      averageRiskScore: 0,
      riskDistribution: {
        LOW: 0,
        MEDIUM: 0,
        HIGH: 0,
        CRITICAL: 0,
      },
    };
  }

  /**
   * 🚀 MAIN TRACKING ENTRY
   */
  track(event = {}, aiResult = {}) {
    this.metrics.totalEvents++;

    const score = aiResult.score || 0;
    const level = aiResult.level || "LOW";
    const decision = aiResult.decision?.action || "ALLOW";

    /**
     * ==========================
     * SCORE AGGREGATION
     * ==========================
     */
    this._updateAverageScore(score);

    /**
     * ==========================
     * RISK DISTRIBUTION
     * ==========================
     */
    this.metrics.riskDistribution[level]++;

    /**
     * ==========================
     * FRAUD TRACKING
     * ==========================
     */
    if (level === "HIGH" || level === "CRITICAL") {
      this.metrics.fraudDetected++;
    }

    /**
     * ==========================
     * ACTION TRACKING
     * ==========================
     */
    if (decision === "BLOCK") {
      this.metrics.blockedUsers++;
    }

    if (decision === "RESTRICT") {
      this.metrics.restrictedUsers++;
    }

    /**
     * ==========================
     * DEBUG LOG (OPTIONAL)
     * ==========================
     */
    this._log(event, aiResult);
  }

  /**
   * ==========================
   * AVERAGE SCORE CALCULATION
   * ==========================
   */
  _updateAverageScore(score) {
    const total = this.metrics.totalEvents;
    this.metrics.averageRiskScore =
      (this.metrics.averageRiskScore * (total - 1) + score) / total;
  }

  /**
   * ==========================
   * REAL-TIME SNAPSHOT
   * ==========================
   */
  getSnapshot() {
    return {
      ...this.metrics,
      fraudRate:
        this.metrics.totalEvents === 0
          ? 0
          : this.metrics.fraudDetected / this.metrics.totalEvents,
    };
  }

  /**
   * ==========================
   * RESET METRICS (FOR TESTING)
   * ==========================
   */
  reset() {
    this.metrics = {
      totalEvents: 0,
      fraudDetected: 0,
      blockedUsers: 0,
      restrictedUsers: 0,
      falsePositives: 0,
      averageRiskScore: 0,
      riskDistribution: {
        LOW: 0,
        MEDIUM: 0,
        HIGH: 0,
        CRITICAL: 0,
      },
    };
  }

  /**
   * ==========================
   * INTERNAL LOGGING
   * ==========================
   */
  _log(event, aiResult) {
    console.log("[AI_METRIC]", {
      type: event.type,
      score: aiResult.score,
      level: aiResult.level,
      decision: aiResult.decision?.action,
    });
  }
}

/**
 * ==========================
 * SINGLETON EXPORT
 * ==========================
 */
export const aiMetricsService = new AIMetricsService();
