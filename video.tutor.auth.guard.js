/**
 * VIDEO TUTOR AUTH GUARD - UniMentorAI
 * Security + access control + abuse protection layer
 */

class VideoTutorAuthGuard {
  constructor({ eventBus, logger }) {
    this.eventBus = eventBus;
    this.logger = logger;

    // simple in-memory rate limiter (replace with Redis in production)
    this.requestLog = new Map();
  }

  /**
   * 🎯 Main protection entry
   */
  async protect(context) {
    try {
      const userId = context.userId;

      // 1. Authentication check
      if (!this._isAuthenticated(context)) {
        return this._deny("unauthenticated");
      }

      // 2. Rate limiting
      if (this._isRateLimited(userId)) {
        this.eventBus.emit("system.rate_limited", { userId });
        return this._deny("rate_limited");
      }

      // 3. Permission check
      const permission = this._checkPermissions(context);

      if (!permission.allowed) {
        this.eventBus.emit("system.guard_blocked", {
          userId,
          reason: permission.reason
        });

        return this._deny(permission.reason);
      }

      // 4. Abuse detection
      const abuse = this._detectAbuse(context);

      if (abuse.flagged) {
        this.eventBus.emit("system.abuse_detected", {
          userId,
          risk: abuse.risk
        });

        return this._deny("abuse_detected", abuse.risk);
      }

      // 5. Allow request
      this._logAccess(userId);

      return {
        allowed: true,
        role: permission.role,
        risk: abuse.risk || "low"
      };

    } catch (error) {
      this.logger.error("Guard error", error);

      return this._deny("guard_error");
    }
  }

  /**
   * 🔐 Authentication check
   */
  _isAuthenticated(context) {
    return !!context.userId && !!context.token;
  }

  /**
   * ⚖️ Permission system
   */
  _checkPermissions(context) {
    const role = context.userRole || "free";

    const permissions = {
      free: { allowed: true },
      premium: { allowed: true },
      admin: { allowed: true },
      enterprise: { allowed: true }
    };

    if (!permissions[role]) {
      return { allowed: false, reason: "invalid_role" };
    }

    return {
      allowed: true,
      role
    };
  }

  /**
   * 🚦 Rate limiting logic
   */
  _isRateLimited(userId) {
    const now = Date.now();

    if (!this.requestLog.has(userId)) {
      this.requestLog.set(userId, []);
    }

    const timestamps = this.requestLog.get(userId);

    // keep last 10 seconds window
    const recent = timestamps.filter(t => now - t < 10000);

    recent.push(now);

    this.requestLog.set(userId, recent);

    return recent.length > 50; // threshold
  }

  /**
   * 🧠 Abuse detection heuristic
   */
  _detectAbuse(context) {
    let risk = 0;

    // abnormal payload size
    if (context.payload && JSON.stringify(context.payload).length > 5000) {
      risk += 30;
    }

    // too many rapid interactions
    if (context.behavior?.rapidActions > 10) {
      risk += 40;
    }

    // suspicious empty patterns
    if (!context.payload && context.intent === "unknown") {
      risk += 20;
    }

    return {
      flagged: risk > 50,
      risk: risk > 70 ? "high" : risk > 40 ? "medium" : "low"
    };
  }

  /**
   * 🚫 Deny helper
   */
  _deny(reason, risk = "low") {
    return {
      allowed: false,
      reason,
      risk
    };
  }

  /**
   * 📊 Track allowed access
   */
  _logAccess(userId) {
    this.eventBus.emit("auth.access_granted", {
      userId,
      timestamp: Date.now()
    });
  }
}

module.exports = VideoTutorAuthGuard;
