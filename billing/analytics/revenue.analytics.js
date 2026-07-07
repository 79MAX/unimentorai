import { getBillingLogs } from "../logs/billing.logs.js";

/* =========================
   📊 ENTERPRISE REVENUE ANALYTICS
========================= */
export class RevenueAnalytics {

  /* =========================
     🧠 NORMALIZE SUCCESS LOGS
  ========================= */
  static getSuccessfulLogs() {

    return getBillingLogs().filter(
      log => log.status === "SUCCESS"
    );
  }

  /* =========================
     💰 TOTAL REVENUE
  ========================= */
  static getTotalRevenue() {

    return this.getSuccessfulLogs()
      .reduce(
        (sum, log) => sum + Number(log.amount || 0),
        0
      );
  }

  /* =========================
     📈 REVENUE BY PROVIDER
  ========================= */
  static revenueByProvider() {

    const grouped = {};

    for (const log of this.getSuccessfulLogs()) {

      const provider = log.provider || "UNKNOWN";

      if (!grouped[provider]) {
        grouped[provider] = {
          revenue: 0,
          transactions: 0
        };
      }

      grouped[provider].revenue += Number(log.amount || 0);
      grouped[provider].transactions += 1;
    }

    return grouped;
  }

  /* =========================
     🌍 REVENUE BY CURRENCY
  ========================= */
  static revenueByCurrency() {

    const grouped = {};

    for (const log of this.getSuccessfulLogs()) {

      const currency = log.currency || "USD";

      if (!grouped[currency]) {
        grouped[currency] = 0;
      }

      grouped[currency] += Number(log.amount || 0);
    }

    return grouped;
  }

  /* =========================
     📊 PAYMENT SUCCESS RATE
  ========================= */
  static successRate() {

    const logs = getBillingLogs();

    if (!logs.length) return 0;

    const successful = logs.filter(
      log => log.status === "SUCCESS"
    ).length;

    return Number(
      ((successful / logs.length) * 100)
        .toFixed(2)
    );
  }

  /* =========================
     ❌ FAILURE RATE
  ========================= */
  static failureRate() {

    const logs = getBillingLogs();

    if (!logs.length) return 0;

    const failed = logs.filter(
      log => log.status === "FAILED"
    ).length;

    return Number(
      ((failed / logs.length) * 100)
        .toFixed(2)
    );
  }

  /* =========================
     📅 DAILY REVENUE
  ========================= */
  static dailyRevenue() {

    const grouped = {};

    for (const log of this.getSuccessfulLogs()) {

      const date = new Date(log.createdAt)
        .toISOString()
        .split("T")[0];

      if (!grouped[date]) {
        grouped[date] = 0;
      }

      grouped[date] += Number(log.amount || 0);
    }

    return grouped;
  }

  /* =========================
     🏆 TOP PAYING USERS
  ========================= */
  static topCustomers(limit = 10) {

    const grouped = {};

    for (const log of this.getSuccessfulLogs()) {

      if (!log.email) continue;

      if (!grouped[log.email]) {
        grouped[log.email] = 0;
      }

      grouped[log.email] += Number(log.amount || 0);
    }

    return Object.entries(grouped)
      .map(([email, amount]) => ({
        email,
        amount
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, limit);
  }

  /* =========================
     📦 FULL DASHBOARD METRICS
  ========================= */
  static getDashboardMetrics() {

    const logs = getBillingLogs();

    return {
      totalRevenue: this.getTotalRevenue(),

      totalTransactions: logs.length,

      successfulTransactions:
        this.getSuccessfulLogs().length,

      successRate:
        this.successRate(),

      failureRate:
        this.failureRate(),

      revenueByProvider:
        this.revenueByProvider(),

      revenueByCurrency:
        this.revenueByCurrency(),

      generatedAt:
        new Date().toISOString()
    };
  }
}
