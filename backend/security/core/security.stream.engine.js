import { securityIntelligenceCore } from "./security.intelligence.core.js";
import { securityDecisionEngine } from "./security.decision.engine.js";
import { securityEnforcementLayer } from "./security.enforcement.layer.js";
import { securityObservability } from "./security.observability.js";

/**
 * ==================================================
 * SECURITY STREAM ENGINE V2
 * Real-Time Security Event Backbone
 * ==================================================
 *
 * 🎯 ROLE:
 * - Ingest all security events in real-time
 * - Normalize + enrich + route pipeline
 * - Prevent overload via backpressure control
 */

class SecurityStreamEngine {
  constructor() {
    this.queue = [];
    this.processing = false;

    this.stats = {
      received: 0,
      processed: 0,
      dropped: 0,
    };

    this.maxQueueSize = 3000;
  }

  /**
   * 🚀 ENTRY POINT (REAL-TIME INGESTION)
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
      return {
        status: "DROPPED",
        reason: "BACKPRESSURE_LIMIT_REACHED",
      };
    }

    const normalizedEvent = this._normalize(event);

    this.queue.push(normalizedEvent);

    if (!this.processing) {
      this._process();
    }

    return { status: "QUEUED" };
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

        await this._handle(event);

        this.stats.processed++;
      }
    } finally {
      this.processing = false;
    }
  }

  /**
   * ==========================
   * EVENT PIPELINE CORE
   * ==========================
   */
  async _handle(event) {
    /**
     * STEP 1 — INTELLIGENCE CORE (FEATURE + RISK + PREDICTION)
     */
    const intelligence =
      securityIntelligenceCore.analyze(event);

    /**
     * STEP 2 — DECISION ENGINE
     */
    const decision =
      securityDecisionEngine.decide({
        ...event,
        ...intelligence,
      });

    /**
     * STEP 3 — ENFORCEMENT LAYER
     */
    await securityEnforcementLayer.execute(decision);

    /**
     * STEP 4 — OBSERVABILITY TRACKING
     */
    securityObservability.record({
      event,
      intelligence,
      decision,
    });
  }

  /**
   * ==========================
   * EVENT NORMALIZATION
   * ==========================
   */
  _normalize(event) {
    return {
      userId: event.userId || null,
      type: event.type || "unknown",
      ip: event.ip || "0.0.0.0",
      timestamp: event.timestamp || Date.now(),

      geo: event.geo || {},
      device: event.device || {},
      context: event.context || {},

      raw: event,
    };
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
export const securityStreamEngine = new SecurityStreamEngine();
