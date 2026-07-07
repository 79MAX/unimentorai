
 /**
  * ========================
  * 📜 AI APPROVAL RULES ENGINE
  * UniMentorAI SaaS Governance Layer
  * ========================
  * Defines execution policy for AI actions
  */

class ApprovalRules {

  constructor() {

    /**
     * ========================
     * 🔐 RULE REGISTRY
     * ========================
     */
    this.rules = {

      // ⚙️ INFRASTRUCTURE
      scale_infrastructure: "human_required",

      // 💰 BUSINESS CRITICAL
      optimize_pricing: "human_required",
      increase_marketing: "human_required",

      // 📉 RISK MITIGATION
      reduce_churn: "auto",
      improve_conversion: "auto",

      // 📊 ANALYTICS SAFE ACTIONS
      generate_report: "auto",
      forecast_revenue: "auto",

      // ❌ DANGEROUS ACTIONS
      delete_users: "reject",
      wipe_database: "reject",

      // 🧠 AI SYSTEM ACTIONS
      retrain_model: "human_required",
      change_ai_policy: "human_required"
    };
  }

  /**
   * ========================
   * 🧠 EVALUATE ACTION RULE
   * ========================
   */
  evaluate(action) {

    /**
     * ========================
     * ⚡ DEFAULT SAFE FALLBACK
     * ========================
     */
    if (!action) {
      return "reject";
    }

    /**
     * ========================
     * 📜 DIRECT RULE MATCH
     * ========================
     */
    if (this.rules[action]) {
      return this.rules[action];
    }

    /**
     * ========================
     * ⚠️ UNKNOWN ACTIONS POLICY
     * ========================
     * Default = require human validation
     */
    return "human_required";
  }

  /**
   * ========================
   * ➕ ADD NEW RULE (DYNAMIC EXTENSION)
   * ========================
   */
  addRule(action, policy) {

    const allowedPolicies = [
      "auto",
      "human_required",
      "reject"
    ];

    if (!allowedPolicies.includes(policy)) {
      throw new Error("Invalid policy type");
    }

    this.rules[action] = policy;
  }

  /**
   * ========================
   * 📊 GET ALL RULES
   * ========================
   */
  getAllRules() {
    return this.rules;
  }

  /**
   * ========================
   * 🔍 CHECK IF SAFE ACTION
   * ========================
   */
  isSafe(action) {
    return this.evaluate(action) === "auto";
  }

  /**
   * ========================
   * 🔐 CHECK IF REQUIRES HUMAN
   * ========================
   */
  requiresHuman(action) {
    return this.evaluate(action) === "human_required";
  }

  /**
   * ========================
   * ❌ CHECK IF BLOCKED
   * ========================
   */
  isBlocked(action) {
    return this.evaluate(action) === "reject";
  }
}

module.exports = new ApprovalRules();
