import { autoProtectionMetrics } from "../auto/auto.protection.metrics.js";

/**
 * ==================================================
 * SELF HEAL FEEDBACK V2
 * UniMentorAI Learning Signal Layer
 * ==================================================
 *
 * 🎯 ROLE:
 * - Collect real-world decision outcomes
 * - Feed self-healing engine
 * - Improve AI decision quality over time
 */

class SelfHealFeedback {
  constructor() {
    this.buffer = [];
    this.maxBufferSize = 500;
  }

  /**
   * 🚀 MAIN FEEDBACK ENTRY
   */
  record(event = {}, outcome = {}) {
    const feedback = {
      userId: event.userId,
      score: event.score,
      decision: event.decision?.action,
      timestamp: new Date(),

      /**
       * OUTCOME TYPES:
       * - TRUE_POSITIVE (correct block)
       * - FALSE_POSITIVE (wrong block)
       * - TRUE_NEGATIVE (correct allow)
       * - FALSE_NEGATIVE (missed fraud)
       */
      outcome: outcome.type,
      manualReview: outcome.manualReview || false,
    };

    this.buffer.push(feedback);

    /**
     * ==========================
     * BUFFER CONTROL
     * ==========================
     */
    if (this.buffer.length > this.maxBufferSize) {
      this.buffer.shift();
    }

    /**
     * ==========================
     * METRICS UPDATE
     * ==========================
     */
    this._updateMetrics(feedback);

    return feedback;
  }

  /**
   * ==========================
   * METRICS FEEDING ENGINE
   * ==========================
   */
  _updateMetrics(feedback) {
    switch (feedback.outcome) {
      case "FALSE_POSITIVE":
        autoProtectionMetrics.markFalsePositive();
        break;

      case "TRUE_POSITIVE":
        autoProtectionMetrics.markTruePositive();
        break;

      case "FALSE_NEGATIVE":
        // IMPORTANT: indicates system weakness
        autoProtectionMetrics.markFalsePositive();
        console.warn("[SELF_HEAL_FEEDBACK] Missed fraud detected");
        break;

      case "TRUE_NEGATIVE":
        // correct allow → no action needed
        break;
    }
  }

  /**
   * 📊 ANALYZE SYSTEM QUALITY
   */
  analyze() {
    const stats = {
      total: this.buffer.length,
      falsePositives: 0,
      truePositives: 0,
      falseNegatives: 0,
      trueNegatives: 0,
    };

    for (const f of this.buffer) {
      if (f.outcome === "FALSE_POSITIVE") stats.falsePositives++;
      if (f.outcome === "TRUE_POSITIVE") stats.truePositives++;
      if (f.outcome === "FALSE_NEGATIVE") stats.falseNegatives++;
      if (f.outcome === "TRUE_NEGATIVE") stats.trueNegatives++;
    }

    return {
      ...stats,
      precision: this._precision(stats),
      recall: this._recall(stats),
    };
  }

  /**
   * ==========================
   * PRECISION CALCULATION
   * ==========================
   */
  _precision(stats) {
    const tp = stats.truePositives;
    const fp = stats.falsePositives;

    return tp + fp === 0 ? 0 : tp / (tp + fp);
  }

  /**
   * ==========================
   * RECALL CALCULATION
   * ==========================
   */
  _recall(stats) {
    const tp = stats.truePositives;
    const fn = stats.falseNegatives;

    return tp + fn === 0 ? 0 : tp / (tp + fn);
  }

  /**
   * 🔄 CLEAR BUFFER
   */
  reset() {
    this.buffer = [];
  }
}

/**
 * Singleton instance
 */
export const selfHealFeedback = new SelfHealFeedback();
