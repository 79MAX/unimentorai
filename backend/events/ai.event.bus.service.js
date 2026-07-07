const AIMetricsService = require("./ai.metrics.service");

/**
 * AI EVENT BUS SERVICE - UniMentorAI
 * Event-driven backbone for all AI modules
 * Role: Decouple agents, enable async AI ecosystem
 */

class AIEventBusService {

  constructor() {

    // 🧠 In-memory event registry (replace with Kafka / RabbitMQ in prod)
    this.events = new Map(); // eventName → [handlers]

    this.metrics = AIMetricsService;
  }

  /**
   * 📡 REGISTER EVENT HANDLER
   */
  on(eventName, handler) {

    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }

    this.events.get(eventName).push(handler);
  }

  /**
   * 🚀 EMIT EVENT (CORE FUNCTION)
   */
  async emit(eventName, payload = {}) {

    const startTime = Date.now();

    const handlers = this.events.get(eventName) || [];

    if (handlers.length === 0) {
      return false;
    }

    const results = [];

    for (const handler of handlers) {

      try {

        const result = await handler(payload);

        results.push({
          success: true,
          result,
        });

      } catch (error) {

        results.push({
          success: false,
          error: error.message,
        });

        await this.metrics.logInteraction({
          userId: payload.userId || "system",
          prompt: eventName,
          response: null,
          type: "event_bus",
          success: false,
          errorMessage: error.message,
          latencyMs: Date.now() - startTime,
        });
      }
    }

    // ========================
    // METRICS LOGGING
    // ========================
    await this.metrics.logInteraction({
      userId: payload.userId || "system",
      prompt: eventName,
      response: JSON.stringify(results),
      type: "event_bus",
      success: true,
      latencyMs: Date.now() - startTime,
    });

    return results;
  }

  /**
   * ⚡ ASYNC EMIT (FIRE AND FORGET)
   */
  emitAsync(eventName, payload = {}) {

    setImmediate(() => {
      this.emit(eventName, payload);
    });
  }

  /**
   * 📊 GET REGISTERED EVENTS
   */
  getEvents() {
    return Array.from(this.events.keys());
  }

  /**
   * 🧠 CLEAR EVENT HANDLERS
   */
  clear(eventName) {
    this.events.delete(eventName);
  }

  /**
   * 🔁 GLOBAL EVENT BROADCAST
   */
  async broadcast(payload) {

    const allEvents = this.getEvents();

    const results = [];

    for (const event of allEvents) {
      results.push(await this.emit(event, payload));
    }

    return results;
  }

  /**
   * 📈 EVENT ANALYTICS
   */
  async getStats() {

    return {
      totalEvents: this.events.size,
      eventNames: this.getEvents(),
    };
  }
}

module.exports = new AIEventBusService();
