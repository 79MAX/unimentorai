/**
 * VIDEO TUTOR PERFORMANCE SCORER - UniMentorAI
 * Computes unified learning performance score for users
 */

class VideoTutorPerformanceScorer {
  constructor({ progressTracker, skillMapper, analytics, logger }) {
    this.progressTracker = progressTracker;
    this.skillMapper = skillMapper;
    this.analytics = analytics;
    this.logger = logger;
  }

  /**
   * 🎯 Main entry: compute performance score
   */
  async computeScore({ userId, courseId }) {
    try {
      const [progress, skillData] = await Promise.all([
        this.progressTracker.updateProgress({
          userId,
          courseId,
          videoId: null,
          event: { type: "performance_request" }
        }),
        this.skillMapper.mapUserSkills({ userId, courseId })
      ]);

      const score = this._calculateUnifiedScore(progress, skillData);

      const profile = this._buildPerformanceProfile(score, progress, skillData);

      await this._trackScore(userId, courseId, profile);

      return profile;

    } catch (error) {
      this.logger.error("PerformanceScorer error", error);
      return this._fallback();
    }
  }

  /**
   * 🧠 Unified scoring engine (core logic)
   */
  _calculateUnifiedScore(progress, skillData) {
    const completion = progress.metrics?.completionRate || 0;
    const engagement = progress.metrics?.engagementScore || 50;
    const mastery = skillData.mastery || 0;

    // Weighted model (EdTech industry standard approach)
    const score =
      completion * 0.35 +
      engagement * 0.35 +
      mastery * 0.30;

    return Math.round(Math.min(100, Math.max(0, score)));
  }

  /**
   * 📊 Build full performance profile
   */
  _buildPerformanceProfile(score, progress, skillData) {
    return {
      score,
      level: this._getLevel(score),
      trend: this._detectTrend(progress),
      risk: this._detectRisk(progress, skillData),
      recommendation: this._generateRecommendation(score, skillData),
      timestamp: Date.now()
    };
  }

  /**
   * 🏷️ Performance level classification
   */
  _getLevel(score) {
    if (score >= 85) return "excellent";
    if (score >= 65) return "good";
    if (score >= 40) return "average";
    return "weak";
  }

  /**
   * 📈 Detect learning trend
   */
  _detectTrend(progress) {
    const streak = progress.streak || 0;
    const completion = progress.metrics?.completionRate || 0;

    if (streak > 5 && completion > 70) return "improving";
    if (completion < 40) return "declining";
    return "stable";
  }

  /**
   * ⚠️ Risk detection engine
   */
  _detectRisk(progress, skillData) {
    const risks = [];

    if ((progress.metrics?.engagementScore || 0) < 40) {
      risks.push("low_engagement");
    }

    if ((skillData.mastery || 0) < 30) {
      risks.push("low_mastery");
    }

    if ((progress.metrics?.completionRate || 0) < 30) {
      risks.push("dropout_risk");
    }

    return risks;
  }

  /**
   * 🎯 Generate AI-driven recommendation
   */
  _generateRecommendation(score, skillData) {
    if (score >= 85) {
      return "Accelerate learning path and unlock advanced content";
    }

    if (score < 40) {
      return "Reinforce fundamentals and simplify content difficulty";
    }

    if ((skillData.gaps || []).length > 0) {
      return "Focus on skill gaps before progressing";
    }

    return "Maintain current learning pace";
  }

  /**
   * 📊 Analytics tracking
   */
  async _trackScore(userId, courseId, profile) {
    await this.analytics.track("performance_score", {
      userId,
      courseId,
      score: profile.score,
      level: profile.level,
      riskCount: profile.risk.length,
      timestamp: Date.now()
    });
  }

  /**
   * 🔄 Safe fallback
   */
  _fallback() {
    return {
      score: 50,
      level: "unknown",
      trend: "stable",
      risk: ["fallback_mode"],
      recommendation: "System temporarily unavailable"
    };
  }
}

module.exports = VideoTutorPerformanceScorer;
