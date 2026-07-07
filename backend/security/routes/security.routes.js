import express from "express";

import securityAnalyzerService from "../services/security.analyzer.service.js";
import securityAlertService from "../services/security.alert.service.js";

// Adapte les chemins selon ton projet
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";

const router = express.Router();

/**
 * ==========================================
 * SECURITY ROUTES V2
 * UniMentorAI Security Center
 * ==========================================
 */

/**
 * Toutes les routes sécurité :
 * ADMIN uniquement
 */
router.use(authMiddleware);

router.use(
  roleMiddleware([
    "ADMIN",
    "SUPER_ADMIN",
  ])
);

/**
 * ------------------------------------------------
 * GET USER RISK SCORE
 * ------------------------------------------------
 */
router.get(
  "/risk/user/:userId",
  async (req, res) => {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message:
            "userId is required",
        });
      }

      const result =
        await securityAnalyzerService.analyzeUser(
          userId
        );

      return res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error(
        "[SECURITY_USER_RISK]",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to analyze user risk",
      });
    }
  }
);

/**
 * ------------------------------------------------
 * GET IP RISK SCORE
 * ------------------------------------------------
 */
router.get(
  "/risk/ip/:ip",
  async (req, res) => {
    try {
      const { ip } = req.params;

      const result =
        await securityAnalyzerService.analyzeIp(
          ip
        );

      return res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error(
        "[SECURITY_IP_RISK]",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to analyze IP risk",
      });
    }
  }
);

/**
 * ------------------------------------------------
 * MANUAL USER EVALUATION
 * ------------------------------------------------
 */
router.post(
  "/evaluate/:userId",
  async (req, res) => {
    try {
      const { userId } =
        req.params;

      const result =
        await securityAlertService.evaluateUser(
          userId
        );

      return res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error(
        "[SECURITY_EVALUATE]",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Evaluation failed",
      });
    }
  }
);

/**
 * ------------------------------------------------
 * TOP RISK USERS
 * ------------------------------------------------
 */
router.get(
  "/top-risk-users",
  async (req, res) => {
    try {
      const limit =
        Number(req.query.limit) ||
        20;

      const data =
        await securityAnalyzerService.getTopRiskUsers(
          limit
        );

      return res.json({
        success: true,
        data,
      });
    } catch (error) {
      console.error(
        "[SECURITY_TOP_USERS]",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to load top risk users",
      });
    }
  }
);

/**
 * ------------------------------------------------
 * HEALTH CHECK
 * ------------------------------------------------
 */
router.get(
  "/health",
  (req, res) => {
    res.json({
      success: true,
      service:
        "security-monitoring",
      status: "healthy",
      timestamp:
        new Date(),
    });
  }
);

export default router;
