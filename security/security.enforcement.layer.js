import { securityObservability } from "./security.observability.js";

/**
 * ==================================================
 * SECURITY ENFORCEMENT LAYER V2
 * UniMentorAI Action Execution Engine
 * ==================================================
 */

class SecurityEnforcementLayer {
  constructor() {
    this.quarantineStore = new Map(); // temp in-memory isolation
    this.blockedUsers = new Set();
    this.throttledUsers = new Map();
  }

  /**
   * ==================================================
   * MAIN EXECUTION ENTRY
   * ==================================================
   */
  async execute(decision, context) {
    const { userId, ip } = context;
    const action = decision.action;

    switch (action) {
      case "BLOCK":
        await this._blockUser(userId, ip, decision);
        break;

      case "QUARANTINE":
        await this._quarantineUser(userId, ip, decision);
        break;

      case "THROTTLE":
        await this._throttleUser(userId, ip, decision);
        break;

      case "CHALLENGE":
        await this._challengeUser(userId, ip, decision);
        break;

      case "ALLOW":
      default:
        break;
    }

    await this._logExecution(userId, ip, decision);
  }

  /**
   * ==================================================
   * BLOCK USER (HARD STOP)
   * ==================================================
   */
  async _blockUser(userId, ip, decision) {
    this.blockedUsers.add(userId);

    console.warn(`⛔ USER BLOCKED: ${userId}`);

    await securityObservability.log({
      userId,
      ip,
      decision: "BLOCK",
      reason: decision.reason,
      severity: "CRITICAL",
      source: "enforcement_layer",
    });
  }

  /**
   * ==================================================
   * QUARANTINE USER (ISOLATION MODE)
   * ==================================================
   */
  async _quarantineUser(userId, ip, decision) {
    this.quarantineStore.set(userId, {
      start: Date.now(),
      reason: decision.reason,
    });

    console.warn(`⚠️ USER QUARANTINED: ${userId}`);

    await securityObservability.log({
      userId,
      ip,
      decision: "QUARANTINE",
      reason: decision.reason,
      severity: "HIGH",
      source: "enforcement_layer",
    });
  }

  /**
   * ==================================================
   * THROTTLE USER (RATE LIMIT REDUCTION)
   * ==================================================
   */
  async _throttleUser(userId, ip, decision) {
    const current = this.throttledUsers.get(userId) || {
      level: 1,
    };

    const newLevel = Math.min(current.level + 1, 5);

    this.throttledUsers.set(userId, {
      level: newLevel,
      updatedAt: Date.now(),
    });

    console.log(`⏳ USER THROTTLED: ${userId} (level ${newLevel})`);

    await securityObservability.log({
      userId,
      ip,
      decision: "THROTTLE",
      level: newLevel,
      severity: "MEDIUM",
      source: "enforcement_layer",
    });
  }

  /**
   * ==================================================
   * CHALLENGE USER (MFA / CAPTCHA HOOK)
   * ==================================================
   */
  async _challengeUser(userId, ip, decision) {
    console.log(`🔐 CHALLENGE TRIGGERED: ${userId}`);

    await securityObservability.log({
      userId,
      ip,
      decision: "CHALLENGE",
      reason: decision.reason,
      severity: "LOW",
      source: "enforcement_layer",
    });

    // future: MFA / OTP / captcha trigger
  }

  /**
   * ==================================================
   * FINAL LOG
   * ==================================================
   */
  async _logExecution(userId, ip, decision) {
    await securityObservability.log({
      userId,
      ip,
      decision: decision.action,
      source: "enforcement_layer_final",
    });
  }

  /**
   * ==================================================
   * STATUS CHECKERS (FOR API / ADMIN PANEL)
   * ==================================================
   */
  isBlocked(userId) {
    return this.blockedUsers.has(userId);
  }

  isQuarantined(userId) {
    return this.quarantineStore.has(userId);
  }

  getThrottleLevel(userId) {
    return this.throttledUsers.get(userId)?.level || 0;
  }
}

export const securityEnforcementLayer =
  new SecurityEnforcementLayer();
