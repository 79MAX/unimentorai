const AIEventBus = require("./ai.event.bus.service");
const AIMetricsService = require("./ai.metrics.service");
const AIContextMemory = require("./ai.context.memory.service");

/**
 * AI SECURITY GUARDIAN AGENT - UniMentorAI
 * Autonomous Security & Threat Intelligence Layer
 * Role: Detect → Analyze → Block → Report → Adapt
 */

class AISecurityGuardianAgent {

  constructor() {

    this.eventBus = AIEventBus;
    this.metrics = AIMetricsService;
    this.memory = AIContextMemory;

    this.threatLog = [];
    this.blockedUsers = new Set();
  }

  /**
   * ========================
   * 🛡️ MAIN SECURITY CHECK ENTRY
   * ========================
   */
  async inspect({ userId, input, metadata = {} }) {

    const riskScore = this.calculateRiskScore(input, metadata);

    // ========================
    // 1. HIGH RISK → BLOCK
    // ========================
    if (riskScore > 80) {
      return this.blockUser(userId, riskScore);
    }

    // ========================
    // 2. MEDIUM RISK → MONITOR
    // ========================
    if (riskScore > 50) {
      this.flagUser(userId, riskScore);
    }

    // ========================
    // 3. SAFE → ALLOW
    // ========================
    return {
      allowed: true,
      riskScore,
    };
  }

  /**
   * ========================
   * ⚠️ RISK SCORING ENGINE
   * ========================
   */
  calculateRiskScore(input, metadata) {

    let score = 0;

    const text = (input || "").toLowerCase();

    // suspicious patterns
    if (text.includes("hack")) score += 40;
    if (text.includes("exploit")) score += 40;
    if (text.includes("password")) score += 20;
    if (text.includes("inject")) score += 50;
    if (text.includes("delete all")) score += 60;

    // abnormal usage patterns
    if (metadata.requestsPerMinute > 100) score += 30;

    if (metadata.failedAttempts > 5) score += 25;

    return Math.min(100, score);
  }

  /**
   * ========================
   * 🚫 BLOCK USER
   * ========================
   */
  async blockUser(userId, riskScore) {

    this.blockedUsers.add(userId);

    this.threatLog.push({
      userId,
      riskScore,
      action: "BLOCKED",
      timestamp: Date.now(),
    });

    // Emit global security event
    this.eventBus.emitAsync("security.user.blocked", {
      userId,
      riskScore,
    });

    await this.metrics.logInteraction({
      userId,
      prompt: "SECURITY_BLOCK",
      response: null,
      type: "security",
      success: false,
      errorMessage: "User blocked by AI Security Guardian",
    });

    return {
      allowed: false,
      blocked: true,
      riskScore,
      reason: "High risk detected",
    };
  }

  /**
   * ========================
   * 🚨 FLAG USER (MONITORING)
   * ========================
   */
  flagUser(userId, riskScore) {

    this.threatLog.push({
      userId,
      riskScore,
      action: "FLAGGED",
      timestamp: Date.now(),
    });

    this.eventBus.emitAsync("security.user.flagged", {
      userId,
      riskScore,
    });
  }

  /**
   * ========================
   * 🧠 SYSTEM SECURITY SCAN
   * ========================
   */
  async runSystemScan() {

    const metrics = await this.metrics.getGlobalMetrics();

    const anomalies = [];

    if (metrics.errorRate > 0.2) {
      anomalies.push("HIGH_ERROR_RATE");
    }

    if (metrics.avgLatency > 3000) {
      anomalies.push("SUSPICIOUS_LATENCY_SPIKE");
    }

    if (metrics.totalRequests > 10000 && metrics.errorRate > 0.1) {
      anomalies.push("POSSIBLE_ABUSE_PATTERN");
    }

    if (anomalies.length > 0) {

      this.eventBus.emitAsync("security.system.anomaly", {
        anomalies,
      });
    }

    return {
      success: true,
      anomalies,
    };
  }

  /**
   * ========================
   * 📊 SECURITY REPORT
   * ========================
   */
  getSecurityReport() {

    return {
      blockedUsers: this.blockedUsers.size,
      threatsDetected: this.threatLog.length,
      recentThreats: this.threatLog.slice(-10),
    };
  }

  /**
   * ========================
   * 🔁 AUTO SECURITY LOOP
   * ========================
   */
  startSecurityMonitoring(intervalMs = 60000) {

    setInterval(async () => {
      await this.runSystemScan();
    }, intervalMs);
  }
}

module.exports = new AISecurityGuardianAgent();
