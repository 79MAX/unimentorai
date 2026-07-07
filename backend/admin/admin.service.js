/**
 * 🏢 ADMIN SERVICE — UNIMENTORAI (PRODUCTION CORE)
 * AI-powered SaaS aggregation layer (Stripe / Meta style)
 */

import { AiAdminBrainEngine } from "../ai/ai_admin_brain.engine.js";

export class AdminService {

  /* =========================
     🧠 SAFE DATA EXTRACTOR
  ========================= */
  static extract(db = {}) {

    return {
      users: Array.isArray(db.users) ? db.users : [],
      payments: Array.isArray(db.payments) ? db.payments : [],
      aiLogs: Array.isArray(db.ai_logs) ? db.ai_logs : [],
      courses: Array.isArray(db.courses) ? db.courses : []
    };
  }

  /* =========================
     🚀 MAIN DASHBOARD ENGINE
  ========================= */
  static getDashboardData(db, options = {}) {

    try {

      const { users, payments, aiLogs, courses } = this.extract(db);

      // 🧠 AI BRAIN PROCESSING LAYER
      const growth = AiAdminBrainEngine.predictGrowth(users);
      const revenue = AiAdminBrainEngine.predictRevenue(payments);
      const engagement = AiAdminBrainEngine.analyzeEngagement(aiLogs, courses);
      const churn = AiAdminBrainEngine.detectChurn(users);

      // 📊 SYSTEM HEALTH ENGINE
      const system = this.getSystemHealth({ users, payments, aiLogs, courses });

      return {

        timestamp: Date.now(),

        // 📊 CORE METRICS (AI POWERED)
        users: growth,
        revenue,
        ai: engagement,
        churn,

        // 🧠 SYSTEM STATUS
        system,

        // 📡 METADATA (MULTI-TENANT READY)
        meta: {
          tenantId: options.tenantId || "global",
          generatedAt: Date.now(),
          mode: "AI_POWERED"
        }
      };

    } catch (error) {

      console.error("ADMIN_SERVICE_ERROR:", error.message);

      // 🧠 FAILSAFE MODE (NEVER BREAK DASHBOARD)
      return {
        timestamp: Date.now(),
        users: {},
        revenue: {},
        ai: {},
        system: {
          status: "DEGRADED",
          error: error.message
        }
      };
    }
  }

  /* =========================
     🧠 SYSTEM HEALTH ENGINE
  ========================= */
  static getSystemHealth({ users, payments, aiLogs, courses }) {

    const health = {
      users: Array.isArray(users),
      payments: Array.isArray(payments),
      aiLogs: Array.isArray(aiLogs),
      courses: Array.isArray(courses)
    };

    const healthy = Object.values(health).every(Boolean);

    return {

      status: healthy ? "HEALTHY" : "DEGRADED",

      services: health,

      score: healthy ? 100 : 60,

      uptime: typeof process !== "undefined"
        ? process.uptime()
        : null
    };
  }

  /* =========================
     ⚡ QUICK STATS (FOR UI CARDS)
  ========================= */
  static getQuickStats(db) {

    const { users, payments } = this.extract(db);

    return {
      totalUsers: users.length,

      activeUsers: users.filter(u =>
        Date.now() - new Date(u.lastLogin || 0).getTime() < 7 * 86400000
      ).length,

      totalRevenue: payments
        .filter(p => p.status === "SUCCESS")
        .reduce((sum, p) => sum + (p.amount || 0), 0)
    };
  }
}

