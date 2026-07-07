/**
 * VIDEO TUTOR INSIGHTS GENERATOR - UniMentorAI
 * Converts raw analytics into actionable learning & business insights
 */

class VideoTutorInsightsGenerator {
  constructor({ logger }) {
    this.logger = logger;
  }

  /**
   * 🎯 Main entry: generate insights from analytics batch
   */
  generate(events = []) {
    try {
      const aggregated = this._aggregate(events);

      const insights = this._deriveInsights(aggregated);

      const recommendations = this._generateRecommendations(insights);

      return {
        insights,
        recommendations,
        summary: this._generateSummary(aggregated)
      };

    } catch (error) {
      this.logger.error("InsightsGenerator error", error);

      return {
        insights: [],
        recommendations: [],
        summary: "insight_generation_failed"
      };
    }
  }

  /**
   * 📊 Aggregate raw events into structured metrics
   */
  _aggregate(events) {
    return {
      totalEvents: events.length,
      engagementCount: events.filter(e => e.type.includes("interaction")).length,
      dropoffCount: events.filter(e => ["pause_long", "exit_video", "skip"].includes(e.type)).length,
      completionCount: events.filter(e => e.type === "lesson_complete").length,
      attentionLow: events.filter(e => e.type === "low_attention").length
    };
  }

  /**
   * 🧠 Derive high-level insights
   */
  _deriveInsights(data) {
    const insights = [];

    const engagementRate = data.totalEvents
      ? data.engagementCount / data.totalEvents
      : 0;

    const dropoutRate = data.totalEvents
      ? data.dropoffCount / data.totalEvents
      : 0;

    const completionRate = data.totalEvents
      ? data.completionCount / data.totalEvents
      : 0;

    // 📉 Dropout insight
    if (dropoutRate > 0.3) {
      insights.push({
        type: "high_dropout_risk",
        severity: "critical",
        meaning: "Le contenu provoque de l’abandon"
      });
    }

    // 📊 Engagement insight
    if (engagementRate > 0.6) {
      insights.push({
        type: "high_engagement",
        severity: "positive",
        meaning: "Le contenu est engageant"
      });
    }

    // 🎯 Completion insight
    if (completionRate < 0.4) {
      insights.push({
        type: "low_completion",
        severity: "warning",
        meaning: "Le parcours est trop difficile ou long"
      });
    }

    // 🧠 Attention issue
    if (data.attentionLow > 5) {
      insights.push({
        type: "attention_problem",
        severity: "warning",
        meaning: "Perte d’attention fréquente"
      });
    }

    return insights;
  }

  /**
   * 🚀 Generate actionable recommendations
   */
  _generateRecommendations(insights) {
    const recommendations = [];

    insights.forEach(insight => {
      switch (insight.type) {

        case "high_dropout_risk":
          recommendations.push({
            action: "simplify_content",
            impact: "high",
            reason: "Reduce cognitive load"
          });
          break;

        case "low_completion":
          recommendations.push({
            action: "shorten_lessons",
            impact: "high",
            reason: "Improve course structure"
          });
          break;

        case "attention_problem":
          recommendations.push({
            action: "inject_interaction",
            impact: "medium",
            reason: "Add quizzes or breaks"
          });
          break;

        case "high_engagement":
          recommendations.push({
            action: "increase_difficulty",
            impact: "medium",
            reason: "User is ready for advanced content"
          });
          break;
      }
    });

    return recommendations;
  }

  /**
   * 🧾 Generate human-readable summary
   */
  _generateSummary(data) {
    return {
      overview: `Analyse de ${data.totalEvents} événements`,
      engagement: data.engagementCount,
      dropoffs: data.dropoffCount,
      completions: data.completionCount
    };
  }
}

module.exports = VideoTutorInsightsGenerator;
