import { autoProtectionMetrics } from "../auto/auto.protection.metrics.js";

/**
 * ==================================================
 * SELF HEALING ENGINE V2
 * UniMentorAI Adaptive Security Optimizer Core
 * ==================================================
 *
 * 🎯 ROLE:
 * - Optimize AI security thresholds
 * - Reduce false positives
 * - Stabilize system behavior over time
 */

class SelfHealingEngine {
  constructor() {
    this.state = {
      thresholds: {
        block: 90,
        restrict: 70,
        monitor: 40,
      },

      stabilityFactor: 0.15,
      lastAdjustment: Date.now(),
      history: [],
    };
  }

  /**
   * 🚀 MAIN OPTIMIZATION LOOP
   */
  runOptimization() {
    const metrics = autoProtectionMetrics.getSnapshot();

    const {
      falsePositiveRate,
      protectionEfficiency,
      systemAggressiveness,
      avgScore,
    } = metrics;

    const adjustment = {
      timestamp: new Date(),
      before: { ...this.state.thresholds },
    };

    /**
     * ==========================
     * 1. OVERLY AGGRESSIVE SYSTEM
     * ==========================
     */
    if (falsePositiveRate > 0.25) {
      this._softenSystem();
      adjustment.action = "SOFTEN";
    }

    /**
     * ==========================
     * 2. UNDER-REACTIVE SYSTEM
     * ==========================
     */
    else if (protectionEfficiency < 0.35) {
      this._tightenSystem();
      adjustment.action = "TIGHTEN";
    }

    /**
     * ==========================
     * 3. OVER-AGGRESSION CONTROL
     * ==========================
     */
    else if (systemAggressiveness > 0.75) {
      this._reduceAggression();
      adjustment.action = "BALANCE";
    } else {
      adjustment.action = "STABLE";
    }

    adjustment.after = { ...this.state.thresholds };

    /**
     * ==========================
     * 4. STABILITY TRACKING
     * ==========================
     */
    this._trackAdjustment(adjustment);

    return this.state;
  }

  /**
   * ==========================
   * SOFTEN SYSTEM (reduce false positives)
   * ==========================
   */
  _softenSystem() {
    this.state.thresholds.block += this._stableDelta(2);
    this.state.thresholds.restrict += this._stableDelta(2);
    this.state.thresholds.monitor += this._stableDelta(1);
  }

  /**
   * ==========================
   * TIGHTEN SYSTEM (increase detection)
   * ==========================
   */
  _tightenSystem() {
    this.state.thresholds.block -= this._stableDelta(3);
    this.state.thresholds.restrict -= this._stableDelta(2);
    this.state.thresholds.monitor -= this._stableDelta(1);
  }

  /**
   * ==========================
   * REDUCE AGGRESSION
   * ==========================
   */
  _reduceAggression() {
    this.state.thresholds.block += this._stableDelta(1);
    this.state.thresholds.restrict += this._stableDelta(1);
  }

  /**
   * ==========================
   * STABILITY DELTA CONTROL
   * prevents system oscillation
   * ==========================
   */
  _stableDelta(value) {
    return Math.round(value * this.state.stabilityFactor * 10) / 10;
  }

  /**
   * ==========================
   * TRACK HISTORY
   * ==========================
   */
  _trackAdjustment(adjustment) {
    this.state.history.push(adjustment);

    // keep last 50 adjustments only
    if (this.state.history.length > 50) {
      this.state.history.shift();
    }

    this.state.lastAdjustment = Date.now();
  }

  /**
   * ==========================
   * GET CURRENT CONFIG
   * ==========================
   */
  getConfig() {
    return this.state;
  }

  /**
   * ==========================
   * RESET ENGINE
   * ==========================
   */
  reset() {
    this.state.thresholds = {
      block: 90,
      restrict: 70,
      monitor: 40,
    };

    this.state.history = [];
  }
}

/**
 * Singleton instance
 */
export const selfHealingEngine = new SelfHealingEngine();
