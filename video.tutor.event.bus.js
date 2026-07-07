/**
 * VIDEO TUTOR EVENT BUS - UniMentorAI
 * Central event-driven communication system for Tutor AI
 */

class VideoTutorEventBus {
  constructor({ logger }) {
    this.logger = logger;

    // event registry
    this.events = new Map();

    // optional in-memory event queue (can be replaced by Redis/Kafka later)
    this.queue = [];
  }

  /**
   * 🎯 Subscribe to event type
   */
  on(eventType, handler) {
    if (!this.events.has(eventType)) {
      this.events.set(eventType, []);
    }

    this.events.get(eventType).push(handler);
  }

  /**
   * 🚀 Emit event
   */
  emit(eventType, payload = {}) {
    try {
      const event = {
        type: eventType,
        payload,
        timestamp: Date.now()
      };

      // store event for traceability
      this.queue.push(event);

      this._log(event);

      const handlers = this.events.get(eventType) || [];

      handlers.forEach((handler) => {
        try {
          handler(event.payload);
        } catch (err) {
          this.logger.error("Event handler error", err);
        }
      });

    } catch (error) {
      this.logger.error("EventBus emit error", error);
    }
  }

  /**
   * ⚡ Async emit (non-blocking)
   */
  async emitAsync(eventType, payload = {}) {
    const event = {
      type: eventType,
      payload,
      timestamp: Date.now()
    };

    this.queue.push(event);

    const handlers = this.events.get(eventType) || [];

    await Promise.all(
      handlers.map(async (handler) => {
        try {
          await handler(event.payload);
        } catch (err) {
          this.logger.error("Async handler error", err);
        }
      })
    );
  }

  /**
   * 📊 Internal logging for observability
   */
  _log(event) {
    // lightweight logging for analytics/debug
    if (this.logger) {
      this.logger.info("Event emitted", {
        type: event.type,
        timestamp: event.timestamp
      });
    }
  }

  /**
   * 📦 Get event history (useful for analytics/debugging)
   */
  getHistory(limit = 100) {
    return this.queue.slice(-limit);
  }

  /**
   * 🧠 Clear event buffer (optional memory management)
   */
  clear() {
    this.queue = [];
  }
}

module.exports = VideoTutorEventBus;
