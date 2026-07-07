 /**
 * ==================================================
 * ADAPTIVE THROTTLE V2
 * UniMentorAI Risk-Based Rate Limiting Engine
 * ==================================================
 *
 * 🎯 ROLE:
 * - Dynamically adjust request limits
 * - Based on AI fraud score
 * - Prevent API abuse in real time
 */

const userThrottleMap = new Map();

/**
 * 🚀 MAIN ENTRY
 */
export function applyAdaptiveThrottle(userId, aiScore = 0, context = {}) {
  const baseLimit = 100;

  /**
   * ==========================
   * 1. RISK MULTIPLIER ENGINE
   * ==========================
   */
  const multiplier = getMultiplier(aiScore, context);

  const limit = Math.max(5, Math.floor(baseLimit * multiplier));

  /**
   * ==========================
   * 2. STORE USER LIMIT
   * ==========================
   */
  userThrottleMap.set(userId, {
    limit,
    score: aiScore,
    updatedAt: new Date(),
    mode: getMode(aiScore),
  });

  /**
   * ==========================
   * 3. RETURN THROTTLE POLICY
   * ==========================
   */
  return {
    userId,
    limit,
    remaining: limit,
    mode: getMode(aiScore),
    resetTime: getResetTime(),
  };
}

/**
 * ==========================
 * RISK MULTIPLIER ENGINE
 * ==========================
 */
function getMultiplier(score, context) {
  let multiplier = 1;

  /**
   * 🟢 LOW RISK
   */
  if (score < 40) {
    multiplier = 1;
  }

  /**
   * 🟡 MEDIUM RISK
   */
  else if (score < 70) {
    multiplier = 0.6;
  }

  /**
   * 🔴 HIGH RISK
   */
  else if (score < 90) {
    multiplier = 0.3;
  }

  /**
   * 🚨 CRITICAL RISK
   */
  else {
    multiplier = 0.1;
  }

  /**
   * ==========================
   * CONTEXT MODIFIERS
   * ==========================
   */

  // New user = slightly more lenient
  if (context.isNewUser) {
    multiplier += 0.1;
  }

  // Geo mismatch = stricter
  if (context.geoMismatch) {
    multiplier -= 0.1;
  }

  // Suspicious behavior = stricter
  if (context.suspiciousBehavior) {
    multiplier -= 0.2;
  }

  return clamp(multiplier, 0.05, 1);
}

/**
 * ==========================
 * USER MODE CLASSIFICATION
 * ==========================
 */
function getMode(score) {
  if (score >= 90) return "LOCKED";
  if (score >= 70) return "STRICT";
  if (score >= 40) return "LIMITED";
  return "NORMAL";
}

/**
 * ==========================
 * RESET WINDOW
 * ==========================
 */
function getResetTime() {
  return Date.now() + 60 * 1000; // 1 minute window
}

/**
 * ==========================
 * GET CURRENT LIMIT STATUS
 * ==========================
 */
export function getThrottleStatus(userId) {
  return userThrottleMap.get(userId) || {
    limit: 100,
    mode: "NORMAL",
  };
}

/**
 * ==========================
 * UTIL: CLAMP
 * ==========================
 */
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
