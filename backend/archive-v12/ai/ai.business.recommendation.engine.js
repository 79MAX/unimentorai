
const Payment = require("../models/payment.model");
const User = require("../models/user.model");

/**
 * ========================
 * 💡 AI BUSINESS RECOMMENDATION ENGINE
 * UniMentorAI SaaS Decision Layer
 * ========================
 * Converts analytics into actionable business decisions
 */

class AIBusinessRecommendationEngine {

  /**
   * ========================
   * 📊 GET BASIC BUSINESS METRICS
   * ========================
   */
  async getMetrics() {

    const totalRevenue = await Payment.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const users = await User.countDocuments();

    const activeUsers = await User.countDocuments({
      "subscription.status": "active"
    });

    return {
      totalRevenue: totalRevenue[0]?.total || 0,
      users,
      activeUsers,
      conversionRate: users ? (activeUsers / users) * 100 : 0
    };
  }

  /**
   * ========================
   * 📈 ANALYZE BUSINESS HEALTH
   * ========================
   */
  async analyzeHealth() {

    const metrics = await this.getMetrics();

    let healthScore = 50; // base score
    let status = "neutral";

    // Revenue impact
    if (metrics.totalRevenue > 10000) healthScore += 20;
    if (metrics.totalRevenue < 1000) healthScore -= 20;

    // User base impact
    if (metrics.users > 1000) healthScore += 15;
    if (metrics.users < 100) healthScore -= 15;

    // Conversion impact
    if (metrics.conversionRate > 20) healthScore += 15;
    if (metrics.conversionRate < 5) healthScore -= 15;

    if (healthScore >= 80) status = "excellent";
    else if (healthScore >= 60) status = "good";
    else if (healthScore >= 40) status = "average";
    else status = "critical";

    return {
      healthScore,
      status,
      metrics
    };
  }

  /**
   * ========================
   * 💡 GENERATE ACTIONABLE RECOMMENDATIONS
   * ========================
   */
  async getRecommendations() {

    const analysis = await this.analyzeHealth();

    const recommendations = [];

    // Revenue logic
    if (analysis.metrics.totalRevenue < 5000) {
      recommendations.push({
        priority: "high",
        action: "Increase marketing budget",
        reason: "Low revenue detected"
      });
    }

    // Conversion logic
    if (analysis.metrics.conversionRate < 10) {
      recommendations.push({
        priority: "high",
        action: "Optimize pricing & onboarding funnel",
        reason: "Low conversion rate"
      });
    }

    // User growth logic
    if (analysis.metrics.users < 200) {
      recommendations.push({
        priority: "medium",
        action: "Launch acquisition campaigns",
        reason: "Weak user base growth"
      });
    }

    // Healthy system optimization
    if (analysis.status === "excellent") {
      recommendations.push({
        priority: "low",
        action: "Scale infrastructure & expand features",
        reason: "Strong business performance"
      });
    }

    return {
      health: analysis,
      recommendations
    };
  }

  /**
   * ========================
   * 🚀 STRATEGIC BUSINESS PLAN GENERATOR
   * ========================
   */
  async generateStrategy() {

    const data = await this.getRecommendations();

    let strategy = {
      focus: "",
      actions: []
    };

    if (data.health.status === "critical") {

      strategy.focus = "survival mode";

      strategy.actions = [
        "Fix conversion funnel immediately",
        "Reduce acquisition cost",
        "Improve onboarding UX"
      ];

    } else if (data.health.status === "average") {

      strategy.focus = "growth mode";

      strategy.actions = [
        "Increase marketing campaigns",
        "Improve course quality",
        "Introduce upselling system"
      ];

    } else {

      strategy.focus = "scale mode";

      strategy.actions = [
        "Scale ads aggressively",
        "Expand course catalog",
        "Add premium subscriptions"
      ];
    }

    return {
      ...data,
      strategy
    };
  }

  /**
   * ========================
   * 🧠 FULL AI BUSINESS REPORT
   * ========================
   */
  async getFullReport() {

    const strategy = await this.generateStrategy();

    return {
      timestamp: new Date(),
      ...strategy
    };
  }
}

module.exports = new AIBusinessRecommendationEngine();
