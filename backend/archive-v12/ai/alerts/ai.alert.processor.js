
const Bus = require("./ai.alert.bus");
const Notifications = require("../approval/ai.approval.notifications");

/**
 * ========================
 * ⚙️ AI ALERT PROCESSOR
 * UniMentorAI SaaS Observability Layer
 * ========================
 * Consumes alerts from event bus and dispatches them to channels
 */

class AlertProcessor {

  constructor() {

    /**
     * ========================
     * 🔗 AUTO-SUBSCRIBE TO BUS
     * ========================
     */
    Bus.subscribe(this.handle.bind(this));

    /**
     * ========================
     * 📊 INTERNAL METRICS
     * ========================
     */
    this.stats = {
      total: 0,
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    };
  }

  /**
   * ========================
   * 🚨 MAIN HANDLER
   * ========================
   */
  handle(alert) {

    if (!alert) return;

    // 📊 update internal metrics
    this.updateStats(alert);

    // 🖥️ console output (dev / debug)
    this.logToConsole(alert);

    // 🔔 send notification (reuse approval notification system)
    Notifications.send({
      type: this.mapType(alert.severity),
      title: `AI ALERT - ${alert.type}`,
      message: alert.message,
      action: alert.type,
      priority: alert.severity
    });

    // ⚡ future extension points
    this.dispatchToWebSocket(alert);
    this.dispatchToWebhook(alert);
    this.dispatchToAnalytics(alert);
  }

  /**
   * ========================
   * 🖥️ CONSOLE LOGGER
   * ========================
   */
  logToConsole(alert) {

    const icon = this.getIcon(alert.severity);

    console.log(`
${icon} REAL-TIME ALERT
-------------------------
Type     : ${alert.type}
Severity : ${alert.severity}
Message  : ${alert.message}
Source   : ${alert.source}
Time     : ${alert.timestamp}
-------------------------
    `);
  }

  /**
   * ========================
   * 📊 UPDATE INTERNAL STATS
   * ========================
   */
  updateStats(alert) {

    this.stats.total++;

    if (this.stats[alert.severity] !== undefined) {
      this.stats[alert.severity]++;
    }
  }

  /**
   * ========================
   * ⚡ SOCKET DISPATCH (FUTURE)
   * ========================
   */
  dispatchToWebSocket(alert) {
    // TODO: integrate socket.io
  }

  /**
   * ========================
   * 🌐 WEBHOOK DISPATCH (FUTURE)
   * ========================
   */
  dispatchToWebhook(alert) {
    // TODO: external integrations (Slack, Zapier, etc.)
  }

  /**
   * ========================
   * 📈 ANALYTICS PIPELINE
   * ========================
   */
  dispatchToAnalytics(alert) {
    // TODO: send to revenue / AI analytics system
  }

  /**
   * ========================
   * 🎯 SEVERITY → NOTIFICATION TYPE
   * ========================
   */
  mapType(severity) {

    const map = {
      low: "info",
      medium: "warning",
      high: "warning",
      critical: "critical"
    };

    return map[severity] || "info";
  }

  /**
   * ========================
   * 🎨 ICON MAPPING
   * ========================
   */
  getIcon(severity) {

    const icons = {
      low: "🟢",
      medium: "🟡",
      high: "🟠",
      critical: "🔴"
    };

    return icons[severity] || "⚪";
  }

  /**
   * ========================
   * 📊 GET SYSTEM STATS
   * ========================
   */
  getStats() {
    return this.stats;
  }

  /**
   * ========================
   * 🧠 HEALTH CHECK
   * ========================
   */
  health() {

    return {
      status: "operational",
      stats: this.stats,
      timestamp: new Date()
    };
  }
}

module.exports = new AlertProcessor();
