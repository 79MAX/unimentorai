import { handleSecurityEvent } from "./alert.engine.service.js";

/**
 * ==================================================
 * ALERT HOOK V2
 * UniMentorAI Security Event Gateway
 * ==================================================
 *
 * 🎯 ROLE:
 * - Normalize incoming events
 * - Forward to Alert Engine
 * - Keep system decoupled
 */

/**
 * 🚨 MAIN HOOK ENTRY
 */
export async function triggerSecurityAlert(rawEvent = {}) {
  try {
    if (!rawEvent) return false;

    /**
     * ==========================
     * NORMALIZATION LAYER
     * ==========================
     */
    const event = normalizeEvent(rawEvent);

    /**
     * ==========================
     * FORWARD TO ENGINE
     * ==========================
     */
    return await handleSecurityEvent(event);
  } catch (error) {
    console.error(
      "[ALERT_HOOK_ERROR]",
      error.message
    );

    /**
     * NEVER BLOCK SYSTEM
     */
    return false;
  }
}

/**
 * ==========================
 * EVENT NORMALIZER
 * ==========================
 */
function normalizeEvent(event) {
  return {
    id: event.id || generateId(),
    type: event.type || "UNKNOWN",
    userId: event.userId || null,
    ip: event.ip || null,
    score: event.score || 0,
    level: event.level || "LOW",
    message:
      event.message || "Security event triggered",
    timestamp: event.timestamp
      ? new Date(event.timestamp)
      : new Date(),

    /**
     * OPTIONAL FLAGS (AI READY)
     */
    failedAttempts: event.failedAttempts || 0,
    suspiciousBehavior:
      event.suspiciousBehavior || false,
    ipReputation: event.ipReputation || "UNKNOWN",
    bruteforce: event.bruteforce || false,
    rateLimitExceeded:
      event.rateLimitExceeded || false,
  };
}

/**
 * ==========================
 * SAFE EVENT TRIGGERS (HELPERS)
 * ==========================
 */

/**
 * 🚨 Attack detected shortcut
 */
export function triggerAttackDetected(data) {
  return triggerSecurityAlert({
    type: "security:attack:detected",
    level: "HIGH",
    ...data,
  });
}

/**
 * 🚫 User blocked shortcut
 */
export function triggerUserBlocked(data) {
  return triggerSecurityAlert({
    type: "security:user:blocked",
    level: "CRITICAL",
    ...data,
  });
}

/**
 * ⚠️ Risk alert shortcut
 */
export function triggerRiskAlert(data) {
  return triggerSecurityAlert({
    type: "security:risk:alert",
    level: "MEDIUM",
    ...data,
  });
}

/**
 * ==========================
 * ID GENERATOR
 * ==========================
 */
function generateId() {
  return (
    "hook_" +
    Math.random().toString(36).substring(2, 10) +
    Date.now()
  );
}
