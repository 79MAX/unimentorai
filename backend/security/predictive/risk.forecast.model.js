import { featureEngine } from "./feature.engine.js";
import { selfHealFeedback } from "../self-heal/self.heal.feedback.js";

/**
 * ==================================================
 * RISK FORECAST MODEL V2
 * Temporal Behavioral Risk Intelligence Core
 * ==================================================
 *
 * 🎯 ROLE:
 * - Forecast probability of malicious behavior
 * - Use behavioral features + temporal drift
 * - Adapt based on feedback loop
 */

class RiskForecastModel {
  constructor() {
    /**
     * Initial learned weights (adaptive over time)
     */
    this.weights = {
      loginFrequency: 0.22,
      geoDistance: 0.18,
      requestBurst: 0.28,
      behaviorAnomaly: 0.22,
      sessionVelocity: 0.05,
      timeIrregularity: 0.03,
      actionEntropy: 0.02,
    };

    this.driftFactor = 0.05;
  }

  /**
   * 🚀 MAIN FORECAST FUNCTION
   */
  forecast(event = {}) {
    const features = featureEngine.extract(event);

    const score = this._computeRiskScore(features);
    const probability = this._convertToProbability(score);
    const classification = this._classify(probability);

    return {
      userId: event.userId,
      riskScore: score,
      riskProbability: probability,
      classification,
      confidence: this._confidence(features),
      timestamp: new Date(),
    };
  }

  /**
   * ==========================
   * RISK SCORE ENGINE
   * ==========================
   */
  _computeRiskScore(f) {
    let score = 0;

    for (const key in this.weights) {
      if (f[key] !== undefined) {
        score += f[key] * this.weights[key];
      }
    }

    return Math.max(0, Math.min(1, score));
  }

  /**
   * ==========================
   * PROBABILITY MAPPING
   * ==========================
   */
  _convertToProbability(score) {
    /**
     * Smooth sigmoid-like transformation
     */
    return 1 / (1 + Math.exp(-10 * (score - 0.5)));
  }

  /**
   * ==========================
   * CLASSIFICATION LAYER
   * ==========================
   */
  _classify(p) {
    if (p >= 0.85) return "IMMINENT_THREAT";
    if (p >= 0.7) return "HIGH_RISK";
    if (p >= 0.45) return "SUSPICIOUS";
    return "NORMAL";
  }

  /**
   * ==========================
   * CONFIDENCE ENGINE
   * ==========================
   */
  _confidence(features) {
    const values = Object.values(features);

    const avg = values.reduce((a, b) => a + b, 0) / values.length;

    const variance =
      values.reduce((a, b) => a + Math.abs(b - avg), 0) /
      values.length;

    return Math.max(0, 1 - variance);
  }

  /**
   * ==========================
   * ADAPTIVE LEARNING LOOP
   * ==========================
   */
  adapt() {
    const feedback = selfHealFeedback.analyze();

    /**
     * LOW PRECISION → reduce noisy signals
     */
    if (feedback.precision < 0.6) {
      this._reduceNoisyWeights();
    }

    /**
     * LOW RECALL → increase sensitivity
     */
    if (feedback.recall < 0.6) {
      this._increaseSensitiveWeights();
    }

    return this.weights;
  }

  /**
   * ==========================
   * NOISE REDUCTION (FALSE POSITIVES)
   * ==========================
   */
  _reduceNoisyWeights() {
    this.weights.requestBurst *= 0.92;
    this.weights.behaviorAnomaly *= 0.95;
  }

  /**
   * ==========================
   * SENSITIVITY BOOST (FALSE NEGATIVES)
   * ==========================
   */
  _increaseSensitiveWeights() {
    this.weights.geoDistance *= 1.08;
    this.weights.loginFrequency *= 1.05;
  }

  /**
   * ==========================
   * MODEL STATUS
   * ==========================
   */
  getModel() {
    return {
      weights: this.weights,
      driftFactor: this.driftFactor,
    };
  }
}

/**
 * Singleton instance
 */
export const riskForecastModel = new RiskForecastModel();
