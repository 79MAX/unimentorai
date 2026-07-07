/**
 * VIDEO TUTOR RATE LIMITER - UniMentorAI
 * Adaptive rate limiting + abuse protection + LTV-aware throttling
 */

class VideoTutorRateLimiter {
  constructor({ eventBus, logger }) {
    this.eventBus = eventBus;
    this.logger = logger;

    // in-memory store (replace with Redis in production)
    this.users = new Map();
  }

  /**
   * 🎯 Main check
   */
  check(userId, context = {}) {
    const now = Date.now();

    const state = this._getState(userId);

    this._cleanup(state, now);

    const limit = this._getLimit(state, context);

    const currentCount = state.requests.length;

    // record request
    state.requests.push(now);

    // exceed limit
    if (currentCount >= limit.maxRequests) {
      this._triggerLimitEvent(userId, state, limit);

      return {
        allowed: false,
        reason: "rate_limited",
        retryAfter: limit.windowMs
      };
    }

    return {
      allowed: true,
      remaining: limit.maxRequests - currentCount
    };
  }

  /**
   * 🧠 Dynamic limit engine (LTV-aware)
   */
  _getLimit(state, context) {
    const role = context.userRole || "free";

    const baseLimits = {
      free: { maxRequests: 20, windowMs: 60000 },
      premium: { maxRequests: 80, windowMs: 60000 },
      enterprise: { maxRequests: 300, windowMs: 60000 }
    };

    let limit = baseLimits[role] || baseLimits.free;

    // 💰 LTV-based scaling (important for business optimization)
    if (state.ltv > 100) {
      limit.maxRequests *= 1.5;
    }

    if (state.ltv > 500) {
      limit.maxRequests *= 2;
    }

    // ⚠️ risk reduction mode
    if (state.riskLevel === "high") {
      limit.maxRequests *= 0.5;
    }

    return limit;
  }

  /**
   * 📦 Get or init user state
   */
  _getState(userId) {
    if (!this.users.has(userId)) {
      this.users.set(userId, {
        requests: [],
        ltv: 0,
        riskLevel: "low"
      });
    }

    return this.users.get(userId);
  }

  /**
   * 🧹 Cleanup old requests outside window
   */
  _cleanup(state, now) {
    const windowMs = 60000;

    state.requests = state.requests.filter(
      (t) => now - t < windowMs
    );
  }

  /**
   * 🚨 Trigger limit event
   */
  _triggerLimitEvent(userId, state, limit) {
    this.eventBus.emit("system.rate_limited", {
      userId,
      limit,
      timestamp: Date.now()
    });

    this.logger.warn("Rate limit triggered", {
      userId,
      count: state.requests.length
    });
  }

  /**
   * 💰 Update LTV (called by monetization engine)
   */
  updateLTV(userId, ltv) {
    const state = this._getState(userId);
    state.ltv = ltv;
  }

  /**
   * ⚠️ Update risk level (behavior engine)
   */
  updateRisk(userId, riskLevel) {
    const state = this._getState(userId);
    state.riskLevel = riskLevel;
  }

  /**
   * 📊 Get usage stats
   */
  getStats(userId) {
    const state = this._getState(userId);

    return {
      requests: state.requests.length,
      ltv: state.ltv,
      riskLevel: state.riskLevel
    };
  }
}

module.exports = VideoTutorRateLimiter;
