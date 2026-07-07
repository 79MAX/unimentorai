/**
 * ==========================================
 * 🧠 AI FAILURE CLASSIFIER
 * UniMentorAI Self-Healing Layer
 * ==========================================
 */

class FailureClassifier {

  /**
   * ==========================================
   * MAIN CLASSIFICATION ENGINE
   * ==========================================
   */
  classify(data = {}) {

    const rootCause = data.rootCause || {};
    const issues = this.extractIssues(data);

    const category =
      this.determineCategory(
        rootCause.primary
      );

    const impact =
      this.computeImpact(
        issues,
        category
      );

    const priority =
      this.computePriority(
        impact,
        rootCause.confidence || 0
      );

    return {
      category,
      impact,
      priority,

      confidence:
        rootCause.confidence || 0,

      recoveryTier:
        this.getRecoveryTier(
          priority
        ),

      requiresHumanReview:
        this.requiresHumanReview(
          category,
          priority
        ),

      timestamp: new Date()
    };
  }

  /**
   * ==========================================
   * ISSUE EXTRACTION
   * ==========================================
   */
  extractIssues(data) {

    const issues = [];

    if (data.health?.status !== "healthy") {
      issues.push("health");
    }

    if (data.errors?.count > 0) {
      issues.push("errors");
    }

    if (data.bottlenecks?.detected) {
      issues.push("performance");
    }

    return issues;
  }

  /**
   * ==========================================
   * FAILURE CATEGORY
   * ==========================================
   */
  determineCategory(cause) {

    const mapping = {

      DATABASE_RESOURCE_EXHAUSTION:
        "database",

      MEMORY_LEAK_OR_PRESSURE:
        "memory",

      CPU_RESOURCE_EXHAUSTION:
        "infrastructure",

      API_PERFORMANCE_DEGRADATION:
        "application",

      EXTERNAL_DEPENDENCY_FAILURE:
        "dependency",

      NETWORK_FAILURE:
        "network",

      SECURITY_THREAT:
        "security"
    };

    return (
      mapping[cause] ||
      "unknown"
    );
  }

  /**
   * ==========================================
   * IMPACT ANALYSIS
   * ==========================================
   */
  computeImpact(
    issues,
    category
  ) {

    let score = 0;

    score += issues.length * 20;

    switch (category) {

      case "database":
        score += 35;
        break;

      case "security":
        score += 50;
        break;

      case "dependency":
        score += 25;
        break;

      case "memory":
        score += 30;
        break;

      case "network":
        score += 30;
        break;

      case "application":
        score += 20;
        break;

      default:
        score += 10;
    }

    return Math.min(score, 100);
  }

  /**
   * ==========================================
   * PRIORITY ENGINE
   * ==========================================
   */
  computePriority(
    impact,
    confidence
  ) {

    const weighted =
      impact * confidence;

    if (weighted >= 80) {
      return "critical";
    }

    if (weighted >= 60) {
      return "high";
    }

    if (weighted >= 30) {
      return "medium";
    }

    return "low";
  }

  /**
   * ==========================================
   * RECOVERY TIERS
   * ==========================================
   */
  getRecoveryTier(priority) {

    switch (priority) {

      case "critical":
        return "AUTO_HEAL_IMMEDIATE";

      case "high":
        return "AUTO_HEAL_PRIORITY";

      case "medium":
        return "AUTO_HEAL_STANDARD";

      default:
        return "MONITOR_ONLY";
    }
  }

  /**
   * ==========================================
   * HUMAN REVIEW DECISION
   * ==========================================
   */
  requiresHumanReview(
    category,
    priority
  ) {

    if (
      category === "security"
    ) {
      return true;
    }

    if (
      priority === "critical"
    ) {
      return true;
    }

    return false;
  }
}

module.exports =
  new FailureClassifier();
