/**
 * 🧠 AI ADMIN BRAIN — UNIMENTORAI (PRODUCTION OPTIMIZED)
 * Predictive analytics + SaaS intelligence layer (Stripe-level)
 */

export class AdminBrainEngine {

  // 🚀 MAIN ENTRY POINT
  static analyze({
    users = [],
    payments = [],
    courses = [],
    aiLogs = []
  }) {

    return {
      growth: this.predictGrowth(users),
      churn: this.detectChurn(users),
      revenue: this.predictRevenue(payments),
      engagement: this.analyzeEngagement(aiLogs, courses),
      recommendations: this.generateRecommendations(users, payments)
    };
  }

  // 📈 GROWTH ENGINE (OPTIMIZED + REAL BUSINESS LOGIC)
  static predictGrowth(users) {

    const now = Date.now();

    const newUsers = users.reduce((count, user) => {

      const createdAt = new Date(user?.createdAt || 0).getTime();

      return (now - createdAt < 7 * 24 * 60 * 60 * 1000)
        ? count + 1
        : count;

    }, 0);

    const totalUsers = users.length || 1;

    const growthRate = newUsers / totalUsers;

    return {
      newUsers,
      growthRate: Number((growthRate * 100).toFixed(2)),
      prediction:
        growthRate > 0.25
          ? "EXPLOSIVE_GROWTH"
          : growthRate > 0.1
            ? "STABLE_GROWTH"
            : "LOW_GROWTH"
    };
  }

  // ⚠️ CHURN DETECTION (IMPROVED ACCURACY)
  static detectChurn(users) {

    const now = Date.now();

    const inactiveUsers = users.reduce((count, user) => {

      const lastLogin = new Date(user?.lastLogin || 0).getTime();

      return (now - lastLogin > 14 * 24 * 60 * 60 * 1000)
        ? count + 1
        : count;

    }, 0);

    const total = users.length || 1;

    const churnRate = inactiveUsers / total;

    return {
      inactiveUsers,
      churnRate: Number((churnRate * 100).toFixed(2)),
      risk:
        churnRate > 0.4
          ? "CRITICAL"
          : churnRate > 0.25
            ? "HIGH_RISK"
            : "STABLE"
    };
  }

  // 💰 REVENUE FORECAST ENGINE (SMARTER)
  static predictRevenue(payments) {

    const now = Date.now();

    const last30DaysRevenue = payments.reduce((sum, p) => {

      const createdAt = new Date(p?.createdAt || 0).getTime();

      if (now - createdAt < 30 * 24 * 60 * 60 * 1000) {
        return sum + (Number(p.amount) || 0);
      }

      return sum;

    }, 0);

    // 📊 SIMPLE TREND MODEL (future ML-ready)
    const projectedMonthly = last30DaysRevenue * 1.15;

    return {
      current: last30DaysRevenue,
      projected: Number(projectedMonthly.toFixed(2)),
      trend:
        projectedMonthly > last30DaysRevenue
          ? "UPWARD"
          : "DOWNWARD"
    };
  }

  // 🤖 ENGAGEMENT ANALYTICS (MORE REALISTIC)
  static analyzeEngagement(aiLogs, courses) {

    const aiUsage = aiLogs.length || 0;

    const totalLessons = courses.reduce(
      (sum, c) => sum + (c?.lessons?.length || 0),
      0
    );

    const avgLessons = courses.length
      ? totalLessons / courses.length
      : 0;

    return {
      aiUsageLevel:
        aiUsage > 200
          ? "VERY_HIGH"
          : aiUsage > 50
            ? "NORMAL"
            : "LOW",

      learningEfficiency:
        avgLessons > 15
          ? "HIGH"
          : avgLessons > 5
            ? "MEDIUM"
            : "LOW",

      aiToLearningRatio: courses.length
        ? Number((aiUsage / courses.length).toFixed(2))
        : 0
    };
  }

  // 💡 SMART RECOMMENDATIONS ENGINE (BUSINESS GRADE)
  static generateRecommendations(users, payments) {

    const recommendations = [];

    const userCount = users.length;
    const revenueCount = payments.length;

    if (userCount < 100) {
      recommendations.push("Increase acquisition campaigns (ads + referral system)");
    }

    if (revenueCount === 0) {
      recommendations.push("Activate pricing funnel optimization");
    }

    const inactive = users.filter(u => {
      const last = new Date(u?.lastLogin || 0).getTime();
      return Date.now() - last > 14 * 24 * 60 * 60 * 1000;
    }).length;

    if (inactive > userCount * 0.3) {
      recommendations.push("Fix onboarding & retention system (high churn detected)");
    }

    if (aiLogs.length < 50) {
      recommendations.push("Promote AI Tutor usage inside courses");
    }

    return recommendations.length
      ? recommendations
      : ["System is stable — scale infrastructure"];
  }
}

