/**
 * VIDEO TUTOR ENGAGEMENT MONETIZER - UniMentorAI
 * Converts learning engagement into intelligent monetization opportunities
 */

class VideoTutorEngagementMonetizer {
  constructor({ analytics, logger }) {
    this.analytics = analytics;
    this.logger = logger;
  }

  /**
   * 🎯 Main entry: evaluate monetization opportunity
   */
  evaluate({ userId, courseId, videoId, context }) {
    try {
      const signals = this._extractSignals(context);

      const score = this._computeMonetizationScore(signals);

      const opportunity = this._decideOpportunity(score, signals);

      const strategy = this._buildStrategy(opportunity, signals);

      this._track(userId, courseId, score, opportunity);

      return {
        userId,
        courseId,
        videoId,
        score,
        opportunity,
        strategy
      };

    } catch (error) {
      this.logger.error("Monetizer error", error);

      return {
        opportunity: "none",
        score: 0,
        strategy: null
      };
    }
  }

  /**
   * 🧠 Extract monetization signals
   */
  _extractSignals(context) {
    return {
      attentionScore: context.attention?.attentionScore || 50,
      completionRate: context.analytics?.completionRate || 0,
      engagementLevel: context.behavior?.engagementLevel || "medium",
      skillLevel: context.behavior?.classification || "balanced_learner",
      frustrationLevel: context.signals?.frustration || 0,
      sessionTime: context.session?.duration || 0
    };
  }

  /**
   * 💰 Compute monetization score (0–100)
   */
  _computeMonetizationScore(s) {
    let score = 0;

    // High engagement = monetization opportunity
    if (s.attentionScore > 70) score += 25;

    // Completion = upsell moment
    if (s.completionRate > 0.7) score += 30;

    // Frustration = coaching opportunity
    if (s.frustrationLevel > 0.5) score += 20;

    // Long session = premium value
    if (s.sessionTime > 600) score += 15;

    // High skill users = advanced offer
    if (s.skillLevel === "high_achiever") score += 25;

    return Math.min(100, score);
  }

  /**
   * 🎯 Decide monetization opportunity type
   */
  _decideOpportunity(score, signals) {
    if (score >= 80) {
      return "premium_upgrade_offer";
    }

    if (signals.completionRate > 0.8) {
      return "certification_offer";
    }

    if (signals.skillLevel === "high_achiever") {
      return "advanced_course_offer";
    }

    if (signals.frustrationLevel > 0.6) {
      return "personal_coach_offer";
    }

    if (score >= 50) {
      return "soft_upsell";
    }

    return "none";
  }

  /**
   * 🧠 Build monetization strategy
   */
  _buildStrategy(opportunity, signals) {
    switch (opportunity) {

      case "premium_upgrade_offer":
        return {
          type: "upgrade",
          message: "Passe au niveau Premium pour accélérer ton apprentissage 🚀",
          timing: "end_of_video",
          discount: 20
        };

      case "certification_offer":
        return {
          type: "certification",
          message: "Obtiens ton certificat officiel reconnu 🌍",
          timing: "after_completion",
          price: "mid"
        };

      case "advanced_course_offer":
        return {
          type: "advanced_content",
          message: "Tu progresses vite — passe au niveau supérieur 🔥",
          timing: "contextual_in_video",
          price: "standard"
        };

      case "personal_coach_offer":
        return {
          type: "coaching",
          message: "Un mentor peut t’aider à débloquer ce point",
          timing: "frustration_trigger",
          price: "premium"
        };

      case "soft_upsell":
        return {
          type: "soft_offer",
          message: "Découvre plus de contenus avancés",
          timing: "natural_break",
          price: "low"
        };

      default:
        return null;
    }
  }

  /**
   * 📊 Track monetization decisions
   */
  _track(userId, courseId, score, opportunity) {
    this.analytics.track("monetization_event", {
      userId,
      courseId,
      score,
      opportunity,
      timestamp: Date.now()
    });
  }
}

module.exports = VideoTutorEngagementMonetizer;
