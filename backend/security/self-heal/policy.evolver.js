import { selfHealFeedback } from "./self.heal.feedback.js";
import { autoProtectionMetrics } from "../auto/auto.protection.metrics.js";

/**
 * ==================================================
 * POLICY EVOLVER V2
 * UniMentorAI Adaptive Security Policy Engine
 * ==================================================
 *
 * 🎯 ROLE:
 * - Evolve security rules dynamically
 * - Convert metrics into policies
 * - Optimize fraud detection strategy over time
 */

class PolicyEvolver {
  constructor() {
    this.policies = {
      strictMode: false,
      autoBlockHighRisk: true,
      geoRestrictionEnabled: true,
      rateLimitStrictMode: false,
    };

    this.history = [];
  }

  /**
   * 🚀 MAIN EVOLUTION LOOP
   */
  evolve() {
    const metrics = autoProtectionMetrics.getSnapshot();
    const feedback = selfHealFeedback.analyze();

    const snapshot = {
      before: { ...this.policies },
      timestamp: new Date(),
    };

    /**
     * ==========================
     * 1. HIGH FALSE POSITIVE RATE
     * ==========================
     */
    if (metrics.falsePositiveRate > 0.25) {
      this._relaxPolicies();
      snapshot.action = "RELAX";
    }

    /**
     * ==========================
     * 2. LOW DETECTION POWER
     * ==========================
     */
    else if (metrics.protectionEfficiency < 0.35) {
      this._strengthenPolicies();
      snapshot.action = "STRENGTHEN";
    }

    /**
     * ==========================
     * 3. LOW PRECISION (FEEDBACK SIGNAL)
     * ==========================
     */
    else if (feedback.precision < 0.6) {
      this._optimizePrecision();
      snapshot.action = "OPTIMIZE_PRECISION";
    }

    /**
     * ==========================
     * 4. SYSTEM STABLE
     * ==========================
     */
    else {
      snapshot.action = "STABLE";
    }

    snapshot.after = { ...this.policies };

    this._track(snapshot);

    console.log("[POLICY_EVOLUTION]", snapshot);

    return this.policies;
  }

  /**
   * ==========================
   * RELAX SYSTEM (reduce aggressiveness)
   * ==========================
   */
  _relaxPolicies() {
    this.policies.autoBlockHighRisk = false;
    this.policies.rateLimitStrictMode = false;
  }

  /**
   * ==========================
   * STRENGTHEN SYSTEM (increase detection)
   * ==========================
   */
  _strengthenPolicies() {
    this.policies.autoBlockHighRisk = true;
    this.policies.rateLimitStrictMode = true;
  }

  /**
   * ==========================
   * PRECISION OPTIMIZATION
   * ==========================
   */
  _optimizePrecision() {
    this.policies.geoRestrictionEnabled = true;
    this.policies.strictMode = true;
  }

  /**
   * ==========================
   * HISTORY TRACKING
   * ==========================
   */
  _track(snapshot) {
    this.history.push(snapshot);

    // keep last 100 evolutions
    if (this.history.length > 100) {
      this.history.shift();
    }
  }

  /**
   * ==========================
   * GET CURRENT POLICY STATE
   * ==========================
   */
  getPolicies() {
    return this.policies;
  }

  /**
   * ==========================
   * RESET POLICIES
   * ==========================
   */
  reset() {
    this.policies = {
      strictMode: false,
      autoBlockHighRisk: true,
      geoRestrictionEnabled: true,
      rateLimitStrictMode: false,
    };
  }

  /**
   * ==========================
   * GET EVOLUTION HISTORY
   * ==========================
   */
  getHistory() {
    return this.history;
  }
}

/**
 * Singleton instance
 */
export const policyEvolver = new PolicyEvolver();
