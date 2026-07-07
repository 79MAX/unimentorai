
const express = require("express");
const router = express.Router();

const ForecastController = require("./forecast.controller");

/**
 * ========================
 * 📊 FORECAST ROUTES
 * UniMentorAI SaaS Intelligence Layer
 * ========================
 */

/**
 * ========================
 * 🚀 MAIN PREDICTION ROUTE
 * ========================
 * POST /api/forecast/predict
 */
router.post("/predict", (req, res) => {
  return ForecastController.predict(req, res);
});

/**
 * ========================
 * 📊 BATCH PREDICTION ROUTE
 * ========================
 * POST /api/forecast/batch
 */
router.post("/batch", (req, res) => {
  return ForecastController.batchPredict(req, res);
});

/**
 * ========================
 * 🧠 HEALTH CHECK ROUTE
 * ========================
 * GET /api/forecast/health
 */
router.get("/health", (req, res) => {
  return ForecastController.health(req, res);
});

/**
 * ========================
 * 📡 SYSTEM INFO ROUTE
 * ========================
 * GET /api/forecast/info
 */
router.get("/info", (req, res) => {
  return res.status(200).json({
    service: "ai-revenue-forecast-engine",
    version: "1.0.0",
    status: "active",
    features: [
      "revenue_prediction",
      "trend_analysis",
      "pattern_detection",
      "risk_scoring",
      "confidence_engine"
    ],
    timestamp: new Date()
  });
});

module.exports = router;
