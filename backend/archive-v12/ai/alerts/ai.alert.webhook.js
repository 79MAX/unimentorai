
const axios = require("axios");
const Bus = require("./ai.alert.bus");

/**
 * ========================
 * 🌐 AI ALERT WEBHOOK SYSTEM
 * UniMentorAI SaaS Observability Layer
 * ========================
 * Sends real-time alerts to external systems (Slack, Zapier, etc.)
 */

class AlertWebhook {

  constructor() {

    /**
     * ========================
     * 🔗 REGISTERED WEBHOOKS
     * ========================
     */
    this.webhooks = [];

    /**
     * ========================
     * 🔁 RETRY CONFIG
     * ========================
     */
    this.maxRetries = 3;
    this.retryDelay = 1000;

    /**
     * ========================
     * 📡 SUBSCRIBE TO EVENT BUS
     * ========================
     */
    Bus.subscribe(this.dispatch.bind(this));
  }

  /**
   * ========================
   * ➕ ADD WEBHOOK
   * ========================
   */
  addWebhook(url, options = {}) {

    if (!url) throw new Error("Webhook URL required");

    const webhook = {
      id: this.generateId(),
      url,
      enabled: true,
      filter: options.filter || null,
      createdAt: new Date()
    };

    this.webhooks.push(webhook);

    return webhook.id;
  }

  /**
   * ========================
   * ❌ REMOVE WEBHOOK
   * ========================
   */
  removeWebhook(id) {

    this.webhooks = this.webhooks.filter(w => w.id !== id);
  }

  /**
   * ========================
   * 📡 DISPATCH EVENT
   * ========================
   */
  async dispatch(alert) {

    for (const webhook of this.webhooks) {

      try {

        if (!webhook.enabled) continue;

        if (webhook.filter && !this.matchFilter(alert, webhook.filter)) {
          continue;
        }

        await this.sendWithRetry(webhook.url, alert);

      } catch (err) {
        console.error("Webhook dispatch error:", err.message);
      }
    }
  }

  /**
   * ========================
   * 🔁 SEND WITH RETRY LOGIC
   * ========================
   */
  async sendWithRetry(url, payload, attempt = 1) {

    try {

      await axios.post(url, payload, {
        timeout: 5000,
        headers: {
          "Content-Type": "application/json"
        }
      });

    } catch (error) {

      if (attempt < this.maxRetries) {

        await this.delay(this.retryDelay * attempt);

        return this.sendWithRetry(url, payload, attempt + 1);
      }

      console.error(`Webhook failed after retries: ${url}`);
    }
  }

  /**
   * ========================
   * 🎯 FILTER MATCHER
   * ========================
   */
  matchFilter(alert, filter) {

    if (filter.type && alert.type !== filter.type) {
      return false;
    }

    if (filter.severity && alert.severity !== filter.severity) {
      return false;
    }

    return true;
  }

  /**
   * ========================
   * ⏱️ DELAY UTILITY
   * ========================
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * ========================
   * 🆔 ID GENERATOR
   * ========================
   */
  generateId() {
    return `wh_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  }

  /**
   * ========================
   * 📊 STATUS
   * ========================
   */
  getStatus() {

    return {
      totalWebhooks: this.webhooks.length,
      active: this.webhooks.filter(w => w.enabled).length
    };
  }

  /**
   * ========================
   * 🧠 HEALTH CHECK
   * ========================
   */
  health() {

    return {
      status: "operational",
      webhooks: this.webhooks.length,
      timestamp: new Date()
    };
  }
}

module.exports = new AlertWebhook();
