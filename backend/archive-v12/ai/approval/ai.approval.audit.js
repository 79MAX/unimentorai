
 /**
  * ========================
  * 🧾 AI APPROVAL AUDIT SYSTEM
  * UniMentorAI SaaS Governance Layer
  * ========================
  * Tracks ALL AI governance decisions for compliance & debugging
  */

class ApprovalAudit {

  constructor() {

    /**
     * ========================
     * 📦 IMMUTABLE LOG STORE (MVP)
     * ========================
     * Upgrade-ready → MongoDB / Elastic / S3 logs
     */
    this.logs = [];
  }

  /**
   * ========================
   * 🧾 LOG EVENT
   * ========================
   */
  log(event) {

    const entry = {
      id: this.generateId(),

      type: event.type || "unknown", 
      // types: created | approved | rejected | executed | auto_executed

      action: event.action || null,

      status: event.status || null,

      userId: event.userId || null,

      riskLevel: event.riskLevel || "unknown",

      source: event.source || "system",

      metadata: event.metadata || {},

      timestamp: new Date()
    };

    this.logs.push(entry);

    return entry;
  }

  /**
   * ========================
   * 🔍 GET ALL LOGS
   * ========================
   */
  getAll() {
    return this.logs;
  }

  /**
   * ========================
   * 🎯 FILTER BY ACTION
   * ========================
   */
  filterByAction(action) {
    return this.logs.filter(log => log.action === action);
  }

  /**
   * ========================
   * 👤 FILTER BY USER
   * ========================
   */
  filterByUser(userId) {
    return this.logs.filter(log => log.userId === userId);
  }

  /**
   * ========================
   * ⚠️ FILTER BY RISK LEVEL
   * ========================
   */
  filterByRisk(level) {
    return this.logs.filter(log => log.riskLevel === level);
  }

  /**
   * ========================
   * 📊 GET STATISTICS
   * ========================
   */
  getStats() {

    return {
      total: this.logs.length,

      created: this.count("created"),
      approved: this.count("approved"),
      rejected: this.count("rejected"),
      executed: this.count("executed"),
      auto_executed: this.count("auto_executed")
    };
  }

  /**
   * ========================
   * 🧠 COUNT HELPER
   * ========================
   */
  count(type) {
    return this.logs.filter(log => log.type === type).length;
  }

  /**
   * ========================
   * 🆔 ID GENERATOR
   * ========================
   */
  generateId() {
    return `audit_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  }

  /**
   * ========================
   * 🧹 CLEAN OLD LOGS (OPTIONAL)
   * ========================
   */
  clean(days = 30) {

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    this.logs = this.logs.filter(log => log.timestamp > cutoff);

    return this.logs;
  }
}

module.exports = new ApprovalAudit();
