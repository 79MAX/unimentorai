/**
 * VIDEO TUTOR DEBUG TRACER - UniMentorAI
 * End-to-end tracing system for AI Tutor decisions
 */

class VideoTutorDebugTracer {
  constructor({ logger, eventBus }) {
    this.logger = logger;
    this.eventBus = eventBus;

    // in-memory trace store (replace with distributed tracing system in prod)
    this.traces = new Map();
  }

  /**
   * 🎯 Start trace session
   */
  startTrace(traceId, context) {
    const trace = {
      traceId,
      startTime: Date.now(),
      context,
      steps: []
    };

    this.traces.set(traceId, trace);

    this._log("trace_start", trace);

    return traceId;
  }

  /**
   * 📍 Add step to trace
   */
  addStep(traceId, stepName, data = {}) {
    const trace = this.traces.get(traceId);

    if (!trace) return;

    const step = {
      step: stepName,
      timestamp: Date.now(),
      data
    };

    trace.steps.push(step);

    this._log("trace_step", {
      traceId,
      stepName
    });

    // real-time anomaly detection
    this._detectAnomalies(trace, step);

    return step;
  }

  /**
   * 🧠 Detect anomalies in decision flow
   */
  _detectAnomalies(trace, step) {
    // long processing step detection
    const duration = Date.now() - trace.startTime;

    if (duration > 3000) {
      this.eventBus.emit("debug.slow_trace", {
        traceId: trace.traceId,
        duration
      });
    }

    // missing critical steps detection
    const requiredSteps = [
      "middleware",
      "guard",
      "engine",
      "orchestrator"
    ];

    const executedSteps = trace.steps.map(s => s.step);

    const missing = requiredSteps.filter(
      s => !executedSteps.includes(s)
    );

    if (missing.length > 0) {
      this.eventBus.emit("debug.incomplete_trace", {
        traceId: trace.traceId,
        missing
      });
    }
  }

  /**
   * 📊 End trace session
   */
  endTrace(traceId, result) {
    const trace = this.traces.get(traceId);

    if (!trace) return null;

    trace.endTime = Date.now();
    trace.duration = trace.endTime - trace.startTime;
    trace.result = result;

    this._log("trace_end", {
      traceId,
      duration: trace.duration
    });

    // emit for analytics / AI learning
    this.eventBus.emit("debug.trace_completed", trace);

    return trace;
  }

  /**
   * 🔍 Get trace by id
   */
  getTrace(traceId) {
    return this.traces.get(traceId);
  }

  /**
   * 📦 Get recent traces
   */
  getRecent(limit = 20) {
    return Array.from(this.traces.values()).slice(-limit);
  }

  /**
   * 🧹 Clear traces (memory control)
   */
  clear() {
    this.traces.clear();
  }

  /**
   * 📡 Internal logging
   */
  _log(type, payload) {
    if (this.logger) {
      this.logger.info("debug_trace", {
        type,
        payload,
        timestamp: Date.now()
      });
    }
  }
}

module.exports = VideoTutorDebugTracer;
