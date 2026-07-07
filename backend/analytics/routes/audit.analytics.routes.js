import express from "express";
import { auditAnalyticsService } from "../services/audit.analytics.service.js";
// import { authMiddleware } from "FIX_REQUIRED_PATH";
// import { roleMiddleware } from "FIX_REQUIRED_PATH";

const router = express.Router();

/**
 * 🔐 MIDDLEWARE (OPTIONAL PRODUCTION)
 * router.use(authMiddleware);
 * router.use(roleMiddleware("ADMIN"));
 */

/**
 * 📊 FULL ANALYTICS SNAPSHOT (FAST DASHBOARD LOAD)
 */
router.get("/full", async (req, res) => {
  try {
    const data = await auditAnalyticsService.getFullAnalytics();
    res.json({ success: true, data });
  } catch (error) {
    console.error("[ANALYTICS_FULL_ERROR]", error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

/**
 * 📈 GLOBAL STATS
 */
router.get("/stats", async (req, res) => {
  try {
    const data = await auditAnalyticsService.getStats();
    res.json({ success: true, data });
  } catch (error) {
    console.error("[ANALYTICS_STATS_ERROR]", error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

/**
 * 📊 ACTION DISTRIBUTION
 */
router.get("/actions", async (req, res) => {
  try {
    const data = await auditAnalyticsService.getActionDistribution();
    res.json({ success: true, data });
  } catch (error) {
    console.error("[ANALYTICS_ACTIONS_ERROR]", error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

/**
 * 📅 ACTIVITY TIMELINE
 */
router.get("/timeline", async (req, res) => {
  try {
    const data = await auditAnalyticsService.getActivityTimeline();
    res.json({ success: true, data });
  } catch (error) {
    console.error("[ANALYTICS_TIMELINE_ERROR]", error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

/**
 * 🌍 HEATMAP ACTIVITY
 */
router.get("/heatmap", async (req, res) => {
  try {
    const data = await auditAnalyticsService.getActivityHeatmap();
    res.json({ success: true, data });
  } catch (error) {
    console.error("[ANALYTICS_HEATMAP_ERROR]", error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

export default router;
