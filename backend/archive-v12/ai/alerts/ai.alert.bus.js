
 /**
  * ========================
  * 📡 AI ALERT EVENT BUS
  * UniMentorAI SaaS Observability Layer
  * ========================
  * Central pub/sub system for real-time AI alerts
  */

class AlertBus {

  constructor() {

    /**
     * ========================
     * 👥 SUBSCRIBERS REGISTRY
     * ========================
     */
    this.subscribers = [];

    /**
     * ========================
     * 📦 EVENT BUFFER (OPTIONAL)
     * ========================
     * Useful for debugging / replay / future persistence
     */
    this.eventBuffer = [];
  }

  /**
   * ========================
   * ➕ SUBSCRIBE TO ALERTS
   * ========================
   */
  subscribe(callback, options = {}) {

    if (typeof callback !== "function") {
      throw new Error("Subscriber must be a function");
    }

    const subscriber = {
      id: this.generateId(),
      callback,
      active: true,
      createdAt: new Date(),
      filter: options.filter || null
    };

    this.subscribers.push(subscriber);

    return subscriber.id;
  }

  /**
   * ========================
   * ❌ UNSUBSCRIBE
   * ========================
   */
  unsubscribe(id) {

    this.subscribers = this.subscribers.filter(
      sub => sub.id !== id
    );
  }

  /**
   * ========================
   * 📢 PUBLISH EVENT
   * ========================
   */
  publish(event) {

    if (!event) return;

    // 💾 store event in buffer
    this.eventBuffer.push({
      ...event,
      receivedAt: new Date()
    });

    // 🚀 broadcast to subscribers
    for (const sub of this.subscribers) {

      try {

        if (!sub.active) continue;

        // 🎯 optional filter logic
        if (sub.filter && !this.matchFilter(event, sub.filter)) {
          continue;
        }

        sub.callback(event);

      } catch (err) {
        console.error("AlertBus subscriber error:", err);
      }
    }
  }

  /**
   * ========================
   * 🎯 FILTER MATCHER
   * ========================
   */
  matchFilter(event, filter) {

    if (filter.type && event.type !== filter.type) {
      return false;
    }

    if (filter.severity && event.severity !== filter.severity) {
      return false;
    }

    return true;
  }

  /**
   * ========================
   * 📊 GET ALL EVENTS (DEBUG)
   * ========================
   */
  getEvents() {
    return this.eventBuffer;
  }

  /**
   * ========================
   * 🧹 CLEAR BUFFER
   * ========================
   */
  clear() {
    this.eventBuffer = [];
  }

  /**
   * ========================
   * 🔄 RESET BUS
   * ========================
   */
  reset() {
    this.subscribers = [];
    this.eventBuffer = [];
  }

  /**
   * ========================
   * 🆔 ID GENERATOR
   * ========================
   */
  generateId() {
    return `sub_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  }

  /**
   * ========================
   * 📈 HEALTH CHECK
   * ========================
   */
  health() {

    return {
      status: "operational",
      subscribers: this.subscribers.length,
      bufferedEvents: this.eventBuffer.length,
      timestamp: new Date()
    };
  }
}

module.exports = new AlertBus();
