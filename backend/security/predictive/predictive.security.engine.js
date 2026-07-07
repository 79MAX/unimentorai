import { autoProtectionMetrics } from "../auto/auto.protection.metrics.js";
import { selfHealFeedback } from "../self-heal/self.heal.feedback.js";

/**
 * ==================================================
 * PREDICTIVE SECURITY ENGINE V2
 * Adaptive Threat Forecasting Core
 * ==================================================
 *
 * 🎯 ROLE:
 * - Predict malicious intent BEFORE execution
 * - Adapt weights based on system feedback
 * - Provide confidence-scored risk analysis
 */

class PredictiveSecurityEngine {
  constructor() {
    /**
     * Base weights (will evolve over time)
     */
    this.model = {
      weights: {
        loginFrequency: 0.25,
        geoDistance: 0.2,
        requestBurst: 0.3,
        behaviorAnomaly: 0.25,
      },
    };

    /**
     * Confidence tracking (NEW)
     */
    this.confidence = {
      totalPredictions: 0,
      averageConfidence: 0,
    };
  }

  /**
   * 🚀 MAIN PREDICTION PIPELINE
   */
  predict(context = {}) {
    const features = this._extractFeatures(context);
    const riskScore = this._calculateRisk(features);
    const prediction = this._interpretRisk(riskScore);

    const confidence = this._calculateConfidence(features, riskScore);

    this._trackConfidence(confidence);

    return {
      userId: context.userId,
      riskScore,
      prediction,
      confidence,
      features,
      timestamp: new Date(),
    };
  }

  /**
   * ==========================
   * FEATURE ENGINE (ENHANCED)
   * ==========================
   */
  _extractFeatures(ctx) {
    return {
      loginFrequency: this._normalize(ctx.loginFrequency),
      geoDistance: this._normalize(ctx.geoDistance),
      requestBurst: this._normalize(ctx.requestBurst),
      behaviorAnomaly: this._normalize(ctx.behaviorAnomaly),
    };
  }

  /**
   * ==========================
   * NORMALIZATION LAYER (IMPORTANT)
   * prevents score explosion
   * ==========================
   */
  _normalize(value) {
    if (typeof value !== "number") return 0;
    return Math.max(0, Math.min(1, value));
  }

  /**
   * ==========================
   * RISK SCORE ENGINE
   * ==========================
   */
  _calculateRisk(f) {
    return (
      f.loginFrequency * this.model.weights.loginFrequency +
      f.geoDistance * this.model.weights.geoDistance +
      f.requestBurst * this.model.weights.requestBurst +
      f.behaviorAnomaly * this.model.weights.behaviorAnomaly
    );
  }

  /**
   * ==========================
   * RISK INTERPRETATION LAYER
   * ==========================
   */
  _interpretRisk(score) {
    if (score >= 0.8) return "IMMINENT_THREAT";
    if (score >= 0.65) return "HIGH_RISK";
    if (score >= 0.4) return "SUSPICIOUS";
    return "NORMAL";
  }

  /**
   * ==========================
   * CONFIDENCE ENGINE (NEW)
   * ==========================
   */
  _calculateConfidence(features, score) {
    const variance =
      Object.values(features).reduce((a, b) => a + Math.abs(b - score), 0) /
      Object.keys(features).length;

    /**
     * Lower variance = higher confidence
     */
    return Math.max(0, Math.min(1, 1 - variance));
  }

  /**
   * ==========================
   * TRACK MODEL CONFIDENCE
   * ==========================
   */
  _trackConfidence(confidence) {
    const total = this.confidence.totalPredictions;

    this.confidence.averageConfidence =
      (this.confidence.averageConfidence * total + confidence) /
      (total + 1);

    this.confidence.totalPredictions++;
  }

  /**
   * ==========================
   * FEEDBACK-BASED ADAPTATION HOOK (CRITICAL)
   * ==========================
   */
  adaptFromFeedback() {
    const analysis = selfHealFeedback.analyze();

    /**
     * If precision is low → reduce aggressive weights
     */
    if (analysis.precision < 0.6) {
      this._reduceAggressiveness();
    }

    /**
     * If recall is low → increase sensitivity
     */
    if (analysis.recall < 0.6) {
      this._increaseSensitivity();
    }

    return this.model;
  }

  /**
   * ==========================
   * REDUCE FALSE POSITIVE AGGRESSION
   * ==========================
   */
  _reduceAggressiveness() {
    this.model.weights.requestBurst *= 0.9;
    this.model.weights.behaviorAnomaly *= 0.95;
  }

  /**
   * ==========================
   * INCREASE DETECTION SENSITIVITY
   * ==========================
   */
  _increaseSensitivity() {
    this.model.weights.geoDistance *= 1.05;
    this.model.weights.loginFrequency *= 1.05;
  }

  /**
   * ==========================
   * METRICS SNAPSHOT
   * ==========================
   */
  getModelStatus() {
    return {
      weights: this.model.weights,
      confidence: this.confidence,
    };
  }
}

/**
 * Singleton instance
 */
export const predictiveSecurityEngine = new PredictiveSecurityEngine();
