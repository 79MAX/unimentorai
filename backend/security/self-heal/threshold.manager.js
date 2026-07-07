 /**
 * ==================================================
 * THRESHOLD MANAGER V2
 * UniMentorAI Dynamic Security Policy Engine
 * ==================================================
 *
 * 🎯 ROLE:
 * - Centralized threshold control
 * - Dynamic updates from self-healing engine
 * - System-wide consistency for AI decisions
 */

class ThresholdManager {
  constructor() {
    this.thresholds = {
      block: 90,
      restrict: 70,
      monitor: 40,
    };

    this.history = [];
  }

  /**
   * 🚀 GET CURRENT THRESHOLDS
   */
  get() {
    return this.thresholds;
  }

  /**
   * ==========================
   * UPDATE THRESHOLDS (SELF-HEALING INPUT)
   * ==========================
   */
  update(newThresholds = {}, source = "system") {
    const previous = { ...this.thresholds };

    this.thresholds = {
      ...this.thresholds,
      ...this._sanitize(newThresholds),
    };

    this._trackChange(previous, source);

    console.log("[THRESHOLD_UPDATED]", {
      previous,
      current: this.thresholds,
      source,
    });

    return this.thresholds;
  }

  /**
   * ==========================
   * SAFE SANITIZATION (ANTI BREAK SYSTEM)
   * ==========================
   */
  _sanitize(input) {
    const safe = {};

    if (this._isValid(input.block)) {
      safe.block = this._clamp(input.block, 50, 99);
    }

    if (this._isValid(input.restrict)) {
      safe.restrict = this._clamp(input.restrict, 30, 89);
    }

    if (this._isValid(input.monitor)) {
      safe.monitor = this._clamp(input.monitor, 10, 69);
    }

    /**
     * Ensure logical ordering ALWAYS:
     * monitor < restrict < block
     */
    if (safe.monitor >= safe.restrict) {
      safe.monitor = safe.restrict - 5;
    }

    if (safe.restrict >= safe.block) {
      safe.restrict = safe.block - 10;
    }

    return safe;
  }

  /**
   * ==========================
   * VALIDATION
   * ==========================
   */
  _isValid(value) {
    return typeof value === "number" && !isNaN(value);
  }

  /**
   * ==========================
   * CLAMP VALUES
   * ==========================
   */
  _clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  /**
   * ==========================
   * CHANGE TRACKING
   * ==========================
   */
  _trackChange(previous, source) {
    this.history.push({
      previous,
      current: { ...this.thresholds },
      source,
      timestamp: new Date(),
    });

    /**
     * Keep only last 100 changes
     */
    if (this.history.length > 100) {
      this.history.shift();
    }
  }

  /**
   * ==========================
   * RESET TO DEFAULTS
   * ==========================
   */
  reset() {
    this.thresholds = {
      block: 90,
      restrict: 70,
      monitor: 40,
    };
  }

  /**
   * ==========================
   * ANALYTICS READY OUTPUT
   * ==========================
   */
  getHistory() {
    return this.history;
  }
}

/**
 * Singleton instance
 */
export const thresholdManager = new ThresholdManager();
