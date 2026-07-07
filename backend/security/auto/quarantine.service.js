 /**
 * ==================================================
 * QUARANTINE SERVICE V2
 * UniMentorAI Security Containment Layer
 * ==================================================
 *
 * 🎯 ROLE:
 * - Isolate high-risk users
 * - Prevent attack propagation
 * - Control system exposure
 */

const quarantineStore = new Map();

/**
 * 🚀 MAIN ENTRY POINT
 */
export function quarantineUser(userId, aiScore = 0, context = {}) {
  if (!userId) return false;

  const existing = quarantineStore.get(userId);

  const level = getQuarantineLevel(aiScore);

  const record = {
    userId,
    level,
    score: aiScore,
    reason: buildReason(aiScore, context),
    createdAt: new Date(),
    expiresAt: getExpiry(level),
    active: true,
    context,
  };

  quarantineStore.set(userId, record);

  console.log("[QUARANTINE_APPLIED]", record);

  return record;
}

/**
 * ==========================
 * QUARANTINE LEVEL ENGINE
 * ==========================
 */
function getQuarantineLevel(score) {
  if (score >= 90) return "MAXIMUM"; // full isolation
  if (score >= 70) return "HIGH";    // restricted access
  if (score >= 40) return "MEDIUM";  // monitored access
  return "LOW";
}

/**
 * ==========================
 * EXPIRATION POLICY
 * ==========================
 */
function getExpiry(level) {
  const now = Date.now();

  switch (level) {
    case "MAXIMUM":
      return now + 24 * 60 * 60 * 1000; // 24h
    case "HIGH":
      return now + 60 * 60 * 1000; // 1h
    case "MEDIUM":
      return now + 15 * 60 * 1000; // 15min
    default:
      return now + 5 * 60 * 1000;
  }
}

/**
 * ==========================
 * REASON BUILDER (AUDIT SAFE)
 * ==========================
 */
function buildReason(score, context) {
  const reasons = [];

  if (score >= 90) reasons.push("CRITICAL_RISK_SCORE");
  if (context.bruteforce) reasons.push("BRUTE_FORCE_DETECTED");
  if (context.geoMismatch) reasons.push("GEO_MISMATCH");
  if (context.suspiciousBehavior) reasons.push("SUSPICIOUS_BEHAVIOR");

  return reasons.length ? reasons.join("|") : "AI_RISK_ENGINE";
}

/**
 * ==========================
 * CHECK QUARANTINE STATUS
 * ==========================
 */
export function isQuarantined(userId) {
  const record = quarantineStore.get(userId);

  if (!record) return false;

  // auto-expiry cleanup
  if (Date.now() > record.expiresAt) {
    quarantineStore.delete(userId);
    return false;
  }

  return record.active;
}

/**
 * ==========================
 * LIFT QUARANTINE (SAFE RELEASE)
 * ==========================
 */
export function releaseQuarantine(userId) {
  const record = quarantineStore.get(userId);

  if (!record) return false;

  record.active = false;
  record.releasedAt = new Date();

  quarantineStore.set(userId, record);

  console.log("[QUARANTINE_RELEASED]", userId);

  return true;
}

/**
 * ==========================
 * GET QUARANTINE INFO
 * ==========================
 */
export function getQuarantineInfo(userId) {
  return quarantineStore.get(userId) || null;
}

/**
 * ==========================
 * CLEANUP JOB (OPTIONAL)
 * ==========================
 */
export function cleanupQuarantine() {
  const now = Date.now();

  for (const [userId, record] of quarantineStore.entries()) {
    if (record.expiresAt < now) {
      quarantineStore.delete(userId);
    }
  }
}
