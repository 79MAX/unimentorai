/**
 * VIDEO TUTOR ANALYTICS ENGINE - UniMentorAI
 * Central analytics & intelligence layer for Tutor system
 */

class VideoTutorAnalyticsEngine {
  constructor({ logger, db }) {
    this.logger = logger;
    this.db = db;
  }

  /**
   * 🎯 Main entry: track any tutor event
   */
  async track(event) {
    try {
      const normalized = this._normalize(event);

      const enriched = this._enrich(normalized);

      const insights = this._generateInsights(enriched);

      await this._store(enriched, insights);

      return {
        success: true,
        insights
      };

    } catch (error) {
      this.logger.error("AnalyticsEngine error", error);

      return {
        success: false,
        error: "analytics_failure"
      };
    }
  }

  /**
   * ⚙️ Normalize incoming event
   */
  _normalize(event) {
    return {
      type: event.type,
      userId: event.userId,
      courseId: event.courseId,
      videoId: event.videoId,
      timestamp: event.timestamp || Date.now(),
      payload: event.payload || {}
    };
  }

  /**
   * 🧠 Enrich event with derived metrics
   */
  _enrich(event) {
    return {
      ...event,

      derived: {
        hourOfDay: new Date(event.timestamp).getHours(),
        isEngagementEvent: this._isEngagement(event.type),
        isDropoffSignal: this._isDropoff(event.type),
        intensityScore: this._computeIntensity(event)
      }
    };
  }

  /**
   * 📊 Detect engagement events
   */
  _isEngagement(type) {
    return [
      "play",
      "chat_interaction",
      "voice_interaction",
      "lesson_complete"
    ].includes(type);
  }

  /**
   * 📉 Detect dropoff signals
   */
  _isDropoff(type) {
    return [
      "pause_long",
      "content_skip",
      "exit_video",
      "low_attention"
    ].includes(type);
  }

  /**
   * ⚡ Compute intensity score
   */
  _computeIntensity(event) {
    if (event.type.includes("interaction")) return 1.0;
    if (event.type.includes("pause")) return 0.3;
    if (event.type.includes("skip")) return 0.2;
    return 0.5;
  }

  /**
   * 🧠 Generate business + learning insights
   */
  _generateInsights(event) {
    const insights = [];

    if (event.derived.isEngagementEvent) {
      insights.push("user_engaged");
    }

    if (event.derived.isDropoffSignal) {
      insights.push("risk_of_dropout");
    }

    if (event.derived.intensityScore > 0.8) {
      insights.push("high_interaction_user");
    }

    if (event.type === "lesson_complete") {
      insights.push("conversion_to_completion");
    }

    return {
      insights,
      score: this._computeOverallScore(event)
    };
  }

  /**
   * 📊 Global scoring engine (business KPI)
   */
  _computeOverallScore(event) {
    let score = 50;

    if (event.derived.isEngagementEvent) score += 20;
    if (event.derived.isDropoffSignal) score -= 25;
    if (event.derived.intensityScore > 0.8) score += 15;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * 💾 Store analytics data
   */
  async _store(event, insights) {
    await this.db.analytics.insert({
      ...event,
      insights
    });
  }
}

module.exports = VideoTutorAnalyticsEngine;
