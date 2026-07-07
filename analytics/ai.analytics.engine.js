/* =========================
   🧠 AI ANALYTICS ENGINE
   UniMentorAI - ENTERPRISE INTELLIGENCE CORE
========================= */

import { getBillingLogs } from "../logs/billing.logs.js";

export class AIAnalyticsEngine {

  /* =========================
     ⚙️ INTERNAL CACHE (PERF BOOST)
  ========================= */
  static _cache = null;
  static _lastUpdate = null;

  static getLogs() {

    const now = Date.now();

    /* refresh cache every 10s */
    if (!this._cache || (now - this._lastUpdate > 10000)) {
      this._cache = getBillingLogs();
      this._lastUpdate = now;
    }

    return this._cache;
  }

  /* =========================
     💰 REVENUE INSIGHTS (ENTERPRISE METRICS)
  ========================= */
  static revenueInsights() {

    const logs = this.getLogs();

    const success = logs.filter(l => l.status === "SUCCESS");

    const totalRevenue = success.reduce(
      (sum, l) => sum + Number(l.amount || 0),
      0
    );

    const avgTransaction = success.length
      ? totalRevenue / success.length
      : 0;

    return {
      totalRevenue,
      totalTransactions: success.length,
      avgTransaction,
      successRate: this.successRate(logs)
    };
  }

  /* =========================
     📊 SUCCESS RATE (IMPROVED)
  ========================= */
  static successRate(logs = this.getLogs()) {

    if (!logs.length) return 0;

    const success = logs.filter(l => l.status === "SUCCESS").length;

    return Math.round((success / logs.length) * 100);
  }

  /* =========================
     📈 GROWTH TREND (IMPROVED AI MODEL)
  ========================= */
  static growthTrend() {

    const logs = this.getLogs();

    const success = logs.filter(l => l.status === "SUCCESS");

    const now = new Date();
    const today = now.toISOString().slice(0, 10);

    /* =========================
       📅 TODAY REVENUE
    ========================= */
    const todayRevenue = success
      .filter(l => l.createdAt?.startsWith(today))
      .reduce((sum, l) => sum + Number(l.amount || 0), 0);

    /* =========================
       📅 LAST PERIOD REVENUE
    ========================= */
    const lastPeriodRevenue = success
      .slice(-50)
      .reduce((sum, l) => sum + Number(l.amount || 0), 0);

    /* =========================
       🧠 SIMPLE AI TREND MODEL
    ========================= */
    const trend = todayRevenue >= lastPeriodRevenue ? "UP" : "DOWN";

    const confidence = Math.min(
      0.95,
      Math.abs(todayRevenue - lastPeriodRevenue) /
      (lastPeriodRevenue || 1)
    );

    return {
      trend,
      confidence: Number(confidence.toFixed(2)),
      todayRevenue,
      lastPeriodRevenue
    };
  }

  /* =========================
     📊 PROVIDER BREAKDOWN (NEW)
  ========================= */
  static revenueByProvider() {

    const logs = this.getLogs();

    const success = logs.filter(l => l.status === "SUCCESS");

    const map = {};

    for (const log of success) {

      const provider = log.provider || "UNKNOWN";

      map[provider] =
        (map[provider] || 0) + Number(log.amount || 0);
    }

    return map;
  }

  /* =========================
     📊 FULL DASHBOARD AI RESPONSE
  ========================= */
  static dashboardAI() {

    return {
      revenue: this.revenueInsights(),
      growth: this.growthTrend(),
      providers: this.revenueByProvider(),
      successRate: this.successRate()
    };
  }
}
