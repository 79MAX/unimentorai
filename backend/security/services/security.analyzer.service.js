import AuditLog from "FIX_REQUIRED_PATH";

/**
 * ==========================================
 * SECURITY ANALYZER V2
 * UniMentorAI Security Monitoring Engine
 * ==========================================
 */

const RISK_LEVELS = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL",
};

class SecurityAnalyzerService {
  /**
   * Analyse utilisateur
   */
  async analyzeUser(userId) {
    if (!userId) {
      throw new Error("userId required");
    }

    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [
      totalEvents,
      failedEvents,
      recentEvents,
      revokeEvents,
    ] = await Promise.all([
      AuditLog.countDocuments({
        userId,
      }),

      AuditLog.countDocuments({
        userId,
        status: "FAILED",
      }),

      AuditLog.countDocuments({
        userId,
        createdAt: { $gte: since24h },
      }),

      AuditLog.countDocuments({
        userId,
        action: "CERTIFICATE_REVOKED",
      }),
    ]);

    let score = 0;

    /**
     * Failed events
     */
    score += failedEvents * 4;

    /**
     * Excessive activity
     */
    if (recentEvents > 50) score += 10;
    if (recentEvents > 100) score += 20;
    if (recentEvents > 200) score += 40;

    /**
     * Repeated revoke actions
     */
    if (revokeEvents > 3) score += 15;

    /**
     * Failure ratio
     */
    const failureRatio =
      totalEvents > 0 ? failedEvents / totalEvents : 0;

    if (failureRatio > 0.30) score += 20;
    if (failureRatio > 0.50) score += 30;

    score = Math.min(score, 100);

    return {
      entityType: "USER",
      entityId: userId,
      score,
      level: this.getRiskLevel(score),

      metrics: {
        totalEvents,
        failedEvents,
        recentEvents,
        revokeEvents,
        failureRatio,
      },

      analyzedAt: new Date(),
    };
  }

  /**
   * Analyse IP
   */
  async analyzeIp(ip) {
    if (!ip) {
      throw new Error("ip required");
    }

    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [
      totalEvents,
      failedEvents,
      recentEvents,
    ] = await Promise.all([
      AuditLog.countDocuments({ ip }),

      AuditLog.countDocuments({
        ip,
        status: "FAILED",
      }),

      AuditLog.countDocuments({
        ip,
        createdAt: { $gte: since24h },
      }),
    ]);

    let score = 0;

    score += failedEvents * 3;

    if (recentEvents > 100) score += 20;
    if (recentEvents > 250) score += 40;

    const ratio =
      totalEvents > 0 ? failedEvents / totalEvents : 0;

    if (ratio > 0.40) score += 20;

    score = Math.min(score, 100);

    return {
      entityType: "IP",
      entityId: ip,
      score,
      level: this.getRiskLevel(score),

      metrics: {
        totalEvents,
        failedEvents,
        recentEvents,
        failureRatio: ratio,
      },

      analyzedAt: new Date(),
    };
  }

  /**
   * Dashboard Top Risks
   */
  async getTopRiskUsers(limit = 20) {
    const results = await AuditLog.aggregate([
      {
        $group: {
          _id: "$userId",
          totalEvents: { $sum: 1 },
          failedEvents: {
            $sum: {
              $cond: [
                { $eq: ["$status", "FAILED"] },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $sort: {
          failedEvents: -1,
        },
      },
      {
        $limit: limit,
      },
    ]);

    return results;
  }

  /**
   * Classification du risque
   */
  getRiskLevel(score) {
    if (score >= 80) {
      return RISK_LEVELS.CRITICAL;
    }

    if (score >= 60) {
      return RISK_LEVELS.HIGH;
    }

    if (score >= 30) {
      return RISK_LEVELS.MEDIUM;
    }

    return RISK_LEVELS.LOW;
  }
}

export const securityAnalyzerService =
  new SecurityAnalyzerService();

export default securityAnalyzerService;
