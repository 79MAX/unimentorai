/**
 * 🧠 AI ADMIN BRAIN ENGINE — UNIMENTORAI (PRODUCTION GRADE)
 * Meta Intelligence Layer (Stripe / OpenAI / Meta-style analytics core)
 * Optimized for scale, accuracy & SaaS intelligence systems
 */

export class AiAdminBrainEngine {

  /* =========================
     🚀 MAIN ENTRY POINT
  ========================= */
  static analyze({
    users = [],
    payments = [],
    aiLogs = [],
    courses = []
  }) {

    const growth = this.predictGrowth(users);
    const churn = this.detectChurn(users);
    const revenue = this.predictRevenue(payments);
    const engagement = this.analyzeEngagement(aiLogs, courses);

    const healthScore = this.calculateHealthScore({
      growth,
      churn,
      revenue,
      engagement
    });

    return {
      timestamp: Date.now(),

      // 🧠 CORE INTELLIGENCE
      growth,
      churn,
      revenue,
      engagement,

      // 📊 GLOBAL SYSTEM HEALTH
      healthScore,

      // 💡 BUSINESS INTELLIGENCE SIGNALS
      signals: this.generateSignals({
        growth,
        churn,
        revenue,
        engagement,
        healthScore
      }),

      // 📈 EXECUTIVE INSIGHTS
      insight: this.generateInsight({
        growth,
        churn,
        revenue,
        healthScore
      })
    };
  }

  /* =========================
     📈 GROWTH ENGINE (OPTIMIZED)
  ========================= */
  static predictGrowth(users) {

    const now = Date.now();
    const len = users.length || 1;

    let newUsers7d = 0;

    for (let i = 0; i < len; i++) {
      const createdAt = users[i]?.createdAt;
      if (!createdAt) continue;

      if (now - new Date(createdAt).getTime() < 7 * 86400000) {
        newUsers7d++;
      }
    }

    const rate = newUsers7d / len;

    return {
      growthRate: Math.round(rate * 100),

      trend:
        rate > 0.25 ? "EXPLOSIVE"
        : rate > 0.12 ? "HEALTHY"
        : rate > 0.04 ? "SLOW"
        : "CRITICAL",

      momentumScore: Math.min(100, Math.round(rate * 450))
    };
  }

  /* =========================
     ⚠️ CHURN ENGINE (SaaS GRADE)
  ========================= */
  static detectChurn(users) {

    const now = Date.now();
    const len = users.length || 1;

    let inactive = 0;

    for (let i = 0; i < len; i++) {

      const lastLogin = users[i]?.lastLogin;
      if (!lastLogin) continue;

      if (now - new Date(lastLogin).getTime() > 14 * 86400000) {
        inactive++;
      }
    }

    const churnRate = inactive / len;

    return {
      churnRate: Math.round(churnRate * 100),

      risk:
        churnRate > 0.4 ? "CRITICAL"
        : churnRate > 0.25 ? "HIGH"
        : churnRate > 0.12 ? "MEDIUM"
        : "LOW",

      retentionScore: Math.max(
        0,
        Math.round(100 - churnRate * 100)
      )
    };
  }

  /* =========================
     💰 REVENUE ENGINE (SCALABLE)
  ========================= */
  static predictRevenue(payments) {

    let totalRevenue = 0;

    for (let i = 0; i < payments.length; i++) {
      totalRevenue += payments[i]?.amount || 0;
    }

    const monthlyProjection = totalRevenue * 1.25;

    return {
      totalRevenue,
      monthlyProjection: Math.round(monthlyProjection),

      trend:
        totalRevenue > 5000 ? "STRONG"
        : totalRevenue > 0 ? "STARTING"
        : "FLAT",

      avgRevenuePerTransaction: payments.length
        ? Math.round(totalRevenue / payments.length)
        : 0
    };
  }

  /* =========================
     🤖 ENGAGEMENT ENGINE
  ========================= */
  static analyzeEngagement(aiLogs, courses) {

    const aiUsage = aiLogs.length;
    const courseActivity = courses.length;

    const engagementLevel =
      aiUsage > 500 ? "VERY_HIGH"
      : aiUsage > 200 ? "HIGH"
      : aiUsage > 50 ? "MEDIUM"
      : "LOW";

    const learningScore = Math.min(
      100,
      Math.round((courseActivity * 2 + aiUsage) / 10)
    );

    return {
      aiUsage,
      courseActivity,
      engagementLevel,
      learningActivityScore: learningScore
    };
  }

  /* =========================
     🧠 HEALTH SCORE ENGINE
  ========================= */
  static calculateHealthScore({
    growth,
    churn,
    revenue,
    engagement
  }) {

    let score = 50;

    // Growth impact
    if (growth.trend === "EXPLOSIVE") score += 25;
    else if (growth.trend === "CRITICAL") score -= 25;

    // Churn impact
    if (churn.risk === "LOW") score += 15;
    else if (churn.risk === "CRITICAL") score -= 30;

    // Revenue impact
    if (revenue.trend === "STRONG") score += 15;

    // Engagement impact
    if (engagement.engagementLevel === "VERY_HIGH") score += 10;

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /* =========================
     💡 BUSINESS SIGNAL ENGINE
  ========================= */
  static generateSignals({
    growth,
    churn,
    revenue,
    engagement,
    healthScore
  }) {

    const signals = [];

    if (churn.risk === "HIGH" || churn.risk === "CRITICAL") {
      signals.push({
        type: "RETENTION",
        priority: "CRITICAL",
        message: "High churn detected — activate retention system"
      });
    }

    if (growth.trend === "SLOW" || growth.trend === "CRITICAL") {
      signals.push({
        type: "GROWTH",
        priority: "HIGH",
        message: "Growth slowdown — increase acquisition velocity"
      });
    }

    if (revenue.trend === "FLAT") {
      signals.push({
        type: "MONETIZATION",
        priority: "HIGH",
        message: "Revenue stagnation — optimize pricing strategy"
      });
    }

    if (engagement.engagementLevel === "LOW") {
      signals.push({
        type: "ENGAGEMENT",
        priority: "MEDIUM",
        message: "Low AI engagement — improve product interaction layer"
      });
    }

    if (healthScore < 40) {
      signals.push({
        type: "SYSTEM",
        priority: "CRITICAL",
        message: "Global system health is critical"
      });
    }

    return signals;
  }

  /* =========================
     📈 EXECUTIVE INSIGHT
  ========================= */
  static generateInsight({ growth, churn, revenue, healthScore }) {

    return {
      summary:
        `Growth: ${growth.trend} | Churn: ${churn.risk} | Revenue: ${revenue.trend}`,

      status:
        healthScore > 75 ? "EXCELLENT"
        : healthScore > 50 ? "STABLE"
        : "AT_RISK",

      recommendation:
        healthScore < 50
          ? "Immediate optimization required across growth & retention"
          : "System performing within acceptable range"
    };
  }
}

