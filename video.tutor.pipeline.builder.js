/**
 * VIDEO TUTOR PIPELINE BUILDER - UniMentorAI
 * Dynamic AI processing pipeline orchestrator
 */

class VideoTutorPipelineBuilder {
  constructor({
    authGuard,
    rateLimiter,
    abuseDetector,
    contextStore,
    stateManager,
    eventBus,
    telemetry,
    debugTracer,
    orchestrator,
    responseEngine
  }) {
    this.authGuard = authGuard;
    this.rateLimiter = rateLimiter;
    this.abuseDetector = abuseDetector;
    this.contextStore = contextStore;
    this.stateManager = stateManager;
    this.eventBus = eventBus;
    this.telemetry = telemetry;
    this.debugTracer = debugTracer;
    this.orchestrator = orchestrator;
    this.responseEngine = responseEngine;
  }

  /**
   * 🚀 MAIN PIPELINE EXECUTION
   */
  async execute(input) {
    const traceId = this._createTraceId();

    this.debugTracer.startTrace(traceId, input);

    try {
      // =========================
      // 1. AUTH LAYER
      // =========================
      this.debugTracer.addStep(traceId, "auth_guard");

      const auth = await this.authGuard.protect(input);

      if (!auth.allowed) {
        return this._deny(traceId, auth);
      }

      // =========================
      // 2. RATE LIMITING
      // =========================
      this.debugTracer.addStep(traceId, "rate_limiter");

      const rate = this.rateLimiter.check(input.userId, input);

      if (!rate.allowed) {
        return this._deny(traceId, rate);
      }

      // =========================
      // 3. ABUSE DETECTION
      // =========================
      this.debugTracer.addStep(traceId, "abuse_detector");

      const abuse = this.abuseDetector.analyze(input.userId, input);

      if (abuse.flagged) {
        return this._deny(traceId, abuse);
      }

      // =========================
      // 4. STATE + CONTEXT
      // =========================
      this.debugTracer.addStep(traceId, "context_build");

      const state = this.stateManager.getState(input.userId);

      const context = this.contextStore.build({
        userId: input.userId,
        payload: input,
        state
      });

      // =========================
      // 5. ORCHESTRATION
      // =========================
      this.debugTracer.addStep(traceId, "orchestrator");

      const decision = await this.orchestrator.process(context);

      // =========================
      // 6. RESPONSE ENGINE
      // =========================
      this.debugTracer.addStep(traceId, "response_engine");

      const response = await this.responseEngine.generate(decision);

      // =========================
      // 7. TELEMETRY
      // =========================
      this.telemetry.collect({
        type: "pipeline.success",
        userId: input.userId,
        latency: Date.now() - context.timing.timestamp
      });

      // =========================
      // FINAL TRACE
      // =========================
      this.debugTracer.endTrace(traceId, response);

      this.eventBus.emit("pipeline.completed", {
        userId: input.userId,
        traceId
      });

      return response;

    } catch (error) {
      this.debugTracer.endTrace(traceId, { error: error.message });

      this.eventBus.emit("pipeline.failed", {
        userId: input.userId,
        error: error.message
      });

      throw error;
    }
  }

  /**
   * 🚫 DENY HANDLER
   */
  _deny(traceId, reason) {
    this.debugTracer.addStep(traceId, "denied");

    this.eventBus.emit("pipeline.blocked", {
      traceId,
      reason
    });

    return {
      success: false,
      reason: reason.reason || "blocked"
    };
  }

  /**
   * 🧠 Trace ID generator
   */
  _createTraceId() {
    return `trace_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }
}

module.exports = VideoTutorPipelineBuilder;
