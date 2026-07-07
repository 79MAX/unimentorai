import { selfHealFeedback } from "../self-heal/self.heal.feedback.js";

/**
 * ==================================================
 * PREDICTIVE METRICS V2
 * Security Intelligence Observability Layer
 * ==================================================
 *
 * 🎯 ROLE:
 * - Measure predictive system efficiency
 * - Track model drift & accuracy
 * - Feed self-healing + policy evolution
 */

class PredictiveMetrics {
  constructor() {
    this.metrics = {
      totalPredictions: 0,

      imminentThreat: 0,
      highRisk: 0,
      suspicious: 0,
      normal: 0,

      truePositives: 0,
      falsePositives: 0,
      falseNegatives: 0,

      quarantinesTriggered: 0,
      quarantinesAvoided: 0,

      modelDriftScore: 0,
    };

    this.history = [];
  }

  /**
   * 🚀 RECORD PREDICTION EVENT
   */
  record(prediction = {}, outcome = {}) {
    this.metrics.totalPredictions++;

    /**
     * ==========================
     * CLASSIFICATION TRACKING
     * ==========================
     */
    const label = prediction.classification;

    if (label === "IMMINENT_THREAT") this.metrics.imminentThreat++;
    if (label === "HIGH_RISK") this.metrics.highRisk++;
    if (label === "SUSPICIOUS") this.metrics.suspicious++;
    if (label === "NORMAL") this.metrics.normal++;

    /**
     * ==========================
     * OUTCOME ANALYSIS (FEEDBACK LOOP)
     * ==========================
     */
    if (outcome.type === "TRUE_POSITIVE") {
      this.metrics.truePositives++;
    }

    if (outcome.type === "FALSE_POSITIVE") {
      this.metrics.falsePositives++;
    }

    if (outcome.type === "FALSE_NEGATIVE") {
      this.metrics.falseNegatives++;
    }

    /**
     * ==========================
     * DRIFT CALCULATION
     * ==========================
     */
    this._updateDrift();

    /**
     * ==========================
     * HISTORY TRACKING
     * ==========================
     */
    this.history.push({
      prediction,
      outcome,
      timestamp: new Date(),
    });

    if (this.history.length > 500) {
      this.history.shift();
    }

    return this.getSnapshot();
  }

  /**
   * ==========================
   * MODEL DRIFT ENGINE
   * ==========================
   */
  _updateDrift() {
    const total =
      this.metrics.truePositives +
      this.metrics.falsePositives +
      this.metrics.falseNegatives;

    if (total === 0) return;

    const errorRate =
      (this.metrics.falsePositives + this.metrics.falseNegatives) /
      total;

    /**
     * Drift increases when error increases
     */
    this.metrics.modelDriftScore = Math.min(1, errorRate);
  }

  /**
   * ==========================
   * PRECISION
   * ==========================
   */
  getPrecision() {
    const tp = this.metrics.truePositives;
    const fp = this.metrics.falsePositives;

    if (tp + fp === 0) return 0;

    return tp / (tp + fp);
  }

  /**
   * ==========================
   * RECALL
   * ==========================
   */
  getRecall() {
    const tp = this.metrics.truePositives;
    const fn = this.metrics.falseNegatives;

    if (tp + fn === 0) return 0;

    return tp / (tp + fn);
  }

  /**
   * ==========================
   * SYSTEM EFFICIENCY SCORE
   * ==========================
   */
  getEfficiencyScore() {
    const precision = this.getPrecision();
    const recall = this.getRecall();

    return (precision + recall) / 2;
  }

  /**
   * ==========================
   * SNAPSHOT (FULL OBSERVABILITY)
   * ==========================
   */
  getSnapshot() {
    return {
      ...this.metrics,

      precision: this.getPrecision(),
      recall: this.getRecall(),
      efficiency: this.getEfficiencyScore(),

      systemHealth: this._getSystemHealth(),
    };
  }

  /**
   * ==========================
   * SYSTEM HEALTH CLASSIFICATION
   * ==========================
   */
  _getSystemHealth() {
    const efficiency = this.getEfficiencyScore();

    if (efficiency >= 0.85) return "EXCELLENT";
    if (efficiency >= 0.7) return "GOOD";
    if (efficiency >= 0.5) return "DEGRADED";
    return "CRITICAL";
  }

  /**
   * ==========================
   * RESET SYSTEM
   * ==========================
   */
  reset() {
    this.metrics = {
      totalPredictions: 0,
      imminentThreat: 0,
      highRisk: 0,
      suspicious: 0,
      normal: 0,
      truePositives: 0,
      falsePositives: 0,
      falseNegatives: 0,
      quarantinesTriggered: 0,
      quarantinesAvoided: 0,
      modelDriftScore: 0,
    };

    this.history = [];
  }
}

/**
 * Singleton instance
 */
export const predictiveMetrics = new PredictiveMetrics();
