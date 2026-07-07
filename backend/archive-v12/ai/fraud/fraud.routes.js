
const express = require("express");
const router = express.Router();

const FraudController = require("./fraud.controller");

/**
 * ========================
 * 🚨 FRAUD DETECTION ROUTES
 * UniMentorAI SaaS Security Layer
 * ========================
 */

/**
 * ========================
 * 🔍 FULL FRAUD ANALYSIS
 * ========================
 * POST /api/fraud/analyze
 */
router.post("/analyze", (req, res) => {
  return FraudController.analyze(req, res);
});

/**
 * ========================
 * ⚡ QUICK RISK CHECK
 * ========================
 * POST /api/fraud/quick-check
 */
router.post("/quick-check", (req, res) => {
  return FraudController.quickCheck(req, res);
});

/**
 * ========================
 * 📡 HEALTH CHECK
 * ========================
 * GET /api/fraud/health
 */
router.get("/health", (req, res) => {
  return FraudController.health(req, res);
});

/**
 * ========================
 * 📊 API INFO / DISCOVERY
 * ========================
 * GET /api/fraud/info
 */
router.get("/info", (req, res) => {
  return res.status(200).json({
    service: "fraud-detection-engine",
    version: "1.0.0",
    status: "active",
    endpoints: [
      "/analyze",
      "/quick-check",
      "/health"
    ],
    capabilities: [
      "real_time_fraud_detection",
      "risk_scoring",
      "anomaly_detection",
      "rule_based_validation",
      "auto_response_actions"
    ],
    architecture: [
      "signals_engine",
      "rules_engine",
      "anomaly_detector",
      "risk_scorer",
      "response_engine"
    ],
    timestamp: new Date()
  });
});

module.exports = router;
