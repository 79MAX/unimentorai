/**
 * VIDEO TUTOR TELEMETRY COLLECTOR - UniMentorAI
 * Real-time system observability and AI performance tracking
 */

class VideoTutorTelemetryCollector {
  constructor({ logger, eventBus }) {
    this.logger = logger;
    this.eventBus = eventBus;

    // in-memory buffer (swap with ELK / Datadog / Prometheus in prod)
    this.buffer = [];
  }

  /**
   * 🎯 Main telemetry ingestion
   */
  collect(event) {
    try {
      const enrichedEvent = this._enrich(event);

      this.buffer.push(enrichedEvent);

      this._log(enrichedEvent);

      this._forward(enrichedEvent);

      this._analyzeRealtime(enrichedEvent);

      return true;

    } catch (error) {
      this.logger.error("Telemetry collection error", error);
      return false;
    }
  }

  /**
   * 🧠 Enrich telemetry data
   */
  _enrich(event) {
    return {
      ...event,
      timestamp: Date.now(),

      system: {
        memoryUsage: process.memoryUsage?.() || null,
        cpuLoad: null // placeholder for future system metrics
      }
    };
  }

  /**
   * 📊 Lightweight logging
   */
  _log(event) {
    if (!this.logger) return;

    this.logger.info("telemetry_event", {
      type: event.type,
      userId: event.userId,
      timestamp: event.timestamp
    });
  }

  /**
   * 📡 Forward to event bus (decoupled architecture)
   */
  _forward(event) {
    if (this.eventBus) {
      this.eventBus.emit("telemetry.event", event);
    }
  }

  /**
   * 🧠 Real-time analysis for critical signals
   */
  _analyzeRealtime(event) {
    // detect anomalies
    if (event.latency > 2000) {
      this.eventBus.emit("system.performance_warning", {
        type: "high_latency",
        value: event.latency,
        userId: event.userId
      });
    }

    if (event.error) {
      this.eventBus.emit("system.error_detected", {
        error: event.error,
        context: event.context
      });
    }

    if (event.engagementDrop && event.engagementDrop > 50) {
      this.eventBus.emit("behavior.engagement_drop", {
        userId: event.userId,
        drop: event.engagementDrop
      });
    }
  }

  /**
   * 📦 Get telemetry batch
   */
  getBatch(limit = 100) {
    return this.buffer.slice(-limit);
  }

  /**
   * 📊 Clear buffer (memory control)
   */
  flush() {
    const data = [...this.buffer];
    this.buffer = [];
    return data;
  }

  /**
   * 🧠 Compute basic system health
   */
  getHealth() {
    const errors = this.buffer.filter(e => e.error).length;
    const total = this.buffer.length;

    return {
      totalEvents: total,
      errorRate: total ? errors / total : 0,
      status: errors > total * 0.1 ? "degraded" : "healthy"
    };
  }
}

module.exports = VideoTutorTelemetryCollector;
