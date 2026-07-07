const AIMetricsService = require("./ai.metrics.service");
const AIEventBus = require("./ai.event.bus.service");
const AISelfHealingEngine = require("./ai.self.healing.engine");

/**
 * AI ADMIN AGENT - UniMentorAI
 * System Control Tower (AI Ops Brain)
 * Role: Monitor → Diagnose → Act → Optimize → Govern system
 */

class AIAdminAgent {

  constructor() {

    this.metrics = AIMetricsService;
    this.eventBus = AIEventBus;
    this.healer = AISelfHealingEngine;

    this.alerts = [];
  }

  /**
   * ========================
   * 🧠 MAIN CONTROL ENTRY
   * ========================
   */
  async run({ command, context = {} }) {

    switch (command) {

      case "system_overview":
        return this.getSystemOverview();

      case "deep_diagnostics":
        return this.runDeepDiagnostics();

      case "trigger_healing":
        return this.triggerSelfHealing();

      case "cost_analysis":
        return this.getCostAnalysis();

      case "performance_report":
        return this.getPerformanceReport();

      case "health_score":
        return this.getHealthScore();

      default:
        return {
          success: false,
          message: "Unknown admin command",
        };
    }
  }

  /**
   * ========================
   * 📊 SYSTEM OVERVIEW (GLOBAL DASHBOARD)
   * ========================
   */
  async getSystemOverview() {

    const metrics = await this.metrics.getGlobalMetrics();
    const anomalies = await this.metrics.detectAnomalies();
    const health = await this.healer.getHealthStatus();

    return {
      success: true,
      overview: {
        status: health.status,
        healthScore: health.score,
        totalRequests: metrics.totalRequests,
        errorRate: metrics.errorRate,
        avgLatency: metrics.avgLatency,
        totalCost: metrics.totalCost,
        anomalies,
      },
    };
  }

  /**
   * 🧠 DEEP DIAGNOSTICS ENGINE
   */
  async runDeepDiagnostics() {

    const metrics = await this.metrics.getGlobalMetrics();
    const anomalies = await this.metrics.detectAnomalies();

    const diagnosis = [];

    // latency issue
    if (metrics.avgLatency > 1500) {
      diagnosis.push({
        issue: "HIGH_LATENCY",
        severity: "HIGH",
        recommendation: "Enable caching or scale AI workers",
      });
    }

    // error rate issue
    if (metrics.errorRate > 0.1) {
      diagnosis.push({
        issue: "HIGH_ERROR_RATE",
        severity: "CRITICAL",
        recommendation: "Activate fallback models or retry policy",
      });
    }

    // cost issue
    if (metrics.totalCost > 50) {
      diagnosis.push({
        issue: "HIGH_COST",
        severity: "MEDIUM",
        recommendation: "Optimize model usage or enable batching",
      });
    }

    return {
      success: true,
      diagnosis,
    };
  }

  /**
   * 🔥 TRIGGER SELF HEALING
   */
  async triggerSelfHealing() {

    const result = await this.healer.runHealthCycle();

    this.eventBus.emitAsync("admin.healing.triggered", {
      source: "admin_agent",
    });

    return {
      success: true,
      result,
    };
  }

  /**
   * 💰 COST ANALYSIS ENGINE
   */
  async getCostAnalysis() {

    const metrics = await this.metrics.getGlobalMetrics();

    const costEfficiency = metrics.totalRequests > 0
      ? metrics.totalCost / metrics.totalRequests
      : 0;

    return {
      success: true,
      cost: {
        total: metrics.totalCost,
        perRequest: costEfficiency,
        status:
          costEfficiency < 0.01
            ? "OPTIMAL"
            : costEfficiency < 0.05
            ? "WARNING"
            : "CRITICAL",
      },
    };
  }

  /**
   * ⚡ PERFORMANCE REPORT
   */
  async getPerformanceReport() {

    const metrics = await this.metrics.getGlobalMetrics();

    return {
      success: true,
      performance: {
        latency: metrics.avgLatency,
        throughput: metrics.totalRequests,
        stability: metrics.errorRate < 0.05 ? "STABLE" : "UNSTABLE",
      },
    };
  }

  /**
   * 🧠 HEALTH SCORE AGGREGATOR
   */
  async getHealthScore() {

    const metrics = await this.metrics.getGlobalMetrics();

    let score = 100;

    if (metrics.avgLatency > 1500) score -= 25;
    if (metrics.errorRate > 0.1) score -= 40;
    if (metrics.totalCost > 50) score -= 20;

    return {
      success: true,
      healthScore: Math.max(0, score),
    };
  }

  /**
   * 🚨 ALERT SYSTEM
   */
  pushAlert(alert) {

    this.alerts.push({
      ...alert,
      timestamp: Date.now(),
    });

    if (this.alerts.length > 100) {
      this.alerts.shift();
    }
  }

  /**
   * 📡 REAL-TIME SYSTEM WATCHDOG
   */
  async startMonitoring(intervalMs = 60000) {

    setInterval(async () => {

      const health = await this.getHealthScore();

      if (health.healthScore < 50) {

        await this.triggerSelfHealing();

        this.pushAlert({
          type: "AUTO_HEAL_TRIGGERED",
          score: health.healthScore,
        });
      }

    }, intervalMs);
  }
}

module.exports = new AIAdminAgent();
