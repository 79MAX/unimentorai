const AIMetricsService = require("../ai.metrics.service");
const LearningEngine = require("../ai.adaptive.learning.service");

/**
 * AI ADMIN AGENT - UniMentorAI
 * System-level intelligence agent
 * Role: Monitor, diagnose, optimize, heal system
 */

class AIAdminAgent {

  constructor() {
    this.metrics = AIMetricsService;
    this.learningEngine = LearningEngine;
  }

  /**
   * 🧠 MAIN ADMIN ENTRY
   */
  async run({ command, context = {} }) {

    switch (command) {

      case "system_health":
        return this.getSystemHealth();

      case "anomaly_detection":
        return this.detectAnomalies();

      case "cost_report":
        return this.getCostReport();

      case "usage_insights":
        return this.getUsageInsights();

      case "performance_report":
        return this.getPerformanceReport();

      default:
        return {
          success: false,
          message: "Unknown admin command",
        };
    }
  }

  /**
   * 🟢 SYSTEM HEALTH CHECK
   */
  async getSystemHealth() {

    const metrics = await this.metrics.getGlobalMetrics();
    const anomalies = await this.metrics.detectAnomalies();

    const healthScore = this.calculateHealthScore(metrics, anomalies);

    return {
      success: true,
      healthScore,
      status:
        healthScore > 80
          ? "HEALTHY"
          : healthScore > 50
          ? "WARNING"
          : "CRITICAL",
      metrics,
      anomalies,
    };
  }

  /**
   * ⚠️ ANOMALY DETECTION
   */
  async detectAnomalies() {

    const anomalies = await this.metrics.detectAnomalies();

    return {
      success: true,
      anomalies: {
        highLatency: anomalies.highLatencyRequests,
        failureRate: anomalies.failureRate,
      },
      recommendation:
        anomalies.failureRate > 0.2
          ? "Investigate AI model stability"
          : "System stable",
    };
  }

  /**
   * 💰 COST ANALYSIS
   */
  async getCostReport() {

    const global = await this.metrics.getGlobalMetrics();

    return {
      success: true,
      cost: global.totalCost,
      avgCostPerRequest: global.avgCostPerRequest,
      totalTokens: global.totalTokens,
      recommendation:
        global.totalCost > 10
          ? "Optimize AI model usage"
          : "Cost within acceptable range",
    };
  }

  /**
   * 📊 USAGE INSIGHTS
   */
  async getUsageInsights() {

    const stats = await this.metrics.getGlobalMetrics();

    return {
      success: true,
      totalRequests: stats.totalRequests,
      totalTokens: stats.totalTokens,
      usageTrend:
        stats.totalRequests > 1000
          ? "High usage"
          : "Normal usage",
    };
  }

  /**
   * ⚡ PERFORMANCE REPORT
   */
  async getPerformanceReport() {

    const metrics = await this.metrics.getGlobalMetrics();
    const quality = await this.metrics.getQualityInsights();

    return {
      success: true,
      avgLatency: metrics.avgCostPerRequest,
      quality,
      recommendation:
        quality.avgSatisfaction < 3
          ? "Improve AI response quality"
          : "Performance stable",
    };
  }

  /**
   * 🧠 HEALTH SCORE ENGINE
   */
  calculateHealthScore(metrics, anomalies) {

    let score = 100;

    // penalize failures
    if (anomalies.failureRate > 0.1) score -= 30;

    // penalize latency
    if (metrics.avgLatency > 2000) score -= 20;

    // cost penalty
    if (metrics.totalCost > 50) score -= 20;

    return Math.max(0, score);
  }

  /**
   * 🔧 SYSTEM AUTO-HEAL (FUTURE READY)
   */
  async autoHeal() {

    const health = await this.getSystemHealth();

    if (health.healthScore < 50) {
      return {
        action: "reduce_ai_load",
        status: "triggered",
      };
    }

    return {
      action: "none",
      status: "stable",
    };
  }

  /**
   * 📡 REAL-TIME MONITORING SNAPSHOT
   */
  async liveSnapshot() {

    const metrics = await this.metrics.getGlobalMetrics();

    return {
      timestamp: Date.now(),
      requests: metrics.totalRequests,
      cost: metrics.totalCost,
      status: "live",
    };
  }
}

module.exports = new AIAdminAgent();
