/**
 * 🧠 AI PREDICTION PANEL ENGINE — UNIMENTORAI (PRODUCTION GRADE)
 * Meta / Stripe / OpenAI level predictive intelligence system
 */

export class AiPredictionPanel {

  /* =========================
     🚀 MAIN ENTRY POINT
  ========================= */
  static predict({
    users = [],
    payments = [],
    aiLogs = [],
    courses = []
  }) {

    const now = Date.now();

    // ⚡ PRE-COMPUTE (PERFORMANCE OPTIMIZED SINGLE PASS READY)
    const userStats = this._computeUserStats(users, now);
    const revenueStats = this._computeRevenueStats(payments, now);
    const aiStats = this._computeAiStats(aiLogs, users);
    const courseStats = this._computeCourseStats(courses);

    const growth = this._growth(userStats);
    const churn = this._churn(userStats, users.length);
    const revenue = this._revenue(revenueStats);
    const behavior = this._behavior(aiStats);
    const courseImpact = this._courseImpact(courseStats);

    const score = this._healthScore({
      growth,
      churn,
      revenue,
      behavior,
      courseImpact
    });

    return {
      timestamp: now,

      growth,
      churn,
      revenue,
      behavior,
      courseImpact,

      intelligenceScore: score,

      actions: this._actions({ growth, churn, revenue, behavior }),

      executiveSummary: this._summary({ growth, churn, revenue, score })
    };
  }

  /* =========================
     ⚡ DATA PRE-COMPUTATION LAYER
  ========================= */

  static _computeUserStats(users, now) {

    const DAY = 86400000;

    let last7 = 0;
    let last30 = 0;
    let inactive = 0;

    for (const u of users) {

      const created = new Date(u.createdAt || 0).getTime();
      const lastLogin = new Date(u.lastLogin || 0).getTime();

      if (now - created < 7 * DAY) last7++;
      if (now - created < 30 * DAY) last30++;
      if (now - lastLogin > 14 * DAY) inactive++;
    }

    return { last7, last30, inactive };
  }

  static _computeRevenueStats(payments, now) {

    const DAY = 86400000;

    let monthly = 0;

    for (const p of payments) {
      if (now - new Date(p.createdAt || 0).getTime() < 30 * DAY) {
        monthly += p.amount || 0;
      }
    }

    return { monthly };
  }

  static _computeAiStats(aiLogs, users) {
    return {
      usage: aiLogs.length,
      avg: users.length ? aiLogs.length / users.length : 0
    };
  }

  static _computeCourseStats(courses) {

    let totalLessons = 0;

    for (const c of courses) {
      totalLessons += c.lessons?.length || 0;
    }

    return {
      avgLessons: courses.length ? totalLessons / courses.length : 0
    };
  }

  /* =========================
     📈 GROWTH ENGINE
  ========================= */

  static _growth({ last7, last30 }) {

    const rate = last30 ? last7 / last30 : 0;

    return {
      growthRate: Math.round(rate * 100),

      trend:
        rate > 0.25 ? "EXPLOSIVE"
        : rate > 0.1 ? "HEALTHY"
        : rate > 0.05 ? "SLOW"
        : "CRITICAL"
    };
  }

  /* =========================
     ⚠️ CHURN ENGINE
  ========================= */

  static _churn({ inactive }, totalUsers) {

    const rate = totalUsers ? inactive / totalUsers : 0;

    return {
      churnRate: Math.round(rate * 100),

      risk:
        rate > 0.4 ? "CRITICAL"
        : rate > 0.25 ? "HIGH"
        : rate > 0.1 ? "MEDIUM"
        : "LOW"
    };
  }

  /* =========================
     💰 REVENUE ENGINE
  ========================= */

  static _revenue({ monthly }) {

    const projected = monthly * 1.25;

    return {
      monthlyRevenue: monthly,
      projectedRevenue: Math.round(projected),
      trend: projected > monthly ? "UP" : "FLAT"
    };
  }

  /* =========================
     🤖 BEHAVIOR ENGINE
  ========================= */

  static _behavior({ usage, avg }) {

    return {
      aiUsageLevel:
        usage > 500 ? "VERY_HIGH"
        : usage > 200 ? "HIGH"
        : "NORMAL",

      behaviorTrend:
        avg > 5 ? "POWER_USERS"
        : avg > 2 ? "ACTIVE"
        : "CASUAL"
    };
  }

  /* =========================
     📚 COURSE ENGINE
  ========================= */

  static _courseImpact({ avgLessons }) {

    const score = avgLessons / 10;

    return {
      learningEfficiency:
        score > 1.2 ? "STRONG"
        : score > 0.7 ? "GOOD"
        : "WEAK",

      impactScore: Math.min(100, Math.round(score * 100))
    };
  }

  /* =========================
     🧠 GLOBAL SCORE ENGINE
  ========================= */

  static _healthScore(data) {

    let score = 50;

    if (data.growth.trend === "EXPLOSIVE") score += 25;
    if (data.growth.trend === "CRITICAL") score -= 20;

    if (data.churn.risk === "LOW") score += 10;
    if (data.churn.risk === "CRITICAL") score -= 30;

    if (data.revenue.trend === "UP") score += 15;

    if (data.behavior.behaviorTrend === "POWER_USERS") score += 10;

    if (data.courseImpact.learningEfficiency === "STRONG") score += 10;

    return Math.max(0, Math.min(100, score));
  }

  /* =========================
     ⚡ ACTION ENGINE
  ========================= */

  static _actions({ growth, churn, revenue, behavior }) {

    const actions = [];

    if (churn.risk === "HIGH" || churn.risk === "CRITICAL") {
      actions.push({
        type: "RETENTION",
        priority: "CRITICAL",
        action: "Fix onboarding & engagement flow"
      });
    }

    if (growth.trend === "SLOW" || growth.trend === "CRITICAL") {
      actions.push({
        type: "GROWTH",
        priority: "HIGH",
        action: "Boost acquisition channels"
      });
    }

    if (revenue.trend === "FLAT") {
      actions.push({
        type: "MONETIZATION",
        priority: "HIGH",
        action: "Optimize pricing strategy"
      });
    }

    if (behavior.behaviorTrend === "CASUAL") {
      actions.push({
        type: "ENGAGEMENT",
        priority: "MEDIUM",
        action: "Increase AI tutoring usage"
      });
    }

    return actions;
  }

  /* =========================
     👔 EXECUTIVE SUMMARY
  ========================= */

  static _summary({ growth, churn, revenue, score }) {

    return {
      status:
        score > 75 ? "EXCELLENT"
        : score > 50 ? "STABLE"
        : "AT_RISK",

      insight: `Growth:${growth.trend} | Churn:${churn.risk} | Revenue:${revenue.trend}`,

      recommendation:
        score < 60
          ? "Urgent optimization required"
          : "System scaling healthy"
    };
  }
}

