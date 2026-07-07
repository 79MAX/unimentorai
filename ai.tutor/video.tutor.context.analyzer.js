/**
 * VIDEO TUTOR CONTEXT ANALYZER - UniMentorAI
 * Converts raw user activity into structured AI-ready context
 */

class VideoTutorContextAnalyzer {
  constructor({ analytics, memory, logger }) {
    this.analytics = analytics;
    this.memory = memory;
    this.logger = logger;
  }

  /**
   * 🎯 Main entry point
   */
  async analyze({ userId, courseId, sessionData }) {
    try {
      const [profile, history, engagement, progress] = await Promise.all([
        this.memory.getUserProfile(userId),
        this.analytics.getCourseHistory(userId, courseId),
        this.analytics.getEngagementSignals(userId, courseId),
        this.analytics.getProgressState(userId, courseId)
      ]);

      const context = this._buildContext({
        profile,
        history,
        engagement,
        progress,
        sessionData
      });

      const insights = this._extractInsights(context);

      return {
        context,
        insights,
        readinessScore: this._computeReadinessScore(context),
        riskFlags: this._detectRiskSignals(context),
        timestamp: Date.now()
      };

    } catch (error) {
      this.logger.error("ContextAnalyzer failure", error);

      return this._fallbackContext(userId, courseId);
    }
  }

  /**
   * 🧠 Merge raw data into unified context
   */
  _buildContext({ profile, history, engagement, progress, sessionData }) {
    return {
      user: profile,
      learningHistory: history || [],
      engagement: engagement || {},
      progress: progress || {},
      session: sessionData || {},
    };
  }

  /**
   * 📊 Extract learning intelligence signals
   */
  _extractInsights(context) {
    return {
      learningStyle: this._detectLearningStyle(context),
      difficultyTolerance: this._estimateDifficultyTolerance(context),
      focusLevel: this._estimateFocus(context),
      motivationLevel: this._estimateMotivation(context)
    };
  }

  /**
   * 🎯 Readiness score (0-100)
   */
  _computeReadinessScore(context) {
    let score = 50;

    // Progress influence
    score += (context.progress?.completionRate || 0) * 0.3;

    // Engagement influence
    score += (context.engagement?.watchTimeRatio || 0) * 30;

    // Drop-off penalty
    score -= (context.engagement?.dropOffRate || 0) * 40;

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * ⚠️ Risk detection (drop, confusion, fatigue)
   */
  _detectRiskSignals(context) {
    const risks = [];

    if ((context.engagement?.dropOffRate || 0) > 0.6) {
      risks.push("high_dropout_risk");
    }

    if ((context.engagement?.replayCount || 0) > 5) {
      risks.push("content_confusion");
    }

    if ((context.engagement?.sessionTime || 0) < 60) {
      risks.push("low_attention_span");
    }

    return risks;
  }

  /**
   * 🧠 Learning style detection (heuristic baseline)
   */
  _detectLearningStyle(context) {
    const video = context.engagement?.videoPreference || 0;
    const text = context.engagement?.textPreference || 0;

    if (video > text) return "visual";
    if (text > video) return "reading";
    return "mixed";
  }

  _estimateDifficultyTolerance(context) {
    return context.progress?.avgSuccessRate > 0.8
      ? "high"
      : context.progress?.avgSuccessRate > 0.5
        ? "medium"
        : "low";
  }

  _estimateFocus(context) {
    const ratio = context.engagement?.watchTimeRatio || 0;

    if (ratio > 0.8) return "high";
    if (ratio > 0.5) return "medium";
    return "low";
  }

  _estimateMotivation(context) {
    const streak = context.progress?.learningStreak || 0;

    if (streak > 7) return "high";
    if (streak > 2) return "medium";
    return "low";
  }

  /**
   * 🔄 Safe fallback
   */
  _fallbackContext(userId, courseId) {
    return {
      context: null,
      insights: {
        learningStyle: "mixed",
        difficultyTolerance: "medium",
        focusLevel: "medium",
        motivationLevel: "medium"
      },
      readinessScore: 50,
      riskFlags: ["fallback_mode"],
      timestamp: Date.now()
    };
  }
}

module.exports = VideoTutorContextAnalyzer;
