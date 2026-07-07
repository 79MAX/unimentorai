import { autoProtectionMetrics } from "../auto/auto.protection.metrics.js";
import { selfHealMetrics } from "../self-heal/self.heal.metrics.js";

/**
 * ==================================================
 * PREDICTIVE QUARANTINE SERVICE V2
 * Adaptive Isolation & Protection Layer
 * ==================================================
 *
 * 🎯 ROLE:
 * - Isolate high-risk users BEFORE damage occurs
 * - Apply progressive quarantine levels
 * - Prevent system-wide false positive impact
 */

class PredictiveQuarantineService {
  constructor() {
    /**
     * Active quarantines store
     */
    this.quarantineMap = new Map();
  }

  /**
   * 🚀 MAIN QUARANTINE ENTRY
   */
  async quarantine(userId, riskScore = 0, context = {}) {
    const level = this._determineLevel(riskScore);

    const record = {
      userId,
      level,
      riskScore,
      context,
      status: "ACTIVE",
      createdAt: Date.now(),
      reviewScore: 0,
    };

    this.quarantineMap.set(userId, record);

    this._trackMetrics(level);

    console.log("[QUARANTINE_APPLIED]", record);

    return record;
  }

  /**
   * ==========================
   * QUARANTINE LEVEL ENGINE
   * ==========================
   */
  _determineLevel(score) {
    if (score >= 0.85) return "HARD_LOCK";
    if (score >= 0.7) return "RESTRICTED_ACCESS";
    if (score >= 0.5) return "LIMITED_MONITOR";
    return "SOFT_FLAG";
  }

  /**
   * ==========================
   * CHECK IF USER IS QUARANTINED
   * ==========================
   */
  isQuarantined(userId) {
    return this.quarantineMap.has(userId);
  }

  /**
   * ==========================
   * GET QUARANTINE STATUS
   * ==========================
   */
  getStatus(userId) {
    return this.quarantineMap.get(userId) || null;
  }

  /**
   * ==========================
   * RELEASE LOGIC (SAFE EXIT)
   * ==========================
   */
  release(userId, reason = "manual_release") {
    const record = this.quarantineMap.get(userId);

    if (!record) return false;

    /**
     * Only allow release if risk is re-evaluated low
     */
    if (record.reviewScore >= 0.7) {
      this.quarantineMap.delete(userId);

      console.log("[QUARANTINE_RELEASED]", {
        userId,
        reason,
      });

      this._trackReleaseMetrics(record);

      return true;
    }

    return false;
  }

  /**
   * ==========================
   * AUTO REVIEW UPDATE (FEEDBACK LOOP)
   * ==========================
   */
  updateReview(userId, reviewScore) {
    const record = this.quarantineMap.get(userId);

    if (!record) return null;

    record.reviewScore = reviewScore;

    /**
     * Auto-release if trust restored
     */
    if (reviewScore >= 0.8) {
      return this.release(userId, "auto_trust_recovery");
    }

    return record;
  }

  /**
   * ==========================
   * METRICS TRACKING
   * ==========================
   */
  _trackMetrics(level) {
    switch (level) {
      case "HARD_LOCK":
        autoProtectionMetrics.incrementCriticalAlerts();
        break;

      case "RESTRICTED_ACCESS":
        autoProtectionMetrics.incrementHighRisk();
        break;

      case "LIMITED_MONITOR":
        autoProtectionMetrics.incrementMediumRisk();
        break;

      case "SOFT_FLAG":
        autoProtectionMetrics.incrementLowRisk();
        break;
    }
  }

  /**
   * ==========================
   * RELEASE METRICS
   * ==========================
   */
  _trackReleaseMetrics(record) {
    selfHealMetrics.track(
      { thresholds: {} },
      "BALANCE"
    );
  }

  /**
   * ==========================
   * SYSTEM OVERVIEW
   * ==========================
   */
  getAll() {
    return Array.from(this.quarantineMap.values());
  }

  /**
   * CLEAR SYSTEM (EMERGENCY RESET)
   */
  clearAll() {
    this.quarantineMap.clear();
  }
}

/**
 * Singleton instance
 */
export const predictiveQuarantineService =
  new PredictiveQuarantineService();
