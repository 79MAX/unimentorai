 /**
 * ==================================================
 * ALERT TYPES V2
 * UniMentorAI Security Taxonomy Layer
 * ==================================================
 */

/**
 * ==========================
 * ALERT LEVELS (SEVERITY)
 * ==========================
 */
export const ALERT_LEVELS = Object.freeze({
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL",
});

/**
 * ==========================
 * ALERT EVENT TYPES
 * ==========================
 */
export const ALERT_TYPES = Object.freeze({
  // 🚨 SECURITY ATTACKS
  ATTACK_DETECTED: "security:attack:detected",
  BRUTE_FORCE: "security:attack:bruteforce",
  RATE_LIMIT_EXCEEDED: "security:attack:rate_limit",

  // 👤 USER SECURITY
  USER_BLOCKED: "security:user:blocked",
  USER_RESTRICTED: "security:user:restricted",
  USER_UNBLOCKED: "security:user:unblocked",

  // ⚠️ RISK EVENTS
  RISK_ALERT: "security:risk:alert",
  RISK_UPDATE: "security:risk:update",

  // 🧠 SYSTEM EVENTS
  SYSTEM_ALERT: "security:system:alert",
  SYSTEM_ANOMALY: "security:system:anomaly",

  // 🌐 AUTH / SESSION
  LOGIN_FAILED: "security:auth:login_failed",
  LOGIN_SUCCESS: "security:auth:login_success",
  SESSION_HIJACK: "security:auth:session_hijack",

  // 📊 API SECURITY
  API_ABUSE: "security:api:abuse",
  SUSPICIOUS_REQUEST: "security:api:suspicious_request",
});

/**
 * ==========================
 * SECURITY ACTIONS
 * ==========================
 */
export const SECURITY_ACTIONS = Object.freeze({
  BLOCK_USER: "BLOCK_USER",
  RESTRICT_USER: "RESTRICT_USER",
  MONITOR_USER: "MONITOR_USER",
  LOG_ONLY: "LOG_ONLY",
  UNKNOWN: "UNKNOWN",
});

/**
 * ==========================
 * RISK SCORE THRESHOLDS
 * ==========================
 */
export const RISK_THRESHOLDS = Object.freeze({
  LOW: 0,
  MEDIUM: 40,
  HIGH: 70,
  CRITICAL: 90,
});

/**
 * ==========================
 * EVENT CATEGORIES (FOR ANALYTICS)
 * ==========================
 */
export const EVENT_CATEGORIES = Object.freeze({
  ATTACK: "ATTACK",
  USER: "USER",
  SYSTEM: "SYSTEM",
  AUTH: "AUTH",
  API: "API",
});

/**
 * ==========================
 * HELPER MAPPINGS
 * ==========================
 */

/**
 * Convert score → severity level
 */
export function getSeverityFromScore(score = 0) {
  if (score >= RISK_THRESHOLDS.CRITICAL) return ALERT_LEVELS.CRITICAL;
  if (score >= RISK_THRESHOLDS.HIGH) return ALERT_LEVELS.HIGH;
  if (score >= RISK_THRESHOLDS.MEDIUM) return ALERT_LEVELS.MEDIUM;
  return ALERT_LEVELS.LOW;
}

/**
 * Check if event is critical
 */
export function isCriticalEvent(event = {}) {
  return (
    event.level === ALERT_LEVELS.CRITICAL ||
    event.score >= RISK_THRESHOLDS.CRITICAL
  );
}

/**
 * Check if attack event
 */
export function isAttackEvent(event = {}) {
  return (
    event.type === ALERT_TYPES.ATTACK_DETECTED ||
    event.type === ALERT_TYPES.BRUTE_FORCE ||
    event.type === ALERT_TYPES.RATE_LIMIT_EXCEEDED
  );
}
