import { securityObservability } from "./security.observability.js";

/**
 * ==================================================
 * SECURITY ENFORCEMENT LAYER V2
 * Execution & Protection Core
 * ==================================================
 *
 * 🎯 ROLE:
 * - Execute security decisions safely
 * - Apply protection actions (quarantine, limit, monitor)
 * - Ensure system stability & rollback safety
 */

class SecurityEnforcementLayer {
  constructor() {
    this.activeStates = new Map();
  }

  /**
   * 🚀 MAIN EXECUTION ENTRY
   */
  async execute(decision = {}) {
    const { userId, action, severity } = decision;

    if (!userId || !action) return null;

    /**
     * ==========================
     * IDEMPOTENCY CHECK (IMPORTANT)
     * ==========================
     */
    if (this._isAlreadyApplied(userId, action)) {
      return {
        status: "SKIPPED",
        reason: "ALREADY_APPLIED",
      };
    }

    const result = await this._applyAction(decision);

    /**
     * ==========================
     * STATE TRACKING
     * ==========================
     */
    this.activeStates.set(userId, {
      action,
      severity,
      timestamp: Date.now(),
    });

    /**
     * ==========================
     * OBSERVABILITY LOG
     * ==========================
     */
    securityObservability.recordEnforcement({
      userId,
      action,
      severity,
      result,
    });

    return result;
  }

  /**
   * ==========================
   * ACTION DISPATCHER
   * ==========================
   */
  async _applyAction(decision) {
    const { action, userId } = decision;

    switch (action.type) {
      case "QUARANTINE":
        return this._quarantine(userId, decision);

      case "RESTRICT":
        return this._restrict(userId, decision);

      case "LIMIT":
        return this._rateLimit(userId, decision);

      case "MONITOR":
        return this._monitor(userId, decision);

      case "ALLOW":
      default:
        return this._allow(userId);
    }
  }

  /**
   * ==========================
   * HARD PROTECTION (QUARANTINE)
   * ==========================
   */
  async _quarantine(userId, decision) {
    return {
      status: "QUARANTINED",
      level: decision.action.mode,
      userId,
    };
  }

  /**
   * ==========================
   * STRICT ACCESS CONTROL
   * ==========================
   */
  async _restrict(userId) {
    return {
      status: "RESTRICTED",
      userId,
    };
  }

  /**
   * ==========================
   * RATE LIMITING (SOFT PROTECTION)
   * ==========================
   */
  async _rateLimit(userId) {
    return {
      status: "RATE_LIMITED",
      userId,
    };
  }

  /**
   * ==========================
   * MONITOR ONLY MODE
   * ==========================
   */
  async _monitor(userId) {
    return {
      status: "MONITORING",
      userId,
    };
  }

  /**
   * ==========================
   * ALLOW (NO ACTION)
   * ==========================
   */
  async _allow(userId) {
    return {
      status: "ALLOWED",
      userId,
    };
  }

  /**
   * ==========================
   * IDEMPOTENCY CHECK
   * ==========================
   */
  _isAlreadyApplied(userId, action) {
    const state = this.activeStates.get(userId);

    if (!state) return false;

    return state.action === action.type;
  }

  /**
   * ==========================
   * ROLLBACK SYSTEM (CRITICAL FOR SAFETY)
   * ==========================
   */
  rollback(userId) {
    if (!this.activeStates.has(userId)) return false;

    this.activeStates.delete(userId);

    securityObservability.recordRollback({
      userId,
      timestamp: Date.now(),
    });

    return {
      status: "ROLLED_BACK",
      userId,
    };
  }

  /**
   * ==========================
   * SYSTEM STATE
   * ==========================
   */
  getActiveStates() {
    return Array.from(this.activeStates.entries()).map(
      ([userId, state]) => ({
        userId,
        ...state,
      })
    );
  }

  /**
   * CLEAR ALL (EMERGENCY RESET)
   */
  reset() {
    this.activeStates.clear();
  }
}

/**
 * Singleton instance
 */
export const securityEnforcementLayer =
  new SecurityEnforcementLayer();
