
const router = require("express").Router();

const RevenueController = require("./revenue.controller");
const authMiddleware = require("../auth/auth.middleware");

/**
 * ========================
 * 📊 REVENUE ANALYTICS ROUTES
 * UniMentorAI SaaS BI Layer
 * ========================
 * All routes are protected (admin-level recommended)
 */

// ========================
// 📊 FULL DASHBOARD
// ========================
router.get(
  "/dashboard",
  authMiddleware,
  RevenueController.getDashboard
);

// ========================
// 💰 TOTAL REVENUE
// ========================
router.get(
  "/total",
  authMiddleware,
  RevenueController.getTotalRevenue
);

// ========================
// 📆 MONTHLY REVENUE (MRR)
// ========================
router.get(
  "/monthly",
  authMiddleware,
  RevenueController.getMonthlyRevenue
);

// ========================
// 📚 TOP COURSES
// ========================
router.get(
  "/top-courses",
  authMiddleware,
  RevenueController.getTopCourses
);

// ========================
// 👤 USER STATS
// ========================
router.get(
  "/users",
  authMiddleware,
  RevenueController.getUserStats
);

module.exports = router;
