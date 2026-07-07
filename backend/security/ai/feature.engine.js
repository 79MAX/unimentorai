 /**
 * ==================================================
 * FEATURE ENGINE V2
 * UniMentorAI AI Fraud Detection Layer
 * ==================================================
 *
 * 🎯 PURPOSE:
 * Convert raw security event → structured feature vector
 * for AI scoring / fraud detection
 */

/**
 * 🚀 MAIN FEATURE EXTRACTION
 */
export function extractFeatures(event = {}) {
  const now = new Date();

  return {
    /**
     * ==========================
     * IDENTIFICATION FEATURES
     * ==========================
     */
    userId: event.userId || null,
    ip: event.ip || "unknown",
    type: event.type || "unknown",

    /**
     * ==========================
     * BEHAVIOR FEATURES
     * ==========================
     */
    failedAttempts: safeNumber(event.failedAttempts),
    requestRate: safeNumber(event.requestRate),
    sessionDuration: safeNumber(event.sessionDuration),
    actionsPerMinute: safeNumber(event.actionsPerMinute),

    /**
     * ==========================
     * SECURITY FLAGS
     * ==========================
     */
    isBruteforce: toBinary(event.bruteforce),
    isRateLimited: toBinary(event.rateLimitExceeded),
    isSuspicious: toBinary(event.suspiciousBehavior),
    isAttack: isAttackType(event.type),

    /**
     * ==========================
     * CONTEXT FEATURES
     * ==========================
     */
    hourOfDay: now.getHours(),
    dayOfWeek: now.getDay(),
    isWeekend: isWeekend(now),
    isNightTime: now.getHours() < 6 || now.getHours() > 22,

    /**
     * ==========================
     * RISK SIGNAL FEATURES
     * ==========================
     */
    ipReputation: normalizeIpReputation(event.ipReputation),
    deviceTrust: normalizeTrust(event.deviceTrust),
    geoMismatch: toBinary(event.geoMismatch),

    /**
     * ==========================
     * SYSTEM FLAGS
     * ==========================
     */
    source: event.source || "unknown",
    environment: event.environment || "production",
  };
}

/**
 * ==========================
 * HELPERS (NORMALIZATION LAYER)
 * ==========================
 */

function safeNumber(value) {
  const n = Number(value);
  return isNaN(n) ? 0 : n;
}

function toBinary(value) {
  return value ? 1 : 0;
}

function isWeekend(date) {
  return [0, 6].includes(date.getDay());
}

/**
 * ==========================
 * TYPE CLASSIFICATION
 * ==========================
 */
function isAttackType(type) {
  return [
    "security:attack:detected",
    "security:attack:bruteforce",
    "security:attack:rate_limit",
  ].includes(type);
}

/**
 * ==========================
 * IP REPUTATION NORMALIZER
 * ==========================
 * bad → 1
 * unknown → 0.5
 * good → 0
 */
function normalizeIpReputation(value) {
  if (!value) return 0.5;
  if (value === "BAD") return 1;
  if (value === "GOOD") return 0;
  return 0.5;
}

/**
 * ==========================
 * DEVICE TRUST NORMALIZER
 * ==========================
 */
function normalizeTrust(value) {
  if (value === "HIGH") return 0;
  if (value === "MEDIUM") return 0.5;
  if (value === "LOW") return 1;
  return 0.5;
}
