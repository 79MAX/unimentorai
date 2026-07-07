const AIMetricsService = require("./ai.metrics.service");
const crypto = require("crypto");

/**
 * AI EVENT BUS SERVICE - UniMentorAI
 * Production-grade event-driven backbone
 * Supports: async events, retries, middleware, observability
 */

class AIEventBusService {

  constructor() {

    this.handlers = new Map();     // event -> handlers[]
    this.middlewares = [];         // global event middleware chain
    this.eventHistory = [];        // audit log (last N events)

    this.metrics = AIMetricsService;

    this.maxHistory = 500;
  }

  /**
   * ========================
   * 🧠 REGISTER HANDLER
   * ========================
   */
  on(eventName, handler) {

    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, []);
    }

    this.handlers.get(eventName).push({
      id: this.generateId(),
      fn: handler,
    });
  }

  /**
   * ========================
   * ⚡ GLOBAL MIDDLEWARE
   * ========================
   */
  use(middlewareFn) {
    this.middlewares.push(middlewareFn);
  }

  /**
   * ========================
   * 🚀 EMIT EVENT (CORE ENGINE)
   * ========================
   */
  async emit(eventName, payload = {}, options = {}) {

    const eventId = this.generateId();
    const startTime = Date.now();

    let eventContext = {
      id: eventId,
      name: eventName,
      payload,
      timestamp: startTime,
    };

    try {

      // ========================
      // 1. RUN MIDDLEWARE CHAIN
      // ========================
      for (const mw of this.middlewares) {
        eventContext = await mw(eventContext) || eventContext;
      }

      // ========================
      // 2. GET HANDLERS
      // ========================
      const handlers = this.handlers.get(eventName) || [];

      if (handlers.length === 0) {
        return { success: true, message: "No handlers registered" };
      }

      const results = [];

      // ========================
      // 3. EXECUTE HANDLERS (PARALLEL SAFE)
      // ========================
      for (const handler of handlers) {

        try {

          const result = await Promise.race([
            handler.fn(eventContext),
            this.timeout(options.timeout || 5000),
          ]);

          results.push({
            handlerId: handler.id,
            success: true,
            result,
          });

        } catch (error) {

          results.push({
            handlerId: handler.id,
            success: false,
            error: error.message,
          });

          // retry policy hook
          if (options.retry) {
            await this.retry(handler.fn, eventContext, options.retry);
          }
        }
      }

      // ========================
      // 4. METRICS LOGGING
      // ========================
      await this.metrics.logInteraction({
        userId: payload.userId || "system",
        prompt: eventName,
        response: JSON.stringify(results),
        type: "event_bus",
        latencyMs: Date.now() - startTime,
        success: true,
      });

      // ========================
      // 5. EVENT HISTORY STORE
      // ========================
      this.storeHistory(eventContext, results);

      return {
        success: true,
        eventId,
        results,
      };

    } catch (error) {

      await this.metrics.logInteraction({
        userId: payload.userId || "system",
        prompt: eventName,
        response: null,
        type: "event_bus",
        success: false,
        errorMessage: error.message,
      });

      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * ========================
   * 🔁 RETRY MECHANISM
   * ========================
   */
  async retry(fn, context, retries = 2) {

    for (let i = 0; i < retries; i++) {
      try {
        return await fn(context);
      } catch (e) {
        if (i === retries - 1) throw e;
      }
    }
  }

  /**
   * ========================
   * ⏱ TIMEOUT WRAPPER
   * ========================
   */
  timeout(ms) {
    return new Promise((_, reject) =>
      setTimeout(() => reject(new Error("EVENT_TIMEOUT")), ms)
    );
  }

  /**
   * ========================
   * 📡 ASYNC FIRE (NON-BLOCKING)
   * ========================
   */
  emitAsync(eventName, payload = {}) {
    setImmediate(() => this.emit(eventName, payload));
  }

  /**
   * ========================
   * 🧠 HISTORY STORE
   * ========================
   */
  storeHistory(event, results) {

    this.eventHistory.push({
      event,
      results,
      timestamp: Date.now(),
    });

    if (this.eventHistory.length > this.maxHistory) {
      this.eventHistory.shift();
    }
  }

  /**
   * ========================
   * 📊 ANALYTICS
   * ========================
   */
  getStats() {

    return {
      totalEvents: this.handlers.size,
      historySize: this.eventHistory.length,
      events: Array.from(this.handlers.keys()),
    };
  }

  /**
   * ========================
   * 🔐 ID GENERATOR
   * ========================
   */
  generateId() {
    return crypto.randomBytes(6).toString("hex");
  }
}

module.exports = new AIEventBusService();
