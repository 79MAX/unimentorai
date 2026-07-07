
const crypto = require("crypto");

/**
 * ========================
 * 🔐 AI APPROVAL QUEUE ENGINE
 * UniMentorAI SaaS Governance Layer
 * ========================
 * Stores and manages AI actions requiring human approval
 */

class ApprovalQueue {

  constructor() {

    /**
     * ========================
     * 📦 IN-MEMORY STORE (MVP)
     * ========================
     * Upgrade ready → MongoDB / Redis
     */
    this.queue = [];
  }

  /**
   * ========================
   * ➕ CREATE APPROVAL REQUEST
   * ========================
   */
  create(action, metadata = {}) {

    const item = {
      id: crypto.randomUUID(),
      action,

      status: "pending", // pending | approved | rejected | executed

      priority: metadata.priority || "normal", // low | normal | high | critical

      riskLevel: metadata.riskLevel || "medium", // low | medium | high

      userId: metadata.userId || null,

      source: metadata.source || "ai_agent",

      createdAt: new Date(),

      updatedAt: new Date()
    };

    this.queue.push(item);

    return item;
  }

  /**
   * ========================
   * 📋 GET ALL ITEMS
   * ========================
   */
  getAll() {
    return this.queue;
  }

  /**
   * ========================
   * ⏳ GET PENDING ONLY
   * ========================
   */
  getPending() {
    return this.queue.filter(item => item.status === "pending");
  }

  /**
   * ========================
   * 🔎 FIND ITEM BY ID
   * ========================
   */
  findById(id) {
    return this.queue.find(item => item.id === id);
  }

  /**
   * ========================
   * ✅ APPROVE ACTION
   * ========================
   */
  approve(id, approvedBy = "admin") {

    const item = this.findById(id);

    if (!item) return null;

    item.status = "approved";
    item.approvedBy = approvedBy;
    item.updatedAt = new Date();

    return item;
  }

  /**
   * ========================
   * ❌ REJECT ACTION
   * ========================
   */
  reject(id, rejectedBy = "admin", reason = null) {

    const item = this.findById(id);

    if (!item) return null;

    item.status = "rejected";
    item.rejectedBy = rejectedBy;
    item.reason = reason;
    item.updatedAt = new Date();

    return item;
  }

  /**
   * ========================
   * ⚡ MARK AS EXECUTED
   * ========================
   */
  markExecuted(id, result = null) {

    const item = this.findById(id);

    if (!item) return null;

    item.status = "executed";
    item.result = result;
    item.executedAt = new Date();

    return item;
  }

  /**
   * ========================
   * 📊 QUEUE STATISTICS
   * ========================
   */
  getStats() {

    return {
      total: this.queue.length,
      pending: this.queue.filter(i => i.status === "pending").length,
      approved: this.queue.filter(i => i.status === "approved").length,
      rejected: this.queue.filter(i => i.status === "rejected").length,
      executed: this.queue.filter(i => i.status === "executed").length
    };
  }

  /**
   * ========================
   * 🧹 CLEAN OLD ITEMS
   * ========================
   */
  clean(days = 7) {

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    this.queue = this.queue.filter(item => {
      return item.createdAt > cutoff;
    });

    return this.queue;
  }
}

module.exports = new ApprovalQueue();
