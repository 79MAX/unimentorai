
/**
 * ========================
 * 📜 AI ALERT RULES ENGINE
 * UniMentorAI SaaS Observability Layer
 * ========================
 * Converts raw system events into severity-based intelligence alerts
 */

class AlertRules {

  constructor() {

    /**
     * ========================
     * 📊 STATIC RULE SET
     * ========================
     */
    this.rules = {
      // 🔴 CRITICAL SYSTEM EVENTS
      system_failure: "critical",
      database_error: "critical",
      auth_breach: "critical",

      // 🟠 HIGH BUSINESS EVENTS
      revenue_drop: "high",
      payment_failure: "high",
      approval_blocked: "high",

      // 🟡 MEDIUM PERFORMANCE EVENTS
      slow_response: "medium",
      high_latency: "medium",
      high_memory_usage: "medium",

      // 🟢 LOW / INFO EVENTS
      user_login: "low",
      page_view: "low",
      api_call: "low"
    };
  }

  /**
   * ========================
   * ⚖️ MAIN EVALUATION ENGINE
   * ========================
   */
  evaluate(event = {}) {

    if (!event || !event.type) {
      return "low";
    }

    /**
     * ========================
     * 📌 DIRECT MATCH RULE
     * ========================
     */
    if (this.rules[event.type]) {
      return this.rules[event.type];
    }

    /**
     * ========================
     * 🧠 DYNAMIC INTELLIGENCE RULES
     * ========================
     * AI-like heuristic scoring
     */

    return this.dynamicEvaluation(event);
  }

  /**
   * ========================
   * 🧠 DYNAMIC RULE ENGINE
   * ========================
   */
  dynamicEvaluation(event) {

    let score = 0;

    // 🚨 ERROR INDICATORS
    if (event.error === true) score += 3;
    if (event.status === "failed") score += 2;

    // ⚡ PERFORMANCE IMPACT
    if (event.latency > 2000) score += 2;
    if (event.latency > 5000) score += 3;

    // 💰 BUSINESS IMPACT
    if (event.revenueImpact === true) score += 3;
    if (event.paymentRelated === true) score += 2;

    // 🔐 SECURITY SIGNALS
    if (event.securityFlag === true) score += 4;

    // 👤 USER IMPACT
    if (event.affectedUsers > 100) score += 2;
    if (event.affectedUsers > 1000) score += 3;

    /**
     * ========================
     * 📊 FINAL SEVERITY MAPPING
     * ========================
     */

    if (score >= 7) return "critical";
    if (score >= 5) return "high";
    if (score >= 3) return "medium";
    return "low";
  }

  /**
   * ========================
   * ➕ ADD CUSTOM RULE
   * ========================
   */
  addRule(type, severity) {

    const allowed = ["low", "medium", "high", "critical"];

    if (!allowed.includes(severity)) {
      throw new Error("Invalid severity level");
    }

    this.rules[type] = severity;
  }

  /**
   * ========================
   * 🔍 CHECK SEVERITY HELPERS
   * ========================
   */
  isCritical(event) {
    return this.evaluate(event) === "critical";
  }

  isHigh(event) {
    return this.evaluate(event) === "high";
  }

  isMedium(event) {
    return this.evaluate(event) === "medium";
  }

  isLow(event) {
    return this.evaluate(event) === "low";
  }

  /**
   * ========================
   * 📊 RULE INSIGHTS
   * ========================
   */
  getRules() {
    return this.rules;
  }

  /**
   * ========================
   * 🧠 HEALTH CHECK
   * ========================
   */
  health() {

    return {
      status: "operational",
      rulesCount: Object.keys(this.rules).length,
      timestamp: new Date()
    };
  }
}

module.exports = new AlertRules();
