import { securityDecisionEngine } from "./security.decision.engine.js";
import { securityObservability } from "./security.observability.js";

/**
 * ==================================================
 * SECURITY STREAM ENGINE V2
 * UniMentorAI Real-Time Security Pipeline
 * ==================================================
 */

class SecurityStreamEngine {
  constructor() {
    this.eventQueue = [];
    this.isProcessing = false;
  }

  /**
   * ==================================================
   * PUSH EVENT INTO STREAM
   * ==================================================
   */
  async push(event) {
    this.eventQueue.push({
      ...event,
      timestamp: Date.now(),
    });

    if (!this.isProcessing) {
      this._process();
    }
  }

  /**
   * ==================================================
   * STREAM PROCESSOR LOOP
   * ==================================================
   */
  async _process() {
    this.isProcessing = true;

    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift();

      try {
        await this._handleEvent(event);
      } catch (error) {
        console.error("❌ Stream processing error:", error);
      }
    }

    this.isProcessing = false;
  }

  /**
   * ==================================================
   * EVENT HANDLER CORE
   * ==================================================
   */
  async _handleEvent(event) {
    const enrichedEvent = this._enrich(event);

    /**
     * STEP 1: SECURITY DECISION
     */
    const result = await securityDecisionEngine.evaluate(
      enrichedEvent
    );

    /**
     * STEP 2: OBSERVABILITY LOGGING
     */
    await securityObservability.log({
      userId: enrichedEvent.userId,
      ip: enrichedEvent.ip,
      action: enrichedEvent.action,
      riskScore: result.risk,
      decision: result.decision.action,
      source: "stream_engine",
    });

    /**
     * STEP 3: REAL-TIME RESPONSE HOOK
     */
    await this._react(result, enrichedEvent);
  }

  /**
   * ==================================================
   * EVENT ENRICHMENT
   * ==================================================
   */
  _enrich(event) {
    return {
      ...event,
      source: event.source || "api",
      receivedAt: new Date().toISOString(),
    };
  }

  /**
   * ==================================================
   * REAL-TIME REACTION ENGINE
   * ==================================================
   */
  async _react(result, event) {
    const action = result.decision.action;

    switch (action) {
      case "BLOCK":
        console.warn(
          `🚨 BLOCKED EVENT for user ${event.userId}`
        );
        break;

      case "QUARANTINE":
        console.warn(
          `⚠️ QUARANTINE triggered for user ${event.userId}`
        );
        break;

      case "THROTTLE":
        console.log(
          `⏳ THROTTLING user ${event.userId}`
        );
        break;

      case "CHALLENGE":
        console.log(
          `🔐 SECURITY CHALLENGE required`
        );
        break;

      case "ALLOW":
      default:
        break;
    }
  }

  /**
   * ==================================================
   * METRICS FOR MONITORING
   * ==================================================
   */
  getQueueSize() {
    return this.eventQueue.length;
  }
}

export const securityStreamEngine =
  new SecurityStreamEngine();
