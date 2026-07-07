const AIEventBus = require("./ai.event.bus.service");
const AIMetricsService = require("./ai.metrics.service");
const AIAdminAgent = require("./ai.admin.agent");

/**
 * AI SELF HEALING ENGINE - UniMentorAI
 * Autonomous system reliability + auto-repair brain
 * Role: Detect → Diagnose → Fix → Learn → Prevent
 */

class AISelfHealingEngine {

  constructor() {

    this.metrics = AIMetricsService;
    this.eventBus = AIEventBus;
    this.admin = AIAdminAgent;

    this.healingHistory = [];
    this.thresholds = this.loadThresholds();
  }

  /**
   * ========================
   * 🧠 MAIN HEALTH CYCLE
   * ========================
   */
  async runHealthCycle() {

    const metrics = await this.metrics.getGlobalMetrics();
    const anomalies = await this.metrics.detectAnomalies();

    const actions = [];

    // ========================
    // 1. LATENCY ANALYSIS
    // ========================
    if (metrics.avgLatency > this.thresholds.latency) {
      actions.push(await this.healLatency(metrics));
    }

    // ========================
    // 2. FAILURE RATE ANALYSIS
    // ========================
    if (anomalies.failureRate > this.thresholds.failureRate) {
      actions.push(await this.healFailures(anomalies));
    }

    // ========================
    // 3. COST SPIKE ANALYSIS
    // ========================
    if (metrics.totalCost > this.thresholds.cost) {
      actions.push(await this.healCost(metrics));
    }

    // ========================
    // 4. MEMORY PRESSURE
    // ========================
    actions.push(await this.cleanupSystem());

    // ========================
    // 5. LEARNING LOOP
    // ========================
    await this.learnFromCycle(actions, metrics);

    return {
      success: true,
      actions,
      status: "HEALING_CYCLE_COMPLETE",
    };
  }

  /**
   * ⚡ LATENCY HEALING
   */
  async healLatency(metrics) {

    await this.eventBus.emit("system.heal.latency", {
      severity: "high",
      value: metrics.avgLatency,
    });

    return {
      action: "reduce_latency",
      fix: "load_balancing_triggered",
    };
  }

  /**
   * ❌ FAILURE HEALING
   */
  async healFailures(anomalies) {

    await this.eventBus.emit("system.heal.failure", {
      failureRate: anomalies.failureRate,
    });

    return {
      action: "stabilize_failures",
      fix: "retry_and_fallback_enabled",
    };
  }

  /**
   * 💰 COST HEALING
   */
  async healCost(metrics) {

    await this.eventBus.emit("system.heal.cost", {
      cost: metrics.totalCost,
    });

    return {
      action: "optimize_cost",
      fix: "model_downgrade_or_cache_enabled",
    };
  }

  /**
   * 🧹 SYSTEM CLEANUP
   */
  async cleanupSystem() {

    await this.eventBus.emit("system.heal.cleanup", {
      type: "memory_and_cache",
    });

    return {
      action: "cleanup",
      fix: "memory_trimmed_and_cache_cleared",
    };
  }

  /**
   * 🧠 LEARNING FROM HEALING
   */
  async learnFromCycle(actions, metrics) {

    this.healingHistory.push({
      timestamp: Date.now(),
      actions,
      metricsSnapshot: metrics,
    });

    // keep history bounded
    if (this.healingHistory.length > 100) {
      this.healingHistory.shift();
    }

    // emit learning event
    await this.eventBus.emit("system.heal.learn", {
      actionsCount: actions.length,
    });
  }

  /**
   * 📊 HEALTH STATUS REPORT
   */
  async getHealthStatus() {

    const metrics = await this.metrics.getGlobalMetrics();

    const score = this.calculateHealthScore(metrics);

    return {
      score,
      status:
        score > 80
          ? "HEALTHY"
          : score > 50
          ? "WARNING"
          : "CRITICAL",
      metrics,
    };
  }

  /**
   * 🧠 HEALTH SCORE ENGINE
   */
  calculateHealthScore(metrics) {

    let score = 100;

    if (metrics.avgLatency > this.thresholds.latency) score -= 30;
    if (metrics.totalCost > this.thresholds.cost) score -= 20;
    if (metrics.errorRate > 0.1) score -= 30;

    return Math.max(0, score);
  }

  /**
   * ⚙️ THRESHOLDS CONFIG
   */
  loadThresholds() {

    return {
      latency: 1500,     // ms
      failureRate: 0.1,  // 10%
      cost: 50,          // currency units
    };
  }

  /**
   * 🔁 AUTO HEAL LOOP
   */
  startAutoHealing(intervalMs = 60000) {

    setInterval(async () => {
      await this.runHealthCycle();
    }, intervalMs);
  }
}

module.exports = new AISelfHealingEngine();
