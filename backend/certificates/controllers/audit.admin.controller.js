import { auditService } from "../../services/audit.service.js";

/**
 * 📊 GET RECENT AUDIT LOGS
 */
export const getRecentLogs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;

    const logs = await auditService.getRecent(limit);

    return res.json({
      success: true,
      data: logs,
    });
  } catch (error) {
    console.error("[AUDIT_CONTROLLER_RECENT_ERROR]", error.message);

    return res.status(500).json({
      success: false,
      message: "FAILED_TO_FETCH_AUDIT_LOGS",
    });
  }
};

/**
 * 🔍 SEARCH / FILTER AUDIT LOGS
 */
export const searchLogs = async (req, res) => {
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
    console.error("[AUDIT_CONTROLLER_SEARCH_ERROR]", error.message);

    return res.status(500).json({
      success: false,
      message: "AUDIT_SEARCH_FAILED",
    });
  }
};

/**
 * 📊 AUDIT STATS FOR DASHBOARD
 */
export const getAuditStats = async (req, res) => {
  try {
    const logs = await auditService.getRecent(1000);

    const stats = logs.reduce(
      (acc, log) => {
        acc.total += 1;

        if (log.status === "SUCCESS") acc.success += 1;
        if (log.status === "FAILED") acc.failed += 1;

        acc.byAction[log.action] = (acc.byAction[log.action] || 0) + 1;

        return acc;
      },
      {
        total: 0,
        success: 0,
        failed: 0,
        byAction: {},
      }
    );

    return res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("[AUDIT_CONTROLLER_STATS_ERROR]", error.message);

    return res.status(500).json({
      success: false,
      message: "AUDIT_STATS_FAILED",
    });
  }
};
