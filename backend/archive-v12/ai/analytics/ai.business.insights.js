
/**
 * ========================
 * 🧠 AI BUSINESS INSIGHTS ENGINE
 * UniMentorAI SaaS Intelligence Layer
 * ========================
 * Converts raw analytics into actionable business intelligence
 */

class BusinessInsightsEngine {

  /**
   * ========================
   * 🚀 MAIN INSIGHT GENERATION
   * ========================
   */
  generate(context = {}) {

    const kpis = context.kpis || {};
    const growth = context.growth || {};
    const engagement = context.engagement || {};
    const health = context.health || {};

    const insights = [];

    // 📈 REVENUE INSIGHTS
    insights.push(...this.revenueInsights(kpis, growth));

    // 👥 USER INSIGHTS
    insights.push(...this.userInsights(kpis, engagement));

    // ⚠️ RISK INSIGHTS
    insights.push(...this.riskInsights(health, growth));

    // 🚀 OPPORTUNITY INSIGHTS
    insights.push(...this.opportunityInsights(kpis, growth));

    return {
      insights,
      score: this.computeBusinessScore(kpis, growth, engagement, health),
      recommendationLevel: this.recommendationLevel(kpis, growth),
      timestamp: new Date()
    };
  }

  /**
   * ========================
   * 📈 REVENUE INSIGHTS
   * ========================
   */
  revenueInsights(kpis, growth) {

    const insights = [];

    if (growth.revenueGrowth > 0.2) {
      insights.push({
        type: "positive",
        category: "revenue",
        message: "Strong revenue growth detected",
        impact: "high"
      });
    }

    if (kpis.totalRevenue < 100) {
      insights.push({
        type: "warning",
        category: "revenue",
        message: "Low revenue base — scaling required",
        impact: "medium"
      });
    }

    return insights;
  }

  /**
   * ========================
   * 👥 USER INSIGHTS
   * ========================
   */
  userInsights(kpis, engagement) {

    const insights = [];

    if (engagement.activeUsers < 50) {
      insights.push({
        type: "warning",
        category: "users",
        message: "Low active user engagement detected",
        impact: "high"
      });
    }

    if (engagement.avgEventsPerUser > 10) {
      insights.push({
        type: "positive",
        category: "users",
        message: "High user engagement per session",
        impact: "medium"
      });
    }

    return insights;
  }

  /**
   * ========================
   * ⚠️ RISK INSIGHTS
   * ========================
   */
  riskInsights(health, growth) {

    const insights = [];

    if (health.status === "degraded") {
      insights.push({
        type: "critical",
        category: "system",
        message: "System performance degradation detected",
        impact: "critical"
      });
    }

    if (growth.revenueGrowth < -0.1) {
      insights.push({
        type: "critical",
        category: "business",
        message: "Revenue decline detected",
        impact: "critical"
      });
    }

    return insights;
  }

  /**
   * ========================
   * 🚀 OPPORTUNITY INSIGHTS
   * ========================
   */
  opportunityInsights(kpis, growth) {

    const insights = [];

    if (kpis.ARPU > 20) {
      insights.push({
        type: "opportunity",
        category: "monetization",
        message: "High ARPU — upsell potential exists",
        impact: "high"
      });
    }

    if (growth.userGrowth > 0.15) {
      insights.push({
        type: "opportunity",
        category: "growth",
        message: "Strong user acquisition trend",
        impact: "high"
      });
    }

    return insights;
  }

  /**
   * ========================
   * 🧠 BUSINESS SCORE ENGINE
   * ========================
   */
  computeBusinessScore(kpis, growth, engagement, health) {

    let score = 50;

    if (growth.revenueGrowth > 0) score += 20;
    if (engagement.activeUsers > 100) score += 10;
    if (health.status === "healthy") score += 10;
    if (kpis.ARPU > 20) score += 10;

    return Math.min(score, 100);
  }

  /**
   * ========================
   * 🎯 RECOMMENDATION LEVEL
   * ========================
   */
  recommendationLevel(kpis, growth) {

    if (growth.revenueGrowth < 0) return "urgent";
    if (kpis.totalRevenue < 100) return "growth";
    if (kpis.ARPU > 50) return "scale";

    return "stable";
  }
}

module.exports = new BusinessInsightsEngine();
