
/**
 * ========================
 * 📜 AI APPROVAL POLICY MANAGER
 * UniMentorAI SaaS Governance Layer
 * ========================
 * Central dynamic policy engine for AI decisions
 */

class ApprovalPolicyManager {

  constructor() {

    /**
     * ========================
     * 📦 DEFAULT POLICY SET
     * ========================
     */
    this.policies = {

      // 💰 BUSINESS CRITICAL OPERATIONS
      optimize_pricing: {
        level: "human_required",
        reason: "Financial impact requires validation"
      },

      increase_marketing: {
        level: "human_required",
        reason: "Budget allocation requires approval"
      },

      scale_infrastructure: {
        level: "human_required",
        reason: "Infrastructure scaling affects cost & stability"
      },

      // 📊 SAFE OPERATIONS
      generate_report: {
        level: "auto",
        reason: "Low risk analytical operation"
      },

      forecast_revenue: {
        level: "auto",
        reason: "Read-only prediction operation"
      },

      reduce_churn: {
        level: "auto",
        reason: "Optimization recommendation only"
      },

      improve_conversion: {
        level: "auto",
        reason: "UI/UX optimization suggestion"
      },

      // ❌ HIGH RISK / BLOCKED
      delete_users: {
        level: "reject",
        reason: "Critical destructive operation"
      },

      wipe_database: {
        level: "reject",
        reason: "Irreversible system destruction risk"
      },

      // 🧠 AI SYSTEM CONTROL
      retrain_model: {
        level: "human_required",
        reason: "Model changes require validation"
      },

      change_ai_policy: {
        level: "human_required",
        reason: "Governance modification requires approval"
      }
    };
  }

  /**
   * ========================
   * 📜 GET POLICY FOR ACTION
   * ========================
   */
  getPolicy(action) {

    return this.policies[action] || {
      level: "human_required",
      reason: "Unknown action requires manual review"
    };
  }

  /**
   * ========================
   * ⚖️ EVALUATE ACTION
   * ========================
   */
  evaluate(action) {

    const policy = this.getPolicy(action);

    return {
      action,
      level: policy.level,
      reason: policy.reason
    };
  }

  /**
   * ========================
   * ➕ ADD OR UPDATE POLICY
   * ========================
   */
  setPolicy(action, level, reason = "") {

    const allowedLevels = [
      "auto",
      "human_required",
      "reject"
    ];

    if (!allowedLevels.includes(level)) {
      throw new Error("Invalid policy level");
    }

    this.policies[action] = {
      level,
      reason
    };
  }

  /**
   * ========================
   * 🧠 CHECK IF AUTO EXECUTABLE
   * ========================
   */
  isAuto(action) {
    return this.getPolicy(action).level === "auto";
  }

  /**
   * ========================
   * 🔐 CHECK IF HUMAN REQUIRED
   * ========================
   */
  requiresHuman(action) {
    return this.getPolicy(action).level === "human_required";
  }

  /**
   * ========================
   * ❌ CHECK IF BLOCKED
   * ========================
   */
  isBlocked(action) {
    return this.getPolicy(action).level === "reject";
  }

  /**
   * ========================
   * 📊 GET ALL POLICIES
   * ========================
   */
  getAllPolicies() {
    return this.policies;
  }

  /**
   * ========================
   * 🧠 POLICY SUMMARY (FOR DASHBOARD)
   * ========================
   */
  getSummary() {

    const summary = {
      auto: 0,
      human_required: 0,
      reject: 0
    };

    Object.values(this.policies).forEach(p => {
      summary[p.level]++;
    });

    return summary;
  }
}

module.exports = new ApprovalPolicyManager();
