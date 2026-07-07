
/**
 * ========================
 * ⚖️ FRAUD RULES ENGINE
 * UniMentorAI SaaS Intelligence Layer
 * ========================
 * Rule-based fraud detection layer (deterministic safety net)
 */

class FraudRules {

  /**
   * ========================
   * 🚀 MAIN RULE EVALUATION
   * ========================
   */
  evaluate(signals = {}) {

    const violations = [];

    // 💰 TRANSACTION RULES
    const tx = signals.transactionSignals || {};
    violations.push(...this.transactionRules(tx));

    // 👤 BEHAVIOR RULES
    const behavior = signals.behaviorSignals || {};
    violations.push(...this.behaviorRules(behavior));

    // 👤 USER RULES
    const users = signals.userSignals || {};
    violations.push(...this.userRules(users));

    // ⚡ VELOCITY RULES
    const velocity = signals.velocitySignals || {};
    violations.push(...this.velocityRules(velocity));

    return {
      violations,
      count: violations.length,
      severity: this.computeSeverity(violations)
    };
  }

  /**
   * ========================
   * 💰 TRANSACTION RULES
   * ========================
   */
  transactionRules(tx) {

    const violations = [];

    if (tx.failureRate > 0.5) {
      violations.push({
        type: "HIGH_FAILURE_RATE",
        severity: "high",
        message: "Transaction failure rate too high"
      });
    }

    if (tx.highValueRatio > 0.7) {
      violations.push({
        type: "UNUSUAL_HIGH_VALUE_RATIO",
        severity: "medium",
        message: "Too many high-value transactions"
      });
    }

    if (tx.avgAmount > 5000) {
      violations.push({
        type: "EXTREME_AVERAGE_TRANSACTION",
        severity: "high",
        message: "Abnormally high average transaction amount"
      });
    }

    return violations;
  }

  /**
   * ========================
   * 👤 BEHAVIOR RULES
   * ========================
   */
  behaviorRules(behavior) {

    const violations = [];

    if (behavior.suspiciousLoginRate > 0.3) {
      violations.push({
        type: "SUSPICIOUS_LOGIN_ACTIVITY",
        severity: "high",
        message: "High rate of suspicious login attempts"
      });
    }

    if (behavior.loginEvents > 1000) {
      violations.push({
        type: "LOGIN_ABUSE",
        severity: "medium",
        message: "Excessive login activity detected"
      });
    }

    return violations;
  }

  /**
   * ========================
   * 👤 USER RULES
   * ========================
   */
  userRules(users) {

    const violations = [];

    if (users.incompleteProfilesRate > 0.6) {
      violations.push({
        type: "LOW_QUALITY_USER_BASE",
        severity: "medium",
        message: "High percentage of incomplete user profiles"
      });
    }

    if (users.newUsers > 500) {
      violations.push({
        type: "UNUSUAL_USER_SPIKE",
        severity: "low",
        message: "Sudden spike in new users"
      });
    }

    return violations;
  }

  /**
   * ========================
   * ⚡ VELOCITY RULES
   * ========================
   */
  velocityRules(velocity) {

    const violations = [];

    if (velocity.rapidVelocityDetected) {
      violations.push({
        type: "VELOCITY_SPIKE",
        severity: "critical",
        message: "Rapid transaction velocity detected (possible bot activity)"
      });
    }

    if (velocity.transactionsPerMinute > 100) {
      violations.push({
        type: "HIGH_TX_RATE",
        severity: "high",
        message: "Unusual transaction frequency detected"
      });
    }

    return violations;
  }

  /**
   * ========================
   * ⚖️ SEVERITY ENGINE
   * ========================
   */
  computeSeverity(violations) {

    if (violations.some(v => v.severity === "critical")) {
      return "critical";
    }

    if (violations.some(v => v.severity === "high")) {
      return "high";
    }

    if (violations.length > 0) {
      return "medium";
    }

    return "low";
  }
}

module.exports = new FraudRules();
