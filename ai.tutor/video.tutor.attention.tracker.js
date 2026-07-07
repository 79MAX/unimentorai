/**
 * VIDEO TUTOR ATTENTION TRACKER - UniMentorAI
 * Tracks user attention level during learning sessions
 */

class VideoTutorAttentionTracker {
  constructor({ analytics, logger }) {
    this.analytics = analytics;
    this.logger = logger;
  }

  /**
   * 🎯 Main entry: analyze attention state
   */
  async track({ userId, courseId, videoId, signals }) {
    try {
      const attentionScore = this._computeAttentionScore(signals);

      const state = this._classifyAttention(attentionScore);

      const insights = this._generateInsights(signals, state);

      const result = {
        userId,
        courseId,
        videoId,
        attentionScore,
        state,
        insights,
        timestamp: Date.now()
      };

      await this._trackAnalytics(result);

      return result;

    } catch (error) {
      this.logger.error("AttentionTracker error", error);
      return this._fallback(userId, courseId, videoId);
    }
  }

  /**
   * 🧠 Compute global attention score (0–100)
   */
  _computeAttentionScore(signals) {
    let score = 50;

    // Video behavior signals
    if (signals?.video?.pauseLong) score -= 20;
    if (signals?.video?.rewatch) score -= 10;
    if (signals?.video?.fastSkip) score -= 15;
    if (signals?.video?.steadyPlay) score += 15;

    // Interaction signals
    if (signals?.interaction?.clicks > 5) score -= 10;
    if (signals?.interaction?.scrollingLow) score += 10;

    // Audio signals
    if (signals?.audio?.confusionDetected) score -= 20;
    if (signals?.audio?.steadySpeechFlow) score += 10;

    // Time-based fatigue
    if (signals?.session?.duration > 900) score -= 15; // 15 min fatigue

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * 🧠 Classify attention level
   */
  _classifyAttention(score) {
    if (score >= 75) return "high_focus";
    if (score >= 45) return "medium_focus";
    if (score >= 25) return "low_focus";
    return "critical_distraction";
  }

  /**
   * 💡 Generate actionable insights
   */
  _generateInsights(signals, state) {
    const insights = [];

    if (state === "low_focus") {
      insights.push("Simplify explanation or add example");
    }

    if (state === "critical_distraction") {
      insights.push("Trigger engagement recovery (pause, quiz, recap)");
    }

    if (signals?.video?.rewatch > 3) {
      insights.push("User struggling with concept");
    }

    if (signals?.session?.duration > 1200) {
      insights.push("Suggest short break");
    }

    if (state === "high_focus") {
      insights.push("User ready for advanced content");
    }

    return insights;
  }

  /**
   * 📊 Analytics tracking
   */
  async _trackAnalytics(result) {
    await this.analytics.track("attention_tracking", {
      userId: result.userId,
      courseId: result.courseId,
      videoId: result.videoId,
      attentionScore: result.attentionScore,
      state: result.state,
      timestamp: result.timestamp
    });
  }

  /**
   * 🔄 Fallback safe state
   */
  _fallback(userId, courseId, videoId) {
    return {
      userId,
      courseId,
      videoId,
      attentionScore: 50,
      state: "unknown",
      insights: ["fallback_mode"],
      timestamp: Date.now()
    };
  }
}

module.exports = VideoTutorAttentionTracker;
