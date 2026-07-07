 /**
 * ==================================================
 * FRAUD MODEL V2
 * UniMentorAI AI Fraud Scoring Engine
 * ==================================================
 *
 * 🎯 OUTPUT:
 * Risk Score (0 → 100)
 * + Risk breakdown (explainability for SOC/AI)
 */

/**
 * 🚀 MAIN SCORING FUNCTION
 */
export function computeFraudScore(features = {}) {
  let score = 0;

  const breakdown = {
    behavior: 0,
    security: 0,
    context: 0,
    reputation: 0,
    system: 0,
  };

  /**
   * ==========================
   * 1. BEHAVIOR SIGNALS
   * ==========================
   */
  breakdown.behavior += features.failedAttempts * 6;
  breakdown.behavior += features.requestRate * 2;
  breakdown.behavior += features.actionsPerMinute * 3;
  breakdown.behavior += features.sessionDuration < 30 ? 10 : 0;

  /**
   * ==========================
   * 2. SECURITY FLAGS
   * ==========================
   */
  breakdown.security += features.isBruteforce * 45;
  breakdown.security += features.isRateLimited * 30;
  breakdown.security += features.isSuspicious * 25;
  breakdown.security += features.isAttack * 40;

  /**
   * ==========================
   * 3. CONTEXT SIGNALS
   * ==========================
   */
  breakdown.context += features.isNightTime ? 8 : 0;
  breakdown.context += features.isWeekend ? 3 : 0;
  breakdown.context += features.geoMismatch ? 20 : 0;

  /**
   * ==========================
   * 4. REPUTATION SIGNALS
   * ==========================
   */
  breakdown.reputation += features.ipReputation * 40;
  breakdown.reputation += features.deviceTrust * 30;

  /**
   * ==========================
   * 5. SYSTEM SIGNALS
   * ==========================
   */
  breakdown.system += features.environment === "production" ? 0 : 5;

  /**
   * ==========================
   * FINAL SCORE AGGREGATION
   * ==========================
   */
  score =
    breakdown.behavior +
    breakdown.security +
    breakdown.context +
    breakdown.reputation +
    breakdown.system;

  /**
   * ==========================
   * NORMALIZATION (0–100)
   * ==========================
   */
  score = Math.min(100, Math.max(0, score));

  return {
    score: Math.round(score),
    breakdown,
    level: getRiskLevel(score),
    decision: getDecision(score),
  };
}

/**
 * ==========================
 * RISK LEVEL CLASSIFICATION
 * ==========================
 */
function getRiskLevel(score) {
  if (score >= 90) return "CRITICAL";
  if (score >= 70) return "HIGH";
  if (score >= 40) return "MEDIUM";
  return "LOW";
}

/**
 * ==========================
 * ACTION PREDICTION ENGINE
 * ==========================
 */
function getDecision(score) {
  if (score >= 90) return "BLOCK";
  if (score >= 70) return "RESTRICT";
  if (score >= 40) return "MONITOR";
  return "ALLOW";
}
