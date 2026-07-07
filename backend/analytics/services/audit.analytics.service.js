import { AuditLog } from "FIX_REQUIRED_PATH";

/**
 * 📊 AUDIT ANALYTICS ENGINE V2 (PRODUCTION GRADE)
 * → optimized for large scale SaaS logs
 */

export const auditAnalyticsService = {
  /**
   * 📈 GLOBAL STATS (OPTIMIZED AGGREGATION)
   */
  async getStats() {
    const result = await AuditLog.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          success: {
            $sum: {
              $cond: [{ $eq: ["$status", "SUCCESS"] }, 1, 0],
            },
          },
          failed: {
            $sum: {
              $cond: [{ $eq: ["$status", "FAILED"] }, 1, 0],
            },
          },
        },
      },
    ]);

    const stats = result[0] || {
      total: 0,
      success: 0,
      failed: 0,
    };

    return {
      ...stats,
      successRate: stats.total ? (stats.success / stats.total) * 100 : 0,
      failureRate: stats.total ? (stats.failed / stats.total) * 100 : 0,
    };
  },

  /**
   * 📊 ACTION DISTRIBUTION (FAST GROUP BY)
   */
  async getActionDistribution() {
    const result = await AuditLog.aggregate([
      {
        $group: {
          _id: "$action",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    return result.map((r) => ({
      action: r._id,
      count: r.count,
    }));
  },

  /**
   * 📅 ACTIVITY TIMELINE (DAILY AGGREGATION)
   */
  async getActivityTimeline() {
    const result = await AuditLog.aggregate([
      {
        $project: {
          date: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
        },
      },
      {
        $group: {
          _id: "$date",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    return result.map((r) => ({
      date: r._id,
      count: r.count,
    }));
  },

  /**
   * 🌍 ACTIVITY HEATMAP (USER / IP BASED)
   */
  async getActivityHeatmap() {
    const result = await AuditLog.aggregate([
      {
        $project: {
          key: {
            $ifNull: ["$userId", "$ip"],
          },
        },
      },
      {
        $group: {
          _id: "$key",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 50,
      },
    ]);

    return result.map((r) => ({
      key: r._id || "unknown",
      count: r.count,
    }));
  },

  /**
   * 📦 FULL ANALYTICS SNAPSHOT (OPTIONAL DASHBOARD OPTIMIZED)
   */
  async getFullAnalytics() {
    const [stats, actions, timeline, heatmap] = await Promise.all([
      this.getStats(),
      this.getActionDistribution(),
      this.getActivityTimeline(),
      this.getActivityHeatmap(),
    ]);

    return {
      stats,
      actions,
      timeline,
      heatmap,
    };
  },
};
