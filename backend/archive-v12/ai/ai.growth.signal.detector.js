
const Payment = require("../models/payment.model");
const User = require("../models/user.model");

/**
 * ========================
 * 📡 AI GROWTH SIGNAL DETECTOR
 * UniMentorAI SaaS Intelligence Layer
 * ========================
 * Detects early signals of:
 * - Growth acceleration 🚀
 * - Stability ⚖️
 * - Decline ⚠️
 */

class AIGrowthSignalDetector {

  /**
   * ========================
   * 📊 GET REVENUE SNAPSHOTS
   * ========================
   */
  async getRevenueSnapshot(days = 30) {

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const result = await Payment.aggregate([
      {
        $match: {
          status: "completed",
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: "$amount" },
          transactions: { $sum: 1 }
        }
      }
    ]);

    return result[0] || { revenue: 0, transactions: 0 };
  }

  /**
   * ========================
   * 👤 GET USER SNAPSHOTS
   * ========================
   */
  async getUserSnapshot() {

    const totalUsers = await User.countDocuments();

    const activeUsers = await User.countDocuments({
      "subscription.status": "active"
    });

    const lastWeekUsers = await User.countDocuments({
      createdAt: {
        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    });

    return {
      totalUsers,
      activeUsers,
      newUsersLast7Days: lastWeekUsers
    };
  }

  /**
   * ========================
   * 📈 COMPARE PERIODS (GROWTH SIGNAL)
   * ========================
   */
  async comparePeriods() {

    const last7 = await this.getRevenueSnapshot(7);
    const last30 = await this.getRevenueSnapshot(30);

    const revenueGrowth =
      last30.revenue === 0
        ? 0
        : ((last7.revenue - (last30.revenue / 4)) / (last30.revenue / 4)) * 100;

    const transactionGrowth =
      last30.transactions === 0
        ? 0
        : ((last7.transactions - (last30.transactions / 4)) / (last30.transactions / 4)) * 100;

    return {
      revenueGrowth: Number(revenueGrowth.toFixed(2)),
      transactionGrowth: Number(transactionGrowth.toFixed(2))
    };
  }

  /**
   * ========================
   * 📡 DETECT GROWTH STATE
   * ========================
   */
  async detectGrowthState() {

    const [revenue7, revenue30, users, comparison] = await Promise.all([
      this.getRevenueSnapshot(7),
      this.getRevenueSnapshot(30),
      this.getUserSnapshot(),
      this.comparePeriods()
    ]);

    let state = "stable";
    let score = 50;

    // Revenue signals
    if (comparison.revenueGrowth > 20) score += 30;
    if (comparison.revenueGrowth > 50) state = "rapid_growth";

    if (comparison.revenueGrowth < -10) {
      score -= 30;
      state = "decline";
    }

    // User signals
    if (users.newUsersLast7Days > 50) score += 20;
    if (users.newUsersLast7Days < 5) score -= 20;

    // Active ratio
    const activeRatio = users.totalUsers
      ? (users.activeUsers / users.totalUsers) * 100
      : 0;

    if (activeRatio > 30) score += 20;
    if (activeRatio < 10) score -= 20;

    if (score >= 80) state = "explosive_growth";
    else if (score >= 60) state = "growth";
    else if (score >= 40) state = "stable";
    else state = "at_risk";

    return {
      state,
      score,
      metrics: {
        revenue7,
        revenue30,
        users,
        comparison,
        activeRatio: activeRatio.toFixed(2) + "%"
      }
    };
  }

  /**
   * ========================
   * 💡 AI GROWTH ACTION ENGINE
   * ========================
   */
  async getGrowthRecommendations() {

    const analysis = await this.detectGrowthState();

    let actions = [];

    switch (analysis.state) {

      case "explosive_growth":
        actions = [
          "🚀 Scale infrastructure immediately",
          "📈 Increase marketing budget",
          "🧠 Introduce premium pricing tiers"
        ];
        break;

      case "growth":
        actions = [
          "📊 Optimize conversion funnel",
          "📢 Increase acquisition campaigns",
          "💡 Improve onboarding experience"
        ];
        break;

      case "stable":
        actions = [
          "⚖️ Improve engagement features",
          "📚 Add new courses",
          "💰 Test pricing optimization"
        ];
        break;

      case "at_risk":
        actions = [
          "⚠️ Investigate churn causes",
          "🔧 Fix onboarding issues",
          "📉 Reduce acquisition costs"
        ];
        break;

      case "decline":
        actions = [
          "🚨 Emergency retention strategy",
          "💬 Re-engage inactive users",
          "🔍 Fix product-market fit issues"
        ];
        break;
    }

    return {
      analysis,
      actions
    };
  }

  /**
   * ========================
   * 🧠 FULL GROWTH REPORT
   * ========================
   */
  async getFullGrowthReport() {

    const data = await this.getGrowthRecommendations();

    return {
      timestamp: new Date(),
      ...data
    };
  }
}

module.exports = new AIGrowthSignalDetector();
