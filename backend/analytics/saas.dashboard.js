/**
 * =========================================
 * UniMentorAI - SAAS DASHBOARD V3
 * Analytics + Revenue Intelligence Layer
 * =========================================
 *
 * Features:
 * - Revenue KPIs
 * - AI usage metrics
 * - Cost vs profit estimation
 * - User activity tracking
 * - Stripe-ready dashboard API
 * =========================================
 */

import { getRevenueKPIs, getRevenueEvents } from "../billing/stripe.monetization.js";
import { getUsageKPIs, getUsageStats } from "../billing/stripe.usage.service.js";
import { getCostSummary } from "../ai/ai.cost.engine.js";

/* =========================
   GLOBAL SAAS DASHBOARD
========================= */
export function getSaaSDashboard() {
  const revenue = getRevenueKPIs();
  const usage = getUsageKPIs();

  // =========================
  // COST ESTIMATION (GLOBAL SIMULATION)
  // =========================
  const avgCost = getCostSummary({
    inputTokens: usage.totalTokens,
    outputTokens: usage.totalTokens * 0.5,
    plan: "PRO",
  });

  // =========================
  // PROFIT CALCULATION
  // =========================
  const profit = revenue.totalRevenue - avgCost.cost;

  return {
    timestamp: Date.now(),

    // =========================
    // REVENUE METRICS (STRIPE)
    // =========================
    revenue: {
      totalRevenue: revenue.totalRevenue,
      successPayments: revenue.successPayments,
      failedPayments: revenue.failedPayments,
      activeSubscriptions: revenue.activeSubscriptions,
      totalEvents: revenue.totalEvents,
    },

    // =========================
    // AI USAGE METRICS
    // =========================
    usage: {
      totalUsers: usage.totalUsers,
      totalRequests: usage.totalRequests,
      totalTokens: usage.totalTokens,
    },

    // =========================
    // COST & PROFIT ENGINE
    // =========================
    economics: {
      estimatedCost: avgCost.cost,
      estimatedRevenue: revenue.totalRevenue,
      profit,
      profitable: profit > 0,
    },
  };
}

/* =========================
   DETAILED ADMIN DASHBOARD
========================= */
export function getDetailedDashboard() {
  return {
    summary: getSaaSDashboard(),

    // raw data (admin only)
    revenueEvents: getRevenueEvents(),
    usageStats: getUsageStats(),
  };
}

/* =========================
   REAL-TIME KPI SNAPSHOT
========================= */
export function getKPISnapshot() {
  const dashboard = getSaaSDashboard();

  return {
    revenue: dashboard.revenue.totalRevenue,
    users: dashboard.usage.totalUsers,
    requests: dashboard.usage.totalRequests,
    profit: dashboard.economics.profit,
    status: dashboard.economics.profitable ? "PROFITABLE" : "LOSS",
  };
}
