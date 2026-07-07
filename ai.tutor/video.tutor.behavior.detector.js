/**
 * VIDEO TUTOR BEHAVIOR DETECTOR - UniMentorAI
 * Builds dynamic learner behavior profiles from interaction patterns
 */

class VideoTutorBehaviorDetector {
  constructor({ logger }) {
    this.logger = logger;

    // simple in-memory profile store (replace with DB in production)
    this.profiles = new Map();
  }

  /**
   * 🎯 Main entry: update behavior profile
   */
  detect({ userId, event }) {
    try {
      const profile = this._getProfile(userId);

      const updated = this._updateProfile(profile, event);

      const classification = this._classify(updated);

      const insights = this._generateInsights(updated, classification);

      this.profiles.set(userId, updated);

      return {
        userId,
        profile: updated,
        classification,
        insights
      };

    } catch (error) {
      this.logger.error("BehaviorDetector error", error);

      return {
        userId,
        profile: null,
        classification: "unknown",
        insights: []
      };
    }
  }

  /**
   * 🧠 Retrieve or initialize profile
   */
  _getProfile(userId) {
    return this.profiles.get(userId) || {
      userId,
      totalEvents: 0,
      skips: 0,
      rewatches: 0,
      pauses: 0,
      completions: 0,
      chatInteractions: 0,
      voiceInteractions: 0,
      attentionDrops: 0,
      lastActive: Date.now()
    };
  }

  /**
   * ⚙️ Update behavior counters
   */
  _updateProfile(profile, event) {
    profile.totalEvents += 1;
    profile.lastActive = Date.now();

    switch (event.type) {
      case "content_skip":
        profile.skips += 1;
        break;

      case "rewatch":
        profile.rewatches += 1;
        break;

      case "pause_long":
        profile.pauses += 1;
        break;

      case "lesson_complete":
        profile.completions += 1;
        break;

      case "chat_interaction":
        profile.chatInteractions += 1;
        break;

      case "voice_interaction":
        profile.voiceInteractions += 1;
        break;

      case "low_attention":
        profile.attentionDrops += 1;
        break;
    }

    return profile;
  }

  /**
   * 🧠 Behavioral classification engine
   */
  _classify(profile) {
    const skipRate = profile.skips / profile.totalEvents;
    const rewatchRate = profile.rewatches / profile.totalEvents;
    const completionRate = profile.completions / profile.totalEvents;
    const attentionIssueRate = profile.attentionDrops / profile.totalEvents;

    if (completionRate > 0.6) {
      return "high_achiever";
    }

    if (skipRate > 0.4) {
      return "fast_skipper";
    }

    if (rewatchRate > 0.3) {
      return "careful_learner";
    }

    if (attentionIssueRate > 0.3) {
      return "struggling_learner";
    }

    if (profile.voiceInteractions > profile.chatInteractions) {
      return "voice_preferred_learner";
    }

    if (profile.chatInteractions > profile.voiceInteractions) {
      return "text_preferred_learner";
    }

    return "balanced_learner";
  }

  /**
   * 📊 Generate behavioral insights
   */
  _generateInsights(profile, classification) {
    const insights = [];

    if (classification === "fast_skipper") {
      insights.push({
        type: "risk_fast_consumption",
        action: "increase_interaction_frequency"
      });
    }

    if (classification === "struggling_learner") {
      insights.push({
        type: "difficulty_detected",
        action: "simplify_content_and_add_examples"
      });
    }

    if (classification === "high_achiever") {
      insights.push({
        type: "ready_for_advanced_content",
        action: "increase_difficulty"
      });
    }

    if (classification === "careful_learner") {
      insights.push({
        type: "deep_processing_style",
        action: "provide_detailed_explanations"
      });
    }

    return insights;
  }
}

module.exports = VideoTutorBehaviorDetector;
