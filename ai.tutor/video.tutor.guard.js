/**
 * VIDEO TUTOR GUARD - UniMentorAI
 * AI safety, validation and abuse protection layer
 */

class VideoTutorGuard {
  constructor({ logger, analytics }) {
    this.logger = logger;
    this.analytics = analytics;
  }

  /**
   * 🎯 Main entry: protect incoming tutor request
   */
  async protect(context) {
    try {
      const risk = this._assessRisk(context);

      if (risk.level === "critical") {
        return this._block(context, risk);
      }

      if (risk.level === "high") {
        return this._restrict(context, risk);
      }

      if (risk.level === "medium") {
        return this._softGuard(context, risk);
      }

      return this._allow(context, risk);

    } catch (error) {
      this.logger.error("TutorGuard error", error);

      return {
        allowed: false,
        reason: "guard_failure",
        risk: "unknown"
      };
    }
  }

  /**
   * 🧠 Risk scoring engine
   */
  _assessRisk(context) {
    let score = 0;
    const reasons = [];

    const payload = context.payload || {};

    // Missing essential data
    if (!context.userId) {
      score += 40;
      reasons.push("missing_user");
    }

    if (!context.courseId) {
      score += 40;
      reasons.push("missing_course");
    }

    // Abnormal message patterns
    if (payload.message && payload.message.length > 500) {
      score += 20;
      reasons.push("excessive_input_length");
    }

    // Spam-like behavior
    if (payload.repeatRequests > 5) {
      score += 30;
      reasons.push("repeated_requests");
    }

    // Suspicious fast skipping behavior
    if (payload.signal?.type === "content_skip") {
      score += 10;
      reasons.push("rapid_navigation");
    }

    // Voice abuse pattern
    if (payload.voiceEvent && payload.voiceEvent.spamDetected) {
      score += 50;
      reasons.push("voice_spam");
    }

    return {
      score,
      level: this._mapRiskLevel(score),
      reasons
    };
  }

  /**
   * 📊 Map score → risk level
   */
  _mapRiskLevel(score) {
    if (score >= 70) return "critical";
    if (score >= 40) return "high";
    if (score >= 20) return "medium";
    return "low";
  }

  /**
   * 🚫 Block request completely
   */
  _block(context, risk) {
    this._track(context, risk, "blocked");

    return {
      allowed: false,
      action: "block",
      reason: risk.reasons,
      message: "Request blocked for safety reasons",
      risk: risk.level
    };
  }

  /**
   * ⚠️ Restrict functionality
   */
  _restrict(context, risk) {
    this._track(context, risk, "restricted");

    return {
      allowed: true,
      action: "restricted_mode",
      limitations: [
        "reduced_ai_power",
        "no_voice",
        "simplified_explanations"
      ],
      reason: risk.reasons,
      risk: risk.level
    };
  }

  /**
   * 🟡 Soft guard (light adjustments)
   */
  _softGuard(context, risk) {
    this._track(context, risk, "soft_guard");

    return {
      allowed: true,
      action: "soft_adjustment",
      modifications: [
        "simplify_response",
        "increase_examples"
      ],
      risk: risk.level
    };
  }

  /**
   * 🟢 Allow full access
   */
  _allow(context, risk) {
    this._track(context, risk, "allowed");

    return {
      allowed: true,
      action: "full_access",
      risk: "low"
    };
  }

  /**
   * 📊 Track all guard decisions
   */
  async _track(context, risk, decision) {
    await this.analytics.track("tutor_guard", {
      userId: context.userId,
      courseId: context.courseId,
      riskLevel: risk.level,
      score: risk.score,
      decision,
      reasons: risk.reasons,
      timestamp: Date.now()
    });
  }
}

module.exports = VideoTutorGuard;
