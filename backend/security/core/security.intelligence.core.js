import { featureEngine } from "FIX_REQUIRED_PATH";
import { riskForecastModel } from "FIX_REQUIRED_PATH";

/**
 * ==================================================
 * SECURITY INTELLIGENCE CORE V2
 * Unified Behavioral Risk Engine
 * ==================================================
 *
 * 🎯 ROLE:
 * - Extract behavioral intelligence
 * - Compute risk prediction
 * - Detect anomalies (early signal layer)
 * - Provide ML-ready structured output
 */

class SecurityIntelligenceCore {
  constructor() {
    this.driftMemory = [];
  }

  /**
   * 🚀 MAIN ANALYSIS PIPELINE
   */
  analyze(event = {}) {
    /**
     * ==========================
     * STEP 1 — FEATURE EXTRACTION
     * ==========================
     */
    const features = featureEngine.extract(event);

    /**
     * ==========================
     * STEP 2 — RISK FORECASTING
     * ==========================
     */
    const forecast = riskForecastModel.forecast({
      ...event,
      ...features,
    });

    /**
     * ==========================
     * STEP 3 — ANOMALY DETECTION (LIGHTWEIGHT LAYER)
     * ==========================
     */
    const anomaly = this._detectAnomaly(features, forecast);

    /**
     * ==========================
     * STEP 4 — INTELLIGENCE FUSION
     * ==========================
     */
    const intelligence = {
      userId: event.userId,

      features,

      riskScore: forecast.riskScore,
      riskProbability: forecast.riskProbability,
      classification: forecast.classification,

      confidence: forecast.confidence,

      anomalyScore: anomaly.score,
      anomalyType: anomaly.type,

      timestamp: Date.now(),
    };

    /**
     * ==========================
     * STEP 5 — DRIFT TRACKING
     * ==========================
     */
    this._trackDrift(intelligence);

    return intelligence;
  }

  /**
   * ==========================
   * SIMPLE ANOMALY DETECTOR (EARLY SIGNAL LAYER)
   * ==========================
   */
  _detectAnomaly(features, forecast) {
    let score = 0;
    let type = "NONE";

    if (features.requestBurst > 0.8) {
      score += 0.4;
      type = "TRAFFIC_SPIKE";
    }

    if (features.behaviorAnomaly > 0.7) {
      score += 0.4;
      type = "BEHAVIOR_ANOMALY";
    }

    if (forecast.riskProbability > 0.85) {
      score += 0.2;
      type = "HIGH_RISK_CLUSTER";
    }

    return {
      score: Math.min(1, score),
      type,
    };
  }

  /**
   * ==========================
   * DRIFT TRACKING (MODEL HEALTH)
   * ==========================
   */
  _trackDrift(intelligence) {
    this.driftMemory.push({
      risk: intelligence.riskScore,
      anomaly: intelligence.anomalyScore,
      timestamp: intelligence.timestamp,
    });

    if (this.driftMemory.length > 200) {
      this.driftMemory.shift();
    }
  }

  /**
   * ==========================
   * DRIFT SCORE CALCULATION
   * ==========================
   */
  getDriftScore() {
    if (this.driftMemory.length < 10) return 0;

    const avg =
      this.driftMemory.reduce((sum, d) => sum + d.risk, 0) /
      this.driftMemory.length;

    const variance =
      this.driftMemory.reduce(
        (sum, d) => sum + Math.abs(d.risk - avg),
        0
      ) / this.driftMemory.length;

    return Math.min(1, variance);
  }

  /**
   * ==========================
   * SYSTEM HEALTH CHECK
   * ==========================
   */
  getHealth() {
    const drift = this.getDriftScore();

    if (drift < 0.3) return "STABLE";
    if (drift < 0.6) return "UNSTABLE";
    return "CRITICAL";
  }
}

/**
 * Singleton instance
 */
export const securityIntelligenceCore =
  new SecurityIntelligenceCore();
