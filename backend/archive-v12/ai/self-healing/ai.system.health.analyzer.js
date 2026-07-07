
/**
 * ========================
 * 📊 AI SYSTEM HEALTH ANALYZER
 * UniMentorAI Self-Healing Layer
 * ========================
 * Monitors system health, performance, and stability
 */

class SystemHealthAnalyzer {

  /**
   * ========================
   * 🚀 MAIN HEALTH ANALYSIS
   * ========================
   */
  analyze(context = {}) {

    const metrics = this.collectMetrics(context);

    return {
      status: this.computeStatus(metrics),
      level: this.computeLevel(metrics),

      metrics,

      insights: this.generateInsights(metrics),

      timestamp: new Date()
    };
  }

  /**
   * ========================
   * 📡 METRICS COLLECTION
   * ========================
   */
  collectMetrics(context) {

    const system = context.system || {};
    const api = context.api || {};
    const db = context.database || {};

    return {
      cpuUsage: system.cpuUsage || 0,
      memoryUsage: system.memoryUsage || 0,

      responseTime: api.responseTime || 0,
      errorRate: api.errorRate || 0,

      dbLatency: db.latency || 0,
      dbErrors: db.errors || 0,

      activeConnections: system.activeConnections || 0
    };
  }

  /**
   * ========================
   * 🧠 HEALTH STATUS ENGINE
   * ========================
   */
  computeStatus(m) {

    if (
      m.errorRate > 0.2 ||
      m.cpuUsage > 0.9 ||
      m.memoryUsage > 0.9 ||
      m.dbErrors > 5
    ) {
      return "critical";
    }

    if (
      m.errorRate > 0.1 ||
      m.cpuUsage > 0.75 ||
      m.memoryUsage > 0.75 ||
      m.responseTime > 2000
    ) {
      return "degraded";
    }

    return "healthy";
  }

  /**
   * ========================
   * ⚖️ HEALTH LEVEL SCORE
   * ========================
   */
  computeLevel(m) {

    let score = 0;

    score += m.cpuUsage;
    score += m.memoryUsage;
    score += m.errorRate * 2;
    score += m.dbErrors * 0.05;

    if (score > 2) return "critical";
    if (score > 1) return "high";
    if (score > 0.5) return "medium";

    return "low";
  }

  /**
   * ========================
   * 🧠 INSIGHTS ENGINE
   * ========================
   */
  generateInsights(m) {

    const insights = [];

    if (m.cpuUsage > 0.8) {
      insights.push("High CPU usage detected");
    }

    if (m.memoryUsage > 0.8) {
      insights.push("High memory consumption detected");
    }

    if (m.responseTime > 1500) {
      insights.push("Slow API response detected");
    }

    if (m.dbLatency > 500) {
      insights.push("Database latency issues detected");
    }

    if (m.errorRate > 0.1) {
      insights.push("Elevated API error rate detected");
    }

    return insights;
  }
}

module.exports = new SystemHealthAnalyzer();
