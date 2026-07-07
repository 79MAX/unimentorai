import { securityObservability } from "./security.observability.js";

/**
 * ==================================================
 * SECURITY ADAPTIVE LEARNING V2
 * UniMentorAI Self-Improving Security Brain
 * ==================================================
 */

class SecurityAdaptiveLearning {
  constructor() {
    this.feedbackMemory = [];
    this.thresholds = {
      BLOCK: 85,
      QUARANTINE: 65,
      THROTTLE: 45,
      CHALLENGE: 25,
    };
  }

  /**
   * ==================================================
   * MAIN LEARNING ENTRY
   * ==================================================
   */
  async learn(event) {
    this.feedbackMemory.push(event);

    if (this.feedbackMemory.length > 100) {
      this.feedbackMemory.shift();
    }

    this._adjustThresholds();

    await this._log(event);
  }

  /**
   * ==================================================
   * AUTO THRESHOLD OPTIMIZATION
   * ==================================================
   */
  _adjustThresholds() {
    const stats = this._analyzeFeedback();

    /**
     * If too many BLOCKS → system too strict
     */
    if (stats.blockRate > 0.3) {
      this.thresholds.BLOCK += 2;
      this.thresholds.QUARANTINE += 2;
    }

    /**
     * If too many ALLOW (missed threats) → system too loose
     */
    if (stats.allowRate > 0.6) {
      this.thresholds.BLOCK -= 2;
      this.thresholds.QUARANTINE -= 2;
    }

    /**
     * Clamp values to safe bounds
     */
    this._clampThresholds();
  }

  /**
   * ==================================================
   * ANALYTICS ON RECENT DECISIONS
   * ==================================================
   */
  _analyzeFeedback() {
    const total = this.feedbackMemory.length || 1;

    const blocks = this.feedbackMemory.filter(
      (e) => e.decision === "BLOCK"
    ).length;

    const allows = this.feedbackMemory.filter(
      (e) => e.decision === "ALLOW"
    ).length;

    return {
      blockRate: blocks / total,
      allowRate: allows / total,
    };
  }

  /**
   * ==================================================
   * SAFETY BOUNDS
   * ==================================================
   */
  _clampThresholds() {
    this.thresholds.BLOCK = Math.max(
      70,
      Math.min(this.thresholds.BLOCK, 95)
    );

    this.thresholds.QUARANTINE = Math.max(
      50,
      Math.min(this.thresholds.QUARANTINE, 85)
    );

    this.thresholds.THROTTLE = Math.max(
      30,
      Math.min(this.thresholds.THROTTLE, 70)
    );

    this.thresholds.CHALLENGE = Math.max(
      10,
      Math.min(this.thresholds.CHALLENGE, 50)
    );
  }

  /**
   * ==================================================
   * GET CURRENT THRESHOLDS (FOR DECISION ENGINE)
   * ==================================================
   */
  getThresholds() {
    return this.thresholds;
  }

  /**
   * ==================================================
   * LOGGING / OBSERVABILITY
   * ==================================================
   */
  async _log(event) {
    await securityObservability.log({
      type: "adaptive_learning",
      event,
      thresholds: this.thresholds,
      timestamp: new Date().toISOString(),
    });
  }
}

export const securityAdaptiveLearning =
  new SecurityAdaptiveLearning();
