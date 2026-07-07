 /**
 * ==================================================
 * SAFETY GUARD V2
 * UniMentorAI Anti-False Positive Protection Layer
 * ==================================================
 *
 * 🎯 ROLE:
 * - Prevent harmful auto-blocking
 * - Protect legitimate users
 * - Stabilize AI decisions
 */

/**
 * 🚀 MAIN SAFETY CHECK
 */
export function safetyGuard(score = 0, action = "ALLOW", context = {}) {
  /**
   * ==========================
   * 1. NEVER BLOCK LOW SCORE USERS
   * ==========================
   */
  if (score < 40 && action === "BLOCK") {
    return false;
  }

  /**
   * ==========================
   * 2. PROTECT NEW USERS (IMPORTANT)
   * ==========================
   */
  if (context.isNewUser && action === "BLOCK") {
    return false;
  }

  /**
   * ==========================
   * 3. WHITELIST CRITICAL ACCOUNTS
   * ==========================
   */
  if (context.isWhitelistedUser) {
    if (action === "BLOCK") return false;
  }

  /**
   * ==========================
   * 4. GEO / DEVICE ANOMALY SAFETY
   * ==========================
   */
  if (context.geoMismatch && score < 70) {
    return false;
  }

  /**
   * ==========================
   * 5. RATE LIMIT SAFETY OVERRIDE
   * ==========================
   * Prevent extreme throttling on normal spikes
   */
  if (action === "BLOCK" && context.normalTrafficSpike) {
    return false;
  }

  /**
   * ==========================
   * 6. CRITICAL ACTION ALLOW ONLY HIGH CONFIDENCE
   * ==========================
   */
  if (action === "BLOCK" && score < 85) {
    return false;
  }

  /**
   * ==========================
   * DEFAULT SAFE MODE
   * ==========================
   */
  return true;
}
