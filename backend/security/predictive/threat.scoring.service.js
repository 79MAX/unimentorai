import { riskForecastModel } from "./risk.forecast.model.js";
import { autoProtectionMetrics } from "../auto/auto.protection.metrics.js";

/**
 * ==================================================
 * THREAT SCORING SERVICE V2
 * Security Severity Decision Engine
 * ==================================================
 *
 * 🎯 ROLE:
 * - Convert risk probability into actionable threat levels
 * - Map AI predictions to security operations
 */

class ThreatScoringService {
  constructor() {
    /**
     * Severity configuration (tunable)
     */
    this.thresholds = {
      critical: 0.85,
      high: 0.7,
      medium: 0.45,
      low: 0.2,
    };
  }

  /**
   * 🚀 MAIN SCORING FUNCTION
   */
  score(event = {}) {
    const prediction = riskForecastModel.forecast(event);

    const severity = this._mapSeverity(prediction.riskProbability);

    const action = this._mapAction(severity);

    this._trackMetrics(severity);

    return {
      userId: event.userId,
      riskScore: prediction.riskScore,
      riskProbability: prediction.riskProbability,
      classification: prediction.classification,

      severity,
      action,

      confidence: prediction.confidence,
      timestamp: new Date(),
    };
  }

  /**
   * ==========================
   * SEVERITY MAPPING ENGINE
   * ==========================
   */
  _mapSeverity(probability) {
    if (probability >= this.thresholds.critical) {
      return "CRITICAL";
    }

    if (probability >= this.thresholds.high) {
      return "HIGH";
    }

    if (probability >= this.thresholds.medium) {
      return "MEDIUM";
    }

    if (probability >= this.thresholds.low) {
      return "LOW";
    }

    return "MINIMAL";
  }

  /**
   * ==========================
   * ACTION MAPPING ENGINE
   * ==========================
   */
  _mapAction(severity) {
    switch (severity) {
      case "CRITICAL":
        return {
          type: "QUARANTINE",
          urgency: "IMMEDIATE",
        };

      case "HIGH":
        return {
          type: "STRICT_MONITOR",
          urgency: "HIGH",
        };

      case "MEDIUM":
        return {
          type: "RATE_LIMIT",
          urgency: "MEDIUM",
        };

      case "LOW":
        return {
          type: "SOFT_MONITOR",
          urgency: "LOW",
        };

      default:
        return {
          type: "ALLOW",
          urgency: "NONE",
        };
    }
  }

  /**
   * ==========================
   * METRICS TRACKING (IMPORTANT)
   * ==========================
   */
  _trackMetrics(severity) {
    switch (severity) {
      case "CRITICAL":
        autoProtectionMetrics.incrementCriticalAlerts();
        break;

      case "HIGH":
        autoProtectionMetrics.incrementHighRisk();
        break;

      case "MEDIUM":
        autoProtectionMetrics.incrementMediumRisk();
        break;

      case "LOW":
        autoProtectionMetrics.incrementLowRisk();
        break;
    }
  }

  /**
   * ==========================
   * DYNAMIC THRESHOLD UPDATE (SELF-HEAL READY)
   * ==========================
   */
  updateThresholds(newThresholds = {}) {
    this.thresholds = {
      ...this.thresholds,
      ...newThresholds,
    };

    return this.thresholds;
  }

  /**
   * 📊 DEBUG STATE
   */
  getConfig() {
    return this.thresholds;
  }
}

/**
 * Singleton instance
 */
export const threatScoringService = new ThreatScoringService();
