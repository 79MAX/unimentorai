
const Queue = require("./ai.approval.queue");
const Rules = require("./ai.approval.rules");

/**
 * ========================
 * 🔐 AI APPROVAL ENGINE
 * UniMentorAI SaaS Governance Layer
 * ========================
 * Decides whether an AI action:
 * - auto executes ⚡
 * - requires human approval 🔐
 * - or gets rejected ❌
 */

class ApprovalEngine {

  /**
   * ========================
   * ⚡ PROCESS ACTION
   * ========================
   */
  process(action, metadata = {}) {

    const rule = Rules.evaluate(action);

    /**
     * ========================
     * ❌ REJECTED ACTIONS
     * ========================
     */
    if (rule === "reject") {
      return {
        status: "rejected",
        action,
        reason: "Blocked by governance rules"
      };
    }

    /**
     * ========================
     * 🔐 HUMAN APPROVAL REQUIRED
     * ========================
     */
    if (rule === "human_required") {

      const queued = Queue.create(action, {
        ...metadata,
        riskLevel: "high",
        priority: "critical",
        source: "approval_engine"
      });

      return {
        status: "pending_approval",
        queued
      };
    }

    /**
     * ========================
     * ⚡ AUTO EXECUTION SAFE ACTIONS
     * ========================
     */
    return {
      status: "auto_executed",
      action,
      executedAt: new Date()
    };
  }

  /**
   * ========================
   * 🚀 BULK PROCESS (AI AGENT MODE)
   * ========================
   */
  processBatch(actions = []) {

    const results = [];

    for (const action of actions) {
      results.push(this.process(action));
    }

    return {
      total: actions.length,
      results
    };
  }

  /**
   * ========================
   * 🧠 SIMULATION MODE (DRY RUN)
   * ========================
   */
  simulate(action) {

    return {
      action,
      decision: this.process(action),
      simulated: true
    };
  }

  /**
   * ========================
   * 📊 ENGINE HEALTH CHECK
   * ========================
   */
  health() {

    const stats = Queue.getStats();

    return {
      status: "operational",
      queueStats: stats,
      timestamp: new Date()
    };
  }
}

module.exports = new ApprovalEngine();
