import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { roleMiddleware } from "../../middlewares/role.middleware.js";
import { auditService } from "../../services/audit.service.js";

const router = express.Router();

/**
 * 🔐 GLOBAL SECURITY LAYER
 */
router.use(authMiddleware);
router.use(roleMiddleware("admin", "superadmin"));

/**
 * 📊 GET RECENT AUDIT LOGS (PAGINATED)
 */
router.get("/recent", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;

    const logs = await auditService.getRecent(limit);

    return res.json({
      success: true,
      data: logs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "FAILED_TO_FETCH_AUDIT_LOGS",
    });
  }
});

/**
 * 🔍 FILTER AUDIT LOGS
 * query params:
 * - action
 * - userId
 * - targetId
 * - status
 */
router.get("/search", async (req, res) => {
  try {
    const { action, userId, targetId, status } = req.query;

    const query = {};

    if (action) query.action = action;
    if (userId) query.userId = userId;
    if (targetId) query.targetId = targetId;
    if (status) query.status = status;

    const logs = await auditService.filter(query);

    return res.json({
      success: true,
      data: logs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "AUDIT_SEARCH_FAILED",
    });
  }
});

/**
 * 📊 SIMPLE STATS (OPTION FUTURE DASHBOARD)
 */
router.get("/stats", async (req, res) => {
  try {
    const logs = await auditService.getRecent(1000);

    const stats = {
      total: logs.length,
      success: logs.filter(l => l.status === "SUCCESS").length,
      failed: logs.filter(l => l.status === "FAILED").length,
    };

    return res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "AUDIT_STATS_FAILED",
    });
  }
});

export default router;
