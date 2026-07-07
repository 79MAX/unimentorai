 /**
 * ==================================================
 * SELF HEAL METRICS V2
 * UniMentorAI Adaptive Learning Observability Layer
 * ==================================================
 *
 * 🎯 ROLE:
 * - Measure self-healing effectiveness
 * - Track system stability over time
 * - Detect over-adjustment / instability
 */

class SelfHealMetrics {
  constructor() {
    this.metrics = {
      totalCycles: 0,

      adjustments: 0,
      stableCycles: 0,
      unstableCycles: 0,

      softenActions: 0,
      tightenActions: 0,
      balanceActions: 0,

      oscillations: 0,

      avgAdjustmentMagnitude: 0,
      stabilityScore: 1,
    };

    this.lastState = null;
  }

  /**
   * 🚀 MAIN TRACKING FUNCTION
   */
  track(state = {}, action = "STABLE") {
    this.metrics.totalCycles++;

    /**
     * ==========================
     * ACTION CLASSIFICATION
     * ==========================
     */
    if (action === "SOFTEN") this.metrics.softenActions++;
    if (action === "TIGHTEN") this.metrics.tightenActions++;
    if (action === "BALANCE") this.metrics.balanceActions++;

    if (action === "STABLE") {
      this.metrics.stableCycles++;
    } else {
      this.metrics.adjustments++;
    }

    /**
     * ==========================
     * OSCILLATION DETECTION
     * ==========================
     */
    if (this.lastState) {
      const changed = this._detectOscillation(this.lastState, state);

      if (changed) {
        this.metrics.oscillations++;
      }
    }

    this.lastState = { ...state };

    /**
     * ==========================
     * UPDATE STABILITY SCORE
     * ==========================
     */
    this._updateStabilityScore();

    return this.getSnapshot();
  }

  /**
   * ==========================
   * OSCILLATION DETECTOR
   * ==========================
   */
  _detectOscillation(prev, current) {
    return (
      prev?.thresholds?.block !== current?.thresholds?.block ||
      prev?.thresholds?.restrict !== current?.thresholds?.restrict ||
      prev?.thresholds?.monitor !== current?.thresholds?.monitor
    );
  }

  /**
   * ==========================
   * STABILITY SCORE ENGINE
   * ==========================
   */
  _updateStabilityScore() {
    const total = this.metrics.totalCycles;

    if (total === 0) return;

    const instability =
      (this.metrics.oscillations + this.metrics.adjustments) / total;

    this.metrics.stabilityScore = Math.max(0, 1 - instability);
  }

  /**
   * ==========================
   * SNAPSHOT OUTPUT
   * ==========================
   */
  getSnapshot() {
    return {
      ...this.metrics,

      /**
       * KEY INSIGHT KPIs
       */
      healingEfficiency: this._healingEfficiency(),
      systemStability: this.metrics.stabilityScore,
      oscillationRate: this._oscillationRate(),
    };
  }

  /**
   * ==========================
   * HEALING EFFICIENCY
   * ==========================
   */
  _healingEfficiency() {
    const total =
      this.metrics.adjustments + this.metrics.stableCycles;

    if (total === 0) return 0;

    return this.metrics.stableCycles / total;
  }

  /**
   * ==========================
   * OSCILLATION RATE
   * ==========================
   */
  _oscillationRate() {
    if (this.metrics.totalCycles === 0) return 0;

    return this.metrics.oscillations / this.metrics.totalCycles;
  }

  /**
   * ==========================
   * RESET SYSTEM
   * ==========================
   */
  reset() {
    this.metrics = {
      totalCycles: 0,
      adjustments: 0,
      stableCycles: 0,
      unstableCycles: 0,
      softenActions: 0,
      tightenActions: 0,
      balanceActions: 0,
      oscillations: 0,
      avgAdjustmentMagnitude: 0,
      stabilityScore: 1,
    };

    this.lastState = null;
  }
}

/**
 * Singleton instance
 */
export const selfHealMetrics = new SelfHealMetrics();
