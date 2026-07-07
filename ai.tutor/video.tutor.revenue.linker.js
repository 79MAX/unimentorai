/**
 * VIDEO TUTOR REVENUE LINKER - UniMentorAI
 * Links learning behaviors and engagement signals to revenue opportunities
 */

class VideoTutorRevenueLinker {
  constructor({ analytics, logger }) {
    this.analytics = analytics;
    this.logger = logger;
  }

  /**
   * 🎯 Main entry: link behavior → revenue opportunity
   */
  link({ userId, courseId, videoId, context }) {
    try {
      const signals = this._extractSignals(context);

      const mapping = this._mapSignalsToRevenue(signals);

      const priority = this._prioritize(mapping, signals);

      const action = this._decideAction(priority, signals);

      this._track(userId, courseId, mapping, action);

      return {
        userId,
        courseId,
        videoId,
        revenueSignals: mapping,
        priority,
        action
      };

    } catch (error) {
      this.logger.error("RevenueLinker error", error);

      return {
        action: "none",
        priority: 0,
        revenueSignals: []
      };
    }
  }

  /**
   * 🧠 Extract relevant behavioral signals
   */
  _extractSignals(context) {
    return {
      attention: context.attention?.attentionScore || 50,
      engagement: context.behavior?.engagementLevel || "medium",
      completion: context.analytics?.completionRate || 0,
      frustration: context.signals?.frustration || 0,
      skillLevel: context.behavior?.classification || "balanced_learner",
      sessionTime: context.session?.duration || 0,
      rewatchCount: context.behavior?.rewatchCount || 0
    };
  }

  /**
   * 💰 Map signals to revenue opportunities
   */
  _mapSignalsToRevenue(s) {
    const map = [];

    // High engagement → upsell premium
    if (s.attention > 70 && s.engagement === "high") {
      map.push({
        type: "premium_upgrade",
        strength: 0.9
      });
    }

    // Completion → certification
    if (s.completion > 0.7) {
      map.push({
        type: "certification_offer",
        strength: 0.85
      });
    }

    // High skill → advanced course
    if (s.skillLevel === "high_achiever") {
      map.push({
        type: "advanced_course",
        strength: 0.8
      });
    }

    // Frustration → coaching offer
    if (s.frustration > 0.5) {
      map.push({
        type: "personal_coaching",
        strength: 0.95
      });
    }

    // Long session → monetization window
    if (s.sessionTime > 600) {
      map.push({
        type: "soft_upsell",
        strength: 0.6
      });
    }

    // Rewatch behavior → mastery bundle
    if (s.rewatchCount > 2) {
      map.push({
        type: "mastery_pack",
        strength: 0.75
      });
    }

    return map;
  }

  /**
   * 📊 Prioritize revenue opportunities
   */
  _prioritize(map, signals) {
    if (!map.length) return null;

    return map.sort((a, b) => b.strength - a.strength)[0];
  }

  /**
   * 🎯 Decide final monetization action
   */
  _decideAction(priority, signals) {
    if (!priority) return { action: "none" };

    switch (priority.type) {

      case "premium_upgrade":
        return {
          action: "show_premium_offer",
          timing: "end_of_session"
        };

      case "certification_offer":
        return {
          action: "trigger_certification_flow",
          timing: "post_completion"
        };

      case "advanced_course":
        return {
          action: "recommend_advanced_path",
          timing: "contextual_in_video"
        };

      case "personal_coaching":
        return {
          action: "offer_mentor_session",
          timing: "frustration_moment"
        };

      case "soft_upsell":
        return {
          action: "subtle_upgrade_hint",
          timing: "natural_break"
        };

      case "mastery_pack":
        return {
          action: "bundle_learning_path",
          timing: "after_rewatch_pattern"
        };

      default:
        return { action: "none" };
    }
  }

  /**
   * 📊 Track revenue linking decisions
   */
  _track(userId, courseId, mapping, action) {
    this.analytics.track("revenue_linking", {
      userId,
      courseId,
      opportunities: mapping.length,
      topAction: action?.action || "none",
      timestamp: Date.now()
    });
  }
}

module.exports = VideoTutorRevenueLinker;
