
const router = require("express").Router();

const AlertController = require("./alert.controller");
const authMiddleware = require("../../auth/auth.middleware");

/**
 * ========================
 * 🚨 REAL-TIME ALERT ROUTES
 * UniMentorAI SaaS Observability Layer
 * ========================
 * API Gateway for AI alert system
 */

/**
 * ========================
 * 🚨 TRIGGER SINGLE ALERT
 * ========================
 */
router.post(
  "/trigger",
  authMiddleware,
  AlertController.trigger
);

/**
 * ========================
 * ⚡ TRIGGER BATCH ALERTS
 * ========================
 */
router.post(
  "/batch",
  authMiddleware,
  AlertController.batch
);

/**
 * ========================
 * 📊 SYSTEM STATISTICS
 * ========================
 */
router.get(
  "/stats",
  authMiddleware,
  AlertController.stats
);

/**
 * ========================
 * 🧠 HEALTH CHECK
 * ========================
 */
router.get(
  "/health",
  AlertController.health // public endpoint (monitoring friendly)
);

module.exports = router;
