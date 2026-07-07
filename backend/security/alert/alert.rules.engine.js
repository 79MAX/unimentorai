 /**
 * ==================================================
 * ALERT RULES ENGINE V2
 * UniMentorAI Security Decision Layer
 * ==================================================
 */

/**
 * 🎯 MAIN RULE EVALUATION
 */
export function processAlertRules(event) {
  const score = event.score || 0;
  const level = event.level || "LOW";
  const type = event.type || "";

  /**
   * DEFAULT DECISION
   */
  const decision = {
    notify: false,
    action: null,
    severity: "LOW",
  };

  /**
   * ==========================
   * RULE SET (PRIORITY ORDER)
   * ==========================
   */

  // 🚨 CRITICAL THREAT
  if (isCritical(event, score, level)) {
    return {
      notify: true,
      action: "BLOCK_USER",
      severity: "CRITICAL",
    };
  }

  // ⚠️ HIGH RISK BEHAVIOR
  if (isHighRisk(event, score, level)) {
    return {
      notify: true,
      action: "RESTRICT_USER",
      severity: "HIGH",
    };
  }

  // 👁️ ATTACK DETECTION
  if (isAttack(event)) {
    return {
      notify: true,
      action: "MONITOR_USER",
      severity: "HIGH",
    };
  }

  // 🟡 MEDIUM RISK
  if (isMediumRisk(level, score)) {
    return {
      notify: false,
      action: "LOG_ONLY",
      severity: "MEDIUM",
    };
  }

  // 🟢 LOW RISK (DEFAULT)
  return decision;
}

/**
 * ==========================
 * RULE FUNCTIONS (CLEAN + EXTENSIBLE)
 * ==========================
 */

function isCritical(event, score, level) {
  return (
    level === "CRITICAL" ||
    score >= 90 ||
    event.failedAttempts >= 10 ||
    event.suspiciousBehavior === true
  );
}

function isHighRisk(event, score, level) {
  return (
    level === "HIGH" ||
    score >= 70 ||
    event.failedAttempts >= 5 ||
    event.ipReputation === "BAD"
  );
}

function isAttack(event) {
  return (
    event.type === "security:attack:detected" ||
    event.bruteforce === true ||
    event.rateLimitExceeded === true
  );
}

function isMediumRisk(level, score) {
  return level === "MEDIUM" || (score >= 40 && score < 70);
}
