import { securityObservability } from "./security.observability.js";
import { securityDecisionEngine } from "./security.decision.engine.js";

/**
 * ==================================================
 * SECURITY ADAPTIVE LEARNING V2
 * Self-Healing Security Intelligence Layer
 * ==================================================
 *
 * 🎯 ROLE:
 * - Learn from system outcomes
 * - Adjust thresholds dynamically
 * - Reduce false positives/negatives
 * - Stabilize predictive security system
 */

class SecurityAdaptiveLearning {
  constructor() {
    this.learningRate = 0.05;

    this.adjustments = {
      CRITICAL: 0.85,
      HIGH: 0.7,
      MEDIUM: 0.45,
      LOW: 0.2,
    };

    this.history = [];
  }

  /**
   * 🚀 MAIN LEARNING LOOP
   */
  learn() {
    const precision = securityObservability.getPrecision();
    const recall = securityObservability.getRecall();
    const drift = securityObservability.getDriftScore();

    /**
     * STORE HISTORY FOR STABILITY ANALYSIS
     */
    this.history.push({
      precision,
      recall,
      drift,
      timestamp: Date.now(),
    });

    if (this.history.length > 200) {
      this.history.shift();
    }

    /**
     * ==========================
     * ADAPTATION LOGIC
     * ==========================
     */
    this._adjustForPrecision(precision);
    this._adjustForRecall(recall);
    this._adjustForDrift(drift);

    /**
     * APPLY UPDATED POLICY
     */
    securityDecisionEngine.updatePolicy(this.adjustments);

    return {
      policy: this.adjustments,
      precision,
      recall,
      drift,
    };
  }

  /**
   * ==========================
   * FALSE POSITIVE REDUCTION
   * ==========================
   */
  _adjustForPrecision(precision) {
    if (precision < 0.6) {
      /**
       * TOO MANY FALSE POSITIVES
       * → raise thresholds slightly
       */
      this.adjustments.HIGH += this.learningRate;
      this.adjustments.MEDIUM += this.learningRate;
    }

    if (precision > 0.9) {
      /**
       * SYSTEM TOO STRICT → relax slightly
       */
      this.adjustments.HIGH -= this.learningRate;
    }
  }

  /**
   * ==========================
   * FALSE NEGATIVE REDUCTION
   * ==========================
   */
  _adjustForRecall(recall) {
    if (recall < 0.6) {
      /**
       * MISS DETECTION → lower thresholds
       */
      this.adjustments.CRITICAL -= this.learningRate;
      this.adjustments.HIGH -= this.learningRate;
    }

    if (recall > 0.9) {
      /**
       * SYSTEM TOO SENSITIVE → stabilize
       */
      this.adjustments.CRITICAL += this.learningRate * 0.5;
    }
  }

  /**
   * ==========================
   * DRIFT CORRECTION ENGINE
   * ==========================
   */
  _adjustForDrift(drift) {
    if (drift > 0.5) {
      /**
       * MODEL UNSTABLE → tighten system
       */
      this.adjustments.MEDIUM += this.learningRate;
      this.adjustments.HIGH += this.learningRate;
    }

    if (drift < 0.2) {
      /**
       * SYSTEM STABLE → can relax slightly
       */
      this.adjustments.LOW -= this.learningRate * 0.5;
    }
  }

  /**
   * ==========================
   * GET CURRENT POLICY
   * ==========================
   */
  getPolicy() {
    return this.adjustments;
  }

  /**
   * ==========================
   * STABILITY ANALYSIS
   * ==========================
   */
  getStabilityReport() {
    if (this.history.length < 10) {
      return {
        status: "INSUFFICIENT_DATA",
      };
    }

    const avgPrecision =
      this.history.reduce((a, b) => a + b.precision, 0) /
      this.history.length;

    const avgRecall =
      this.history.reduce((a, b) => a + b.recall, 0) /
      this.history.length;

    const avgDrift =
      this.history.reduce((a, b) => a + b.drift, 0) /
      this.history.length;

    return {
      avgPrecision,
      avgRecall,
      avgDrift,

      stability:
        avgDrift < 0.3 ? "STABLE" : "UNSTABLE",
    };
  }

  /**
   * ==========================
   * RESET LEARNING SYSTEM
   * ==========================
   */
  reset() {
    this.history = [];

    this.adjustments = {
      CRITICAL: 0.85,
      HIGH: 0.7,
      MEDIUM: 0.45,
      LOW: 0.2,
    };
  }
}

/**
 * Singleton instance
 */
export const securityAdaptiveLearning =
  new SecurityAdaptiveLearning();
