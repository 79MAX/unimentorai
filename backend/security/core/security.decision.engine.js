import { securityEnforcementLayer } from "./security.enforcement.layer.js";
import { securityObservability } from "./security.observability.js";

/**
 * ==================================================
 * SECURITY DECISION ENGINE V2
 * Policy-Based Security Decision Core
 * ==================================================
 *
 * 🎯 ROLE:
 * - Convert intelligence signals into actions
 * - Apply security policies
 * - Ensure explainability & auditability
 */

class SecurityDecisionEngine {
  constructor() {
    /**
     * Policy thresholds (tunable)
     */
    this.policy = {
      CRITICAL: 0.85,
      HIGH: 0.7,
      MEDIUM: 0.45,
      LOW: 0.2,
    };
  }

  /**
   * 🚀 MAIN DECISION PIPELINE
   */
  decide(intelligence = {}) {
    const score = intelligence.riskProbability || intelligence.riskScore;

    const severity = this._classify(score, intelligence);
    const action = this._mapAction(severity, intelligence);
    const explanation = this._explain(intelligence, severity);

    const decision = {
      userId: intelligence.userId,

      score,
      severity,
      action,

      explanation,

      confidence: intelligence.confidence,
      anomalyScore: intelligence.anomalyScore,

      timestamp: Date.now(),
    };

    /**
     * ==========================
     * EXECUTE IMMEDIATELY (FAST PATH)
     * ==========================
     */
    this._execute(decision);

    /**
     * ==========================
     * OBSERVABILITY TRACKING
     * ==========================
     */
    securityObservability.recordDecision(decision);

    return decision;
  }

  /**
   * ==========================
   * SEVERITY CLASSIFICATION
   * ==========================
   */
  _classify(score, intelligence) {
    if (score >= this.policy.CRITICAL) return "CRITICAL";
    if (score >= this.policy.HIGH) return "HIGH";
    if (score >= this.policy.MEDIUM) return "MEDIUM";
    if (score >= this.policy.LOW) return "LOW";

    /**
     * anomaly override (important for zero-day patterns)
     */
    if (intelligence.anomalyScore > 0.8) {
      return "MEDIUM";
    }

    return "SAFE";
  }

  /**
   * ==========================
   * ACTION MAPPING ENGINE
   * ==========================
   */
  _mapAction(severity, intelligence) {
    switch (severity) {
      case "CRITICAL":
        return {
          type: "QUARANTINE",
          mode: "HARD_LOCK",
        };

      case "HIGH":
        return {
          type: "RESTRICT",
          mode: "STRICT_MONITOR",
        };

      case "MEDIUM":
        return {
          type: "LIMIT",
          mode: "RATE_LIMIT",
        };

      case "LOW":
        return {
          type: "MONITOR",
          mode: "SOFT",
        };

      default:
        return {
          type: "ALLOW",
          mode: "NONE",
        };
    }
  }

  /**
   * ==========================
   * EXECUTION PIPELINE
   * ==========================
   */
  _execute(decision) {
    securityEnforcementLayer.execute(decision);
  }

  /**
   * ==========================
   * EXPLANATION ENGINE (IMPORTANT FOR DEBUG + AI TRUST)
   * ==========================
   */
  _explain(intelligence, severity) {
    return {
      reason: this._getPrimaryReason(intelligence),
      severity,
      factors: {
        risk: intelligence.riskScore,
        anomaly: intelligence.anomalyScore,
        confidence: intelligence.confidence,
      },
    };
  }

  _getPrimaryReason(i) {
    if (i.anomalyScore > 0.8) return "HIGH_ANOMALY_DETECTED";
    if (i.riskProbability > 0.8) return "HIGH_RISK_PROBABILITY";
    if (i.features?.requestBurst > 0.8) return "TRAFFIC_SPIKE";
    if (i.features?.behaviorAnomaly > 0.7) return "BEHAVIORAL_ANOMALY";

    return "NORMAL_BEHAVIOR";
  }

  /**
   * ==========================
   * POLICY UPDATE (SELF-HEAL READY)
   * ==========================
   */
  updatePolicy(newPolicy = {}) {
    this.policy = {
      ...this.policy,
      ...newPolicy,
    };

    return this.policy;
  }

  /**
   * ==========================
   * DEBUG STATE
   * ==========================
   */
  getPolicy() {
    return this.policy;
  }
}

/**
 * Singleton instance
 */
export const securityDecisionEngine =
  new SecurityDecisionEngine();
