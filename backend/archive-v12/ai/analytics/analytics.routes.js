
const express = require("express");
const router = express.Router();

const AnalyticsController = require("./analytics.controller");

/**
 * ========================
 * 📊 ANALYTICS ROUTES
 * UniMentorAI SaaS Intelligence Layer
 * ========================
 */

/**
 * ========================
 * 🚀 DASHBOARD ANALYTICS
 * ========================
 * POST /api/analytics/dashboard
 */
router.post("/dashboard", (req, res) => {
  return AnalyticsController.getDashboard(req, res);
});

/**
 * ========================
 * 📡 COLLECT METRICS EVENT
 * ========================
 * POST /api/analytics/collect
 */
router.post("/collect", (req, res) => {
  return AnalyticsController.collectMetric(req, res);
});

/**
 * ========================
 * 📊 RAW ANALYTICS DATA
 * ========================
 * POST /api/analytics/data
 */
router.post("/data", (req, res) => {
  return AnalyticsController.getAnalytics(req, res);
});

/**
 * ========================
 * 🧠 BUSINESS INSIGHTS ONLY
 * ========================
 * POST /api/analytics/insights
 */
router.post("/insights", (req, res) => {
  return AnalyticsController.getInsights(req, res);
});

/**
 * ========================
 * 🚨 SYSTEM HEALTH
 * ========================
 * GET /api/analytics/health
 */
router.get("/health", (req, res) => {
  return AnalyticsController.health(req, res);
});

/**
 * ========================
 * 📡 API INFO / DISCOVERY
 * ========================
 * GET /api/analytics/info
 */
router.get("/info", (req, res) => {
  return res.status(200).json({
    service: "ai-analytics-engine",
    version: "1.0.0",
    status: "active",
    endpoints: [
      "/dashboard",
      "/collect",
      "/data",
      "/insights",
      "/health"
    ],
    capabilities: [
      "real_time_metrics",
      "business_intelligence",
      "ai_insights_generation",
      "system_monitoring"
    ],
    timestamp: new Date()
  });
});

module.exports = router;
