import { featureEngine } from "./feature.engine.js";
import { predictiveSecurityEngine } from "./predictive.security.engine.js";
import { predictiveSecurityHook } from "./predictive.security.hook.js";
import { selfHealMetrics } from "../self-heal/self.heal.metrics.js";

/**
 * ==================================================
 * PREDICTIVE STREAM V2
 * Real-Time Security Event Pipeline
 * ==================================================
 *
 * 🎯 ROLE:
 * - Process security events in real-time
 * - Feed predictive engine instantly
 * - Prevent system overload (backpressure)
 */

class PredictiveStream {
  constructor() {
    this.queue = [];
    this.processing = false;

    this.stats = {
      received: 0,
      processed: 0,
      dropped: 0,
    };

    this.maxQueueSize = 2000;
  }

  /**
   * 🚀 EVENT INGESTION ENTRY POINT
   */
  async ingest(event = {}) {
    this.stats.received++;

    /**
     * ==========================
     * BACKPRESSURE PROTECTION
     * ==========================
     */
    if (this.queue.length >= this.maxQueueSize) {
      this.stats.dropped++;
      return;
    }

    this.queue.push(event);

    if (!this.processing) {
      this._process();
    }
  }

  /**
   * ==========================
   * STREAM PROCESSOR LOOP
   * ==========================
   */
  async _process() {
    this.processing = true;

    try {
      while (this.queue.length > 0) {
        const event = this.queue.shift();

        await this._handleEvent(event);

        this.stats.processed++;
      }
    } finally {
      this.processing = false;
    }
  }

  /**
   * ==========================
   * CORE EVENT PIPELINE
   * ==========================
   */
  async _handleEvent(event) {
    /**
     * STEP 1 — FEATURE EXTRACTION
     */
    const features = featureEngine.extract(event);

    /**
     * STEP 2 — PREDICTION
     */
    const prediction =
      predictiveSecurityEngine.predict({
        ...event,
        ...features,
      });

    /**
     * STEP 3 — DECISION & ACTION
     */
    await predictiveSecurityHook.handle({
      ...event,
      features,
      prediction,
    });

    /**
     * ==========================
     * SELF-HEAL METRICS UPDATE
     * ==========================
     */
    selfHealMetrics.track(
      { thresholds: {} },
      prediction.classification === "NORMAL"
        ? "STABLE"
        : "BALANCE"
    );
  }

  /**
   * ==========================
   * STREAM STATUS
   * ==========================
   */
  getStatus() {
    return {
      queueSize: this.queue.length,
      processing: this.processing,
      stats: this.stats,
    };
  }

  /**
   * ==========================
   * EMERGENCY RESET
   * ==========================
   */
  reset() {
    this.queue = [];
    this.processing = false;
  }
}

/**
 * Singleton instance
 */
export const predictiveStream = new PredictiveStream();
