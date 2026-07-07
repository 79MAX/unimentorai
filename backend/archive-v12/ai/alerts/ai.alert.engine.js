
const Rules = require("./ai.alert.rules");
const Bus = require("./ai.alert.bus");

/**
 * ========================
 * 🚨 AI ALERT ENGINE
 * UniMentorAI SaaS Observability Layer
 * ========================
 * Central engine for real-time system intelligence alerts
 */

class AlertEngine {

  /**
   * ========================
   * ⚡ TRIGGER SINGLE ALERT
   * ========================
   */
  trigger(event = {}) {

    const severity = Rules.evaluate(event);

    const alert = this.buildAlert(event, severity);

    // 📡 publish to event bus
    Bus.publish(alert);

    return alert;
  }

  /**
   * ========================
   * ⚡ TRIGGER MULTIPLE ALERTS
   * ========================
   */
  triggerBatch(events = []) {

    if (!Array.isArray(events)) {
      throw new Error("Events must be an array");
    }

    return events.map(event => this.trigger(event));
  }

  /**
   * ========================
   * 🧠 BUILD ALERT OBJECT
   * ========================
   */
  buildAlert(event, severity) {

    return {
      id: this.generateId(),

      type: event.type || "unknown",

      message: event.message || "No message provided",

      severity, // low | medium | high | critical

      source: event.source || "system",

      context: {
        userId: event.userId || null,
        action: event.action || null,
        module: event.module || "core"
      },

      metadata: event.metadata || {},

      timestamp: new Date()
    };
  }

  /**
   * ========================
   * 🧪 SIMULATION MODE
   * ========================
   */
  simulate(event = {}) {

    return {
      simulated: true,
      result: this.trigger(event)
    };
  }

  /**
   * ========================
   * 🆔 UNIQUE ID GENERATOR
   * ========================
   */
  generateId() {
    return `alert_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  }

  /**
   * ========================
   * 📊 HEALTH CHECK
   * ========================
   */
  health() {

    return {
      status: "operational",
      timestamp: new Date(),
      busConnected: !!Bus
    };
  }
}

module.exports = new AlertEngine();
