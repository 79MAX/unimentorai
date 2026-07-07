import { selfHealingEngine } from "./self.healing.engine.js";

/**
 * ==================================================
 * SELF-HEAL SCHEDULER V2
 * UniMentorAI Adaptive Timing Orchestrator
 * ==================================================
 *
 * 🎯 ROLE:
 * - Schedule self-healing optimization loops
 * - Adapt frequency dynamically
 * - Prevent system overload
 */

class SelfHealScheduler {
  constructor() {
    this.interval = null;

    this.config = {
      baseInterval: 60000, // 60s
      minInterval: 15000,  // 15s
      maxInterval: 300000, // 5min
      adaptiveMode: true,
    };

    this.lastMetricsSnapshot = null;
  }

  /**
   * 🚀 START SCHEDULER
   */
  start() {
    if (this.interval) {
      console.warn("[SELF_HEAL_SCHEDULER] Already running");
      return;
    }

    this._scheduleNext(this.config.baseInterval);

    console.log("[SELF_HEAL_SCHEDULER_STARTED]");
  }

  /**
   * 🧠 CORE LOOP
   */
  async _tick() {
    try {
      /**
       * ==========================
       * RUN SELF-HEALING ENGINE
       * ==========================
       */
      const config = selfHealingEngine.runOptimization();

      /**
       * ==========================
       * ADAPT FREQUENCY
       * ==========================
       */
      const nextInterval = this._calculateNextInterval(config);

      /**
       * ==========================
       * RESCHEDULE
       * ==========================
       */
      this._scheduleNext(nextInterval);

      /**
       * ==========================
       * DEBUG LOG
       * ==========================
       */
      console.log("[SELF_HEAL_TICK]", {
        nextInterval,
        thresholds: config.thresholds,
      });
    } catch (error) {
      console.error("[SELF_HEAL_SCHEDULER_ERROR]", error.message);

      /**
       * SAFE FALLBACK
       */
      this._scheduleNext(this.config.baseInterval);
    }
  }

  /**
   * ==========================
   * ADAPTIVE INTERVAL ENGINE
   * ==========================
   */
  _calculateNextInterval(config) {
    if (!this.config.adaptiveMode) {
      return this.config.baseInterval;
    }

    const thresholds = config.thresholds;

    let interval = this.config.baseInterval;

    /**
     * 🟠 HIGH RISK SYSTEM → CHECK MORE OFTEN
     */
    if (thresholds.block < 85) {
      interval *= 0.7;
    }

    /**
     * 🔵 STABLE SYSTEM → CHECK LESS OFTEN
     */
    if (thresholds.block >= 90 && thresholds.restrict >= 70) {
      interval *= 1.3;
    }

    /**
     * ⚖️ BOUNDARIES
     */
    return Math.max(
      this.config.minInterval,
      Math.min(this.config.maxInterval, interval)
    );
  }

  /**
   * ==========================
   * SCHEDULING WRAPPER
   * ==========================
   */
  _scheduleNext(delay) {
    this.interval = setTimeout(() => {
      this._tick();
    }, delay);
  }

  /**
   * 🛑 STOP SCHEDULER
   */
  stop() {
    if (this.interval) {
      clearTimeout(this.interval);
      this.interval = null;

      console.log("[SELF_HEAL_SCHEDULER_STOPPED]");
    }
  }

  /**
   * 📊 GET STATUS
   */
  getStatus() {
    return {
      running: !!this.interval,
      config: this.config,
    };
  }
}

/**
 * Singleton instance
 */
export const selfHealScheduler = new SelfHealScheduler();
