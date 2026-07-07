/**
 * 🧠 AI ADMIN BRAIN CORE — FAST INTELLIGENCE LAYER (PRODUCTION)
 * Level: Stripe / OpenAI / Meta analytics engine style
 */

export class AiAdminBrainEngine {

  /* =========================
     🚀 MAIN ANALYTICS PIPELINE
  ========================= */
  static analyze({ users = [], payments = [], aiLogs = [], courses = [] }) {

    const growth = this.growth(users);
    const churn = this.churn(users);
    const revenue = this.revenue(payments);
    const ai = this.ai(aiLogs);

    const health = this.healthScore({ growth, churn, revenue, ai });

    return {
      timestamp: Date.now(),

      growth,
      churn,
      revenue,
      ai,
      courses: courses.length,

      // 🧠 SYSTEM INTELLIGENCE SCORE
      health,

      // 💡 BUSINESS SIGNALS
      signals: this.signals({ growth, churn, revenue })
    };
  }

  /* =========================
     📈 GROWTH ENGINE (OPTIMIZED LOOP)
  ========================= */
  static growth(users) {

    const now = Date.now();

    let newUsers = 0;
    const len = users.length;

    for (let i = 0; i < len; i++) {

      const created = new Date(users[i].createdAt || 0).getTime();

      if (now - created < 7 * 86400000) {
        newUsers++;
      }
    }

    const rate = len ? newUsers / len : 0;

    return {
      rate: Math.round(rate * 100),

      trend:
        rate > 0.25 ? "EXPLOSIVE"
        : rate > 0.1 ? "HEALTHY"
        : rate > 0.03 ? "SLOW"
        : "CRITICAL",

      momentum: Math.min(100, Math.round(rate * 400))
    };
  }

  /* =========================
     ⚠️ CHURN ENGINE (RETENTION CORE)
  ========================= */
  static churn(users) {

    const now = Date.now();

    let inactive = 0;
    const len = users.length;

    for (let i = 0; i < len; i++) {

      const lastLogin = new Date(users[i].lastLogin || 0).getTime();

      if (now - lastLogin > 14 * 86400000) {
        inactive++;
      }
    }

    const rate = len ? inactive / len : 0;

    return {
      rate: Math.round(rate * 100),

      risk:
        rate > 0.4 ? "CRITICAL"
        : rate > 0.25 ? "HIGH"
        : rate > 0.1 ? "MEDIUM"
        : "LOW",

      retentionScore: Math.max(0, Math.round(100 - rate * 100))
    };
  }

  /* =========================
     💰 REVENUE ENGINE (SAAS STYLE)
  ========================= */
  static revenue(payments) {

    let total = 0;
    const len = payments.length;

    for (let i = 0; i < len; i++) {
      total += payments[i].amount || 0;
    }

    const projection = total * 1.25;

    return {
      total,

      projection: Math.round(projection),

      trend:
        total > 1000 ? "STRONG"
        : total > 0 ? "STARTING"
        : "FLAT",

      avgPerTransaction: len ? Math.round(total / len) : 0
    };
  }

  /* =========================
     🤖 AI USAGE ENGINE
  ========================= */
  static ai(aiLogs) {

    return {
      usage: aiLogs.length,

      level:
        aiLogs.length > 500 ? "VERY_HIGH"
        : aiLogs.length > 200 ? "HIGH"
        : aiLogs.length > 50 ? "MEDIUM"
        : "LOW"
    };
  }

  /* =========================
     🧠 GLOBAL HEALTH SCORE (0–100)
  ========================= */
  static healthScore({ growth, churn, revenue, ai }) {

    let score = 50;

    // Growth impact
    if (growth.trend === "EXPLOSIVE") score += 25;
    if (growth.trend === "CRITICAL") score -= 20;

    // Churn impact
    if (churn.risk === "LOW") score += 15;
    if (churn.risk === "CRITICAL") score -= 30;

    // Revenue impact
    if (revenue.trend === "STRONG") score += 15;

    // AI engagement
    if (ai.level === "VERY_HIGH") score += 10;

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /* =========================
     💡 BUSINESS SIGNAL ENGINE
  ========================= */
  static signals({ growth, churn, revenue }) {

    const signals = [];

    if (churn.risk === "HIGH" || churn.risk === "CRITICAL") {
      signals.push({
        type: "RETENTION",
        priority: "CRITICAL",
        message: "User churn too high — activate retention strategy"
      });
    }

    if (growth.trend === "SLOW" || growth.trend === "CRITICAL") {
      signals.push({
        type: "GROWTH",
        priority: "HIGH",
        message: "Growth slowdown detected — boost acquisition"
      });
    }

    if (revenue.trend === "FLAT") {
      signals.push({
        type: "MONETIZATION",
        priority: "HIGH",
        message: "Revenue stagnation — optimize pricing"
      });
    }

    return signals;
  }
}

