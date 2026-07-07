/**
 * ==========================================
 * 🧠 DIAGNOSIS ROUTES
 * UniMentorAI Self-Healing Layer
 * ==========================================
 */

const express = require("express");
const router = express.Router();

const DiagnosisController = require("./diagnosis.controller");

/**
 * ==========================================
 * SYSTEM DIAGNOSIS
 * ==========================================
 */

/**
 * Full diagnosis
 * POST /api/v1/diagnosis/analyze
 */
router.post(
  "/analyze",
  DiagnosisController.analyze
);

/**
 * Diagnosis summary
 * POST /api/v1/diagnosis/summary
 */
router.post(
  "/summary",
  DiagnosisController.summary
);

/**
 * Service health
 * GET /api/v1/diagnosis/health
 */
router.get(
  "/health",
  DiagnosisController.health
);

/**
 * Readiness probe (Kubernetes / Docker)
 * GET /api/v1/diagnosis/ready
 */
router.get(
  "/ready",
  (req, res) => {
    res.status(200).json({
      success: true,
      service: "diagnosis-engine",
      status: "ready",
      timestamp: new Date().toISOString()
    });
  }
);

/**
 * Liveness probe (Kubernetes)
 * GET /api/v1/diagnosis/live
 */
router.get(
  "/live",
  (req, res) => {
    res.status(200).json({
      success: true,
      service: "diagnosis-engine",
      status: "alive",
      timestamp: new Date().toISOString()
    });
  }
);

module.exports = router;
