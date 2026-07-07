/**
 * ==========================================
 * 🚀 AI PERFORMANCE BOTTLENECK DETECTOR
 * UniMentorAI Self-Healing Layer
 * ==========================================
 */

class PerformanceBottleneckDetector {

  /**
   * ==========================================
   * MAIN DETECTION PIPELINE
   * ==========================================
   */
  detect(context = {}) {

    const metrics = this.extractMetrics(context);

    const bottlenecks = [];

    bottlenecks.push(...this.detectCpuIssues(metrics));
    bottlenecks.push(...this.detectMemoryIssues(metrics));
    bottlenecks.push(...this.detectDatabaseIssues(metrics));
    bottlenecks.push(...this.detectApiIssues(metrics));
    bottlenecks.push(...this.detectNetworkIssues(metrics));

    const severity = this.computeSeverity(bottlenecks);

    return {
      detected: bottlenecks.length > 0,
      severity,
      score: this.computeScore(bottlenecks),
      primaryBottleneck: this.getPrimaryBottleneck(bottlenecks),
      bottlenecks,
      recommendations: this.generateRecommendations(bottlenecks),
      timestamp: new Date()
    };
  }

  /**
   * ==========================================
   * METRICS EXTRACTION
   * ==========================================
   */
  extractMetrics(context) {

    return {

      cpuUsage:
        context.system?.cpuUsage ?? 0,

      memoryUsage:
        context.system?.memoryUsage ?? 0,

      heapUsage:
        context.system?.heapUsage ?? 0,

      dbLatency:
        context.database?.latency ?? 0,

      dbConnections:
        context.database?.activeConnections ?? 0,

      apiLatency:
        context.api?.responseTime ?? 0,

      apiErrorRate:
        context.api?.errorRate ?? 0,

      networkLatency:
        context.network?.latency ?? 0,

      packetLoss:
        context.network?.packetLoss ?? 0
    };
  }

  /**
   * ==========================================
   * CPU ANALYSIS
   * ==========================================
   */
  detectCpuIssues(metrics) {

    const results = [];

    if (metrics.cpuUsage >= 0.90) {
      results.push({
        type: "CPU_SATURATION",
        severity: "critical",
        value: metrics.cpuUsage
      });
    }
    else if (metrics.cpuUsage >= 0.75) {
      results.push({
        type: "HIGH_CPU_USAGE",
        severity: "high",
        value: metrics.cpuUsage
      });
    }

    return results;
  }

  /**
   * ==========================================
   * MEMORY ANALYSIS
   * ==========================================
   */
  detectMemoryIssues(metrics) {

    const results = [];

    if (metrics.memoryUsage >= 0.90) {
      results.push({
        type: "MEMORY_PRESSURE",
        severity: "critical",
        value: metrics.memoryUsage
      });
    }

    if (metrics.heapUsage >= 0.85) {
      results.push({
        type: "HEAP_EXHAUSTION_RISK",
        severity: "high",
        value: metrics.heapUsage
      });
    }

    return results;
  }

  /**
   * ==========================================
   * DATABASE ANALYSIS
   * ==========================================
   */
  detectDatabaseIssues(metrics) {

    const results = [];

    if (metrics.dbLatency > 1000) {
      results.push({
        type: "DATABASE_LATENCY",
        severity: "critical",
        value: metrics.dbLatency
      });
    }

    if (metrics.dbConnections > 500) {
      results.push({
        type: "DATABASE_CONNECTION_PRESSURE",
        severity: "high",
        value: metrics.dbConnections
      });
    }

    return results;
  }

  /**
   * ==========================================
   * API ANALYSIS
   * ==========================================
   */
  detectApiIssues(metrics) {

    const results = [];

    if (metrics.apiLatency > 3000) {
      results.push({
        type: "API_RESPONSE_DEGRADATION",
        severity: "critical",
        value: metrics.apiLatency
      });
    }

    if (metrics.apiErrorRate > 0.15) {
      results.push({
        type: "API_ERROR_CONCENTRATION",
        severity: "high",
        value: metrics.apiErrorRate
      });
    }

    return results;
  }

  /**
   * ==========================================
   * NETWORK ANALYSIS
   * ==========================================
   */
  detectNetworkIssues(metrics) {

    const results = [];

    if (metrics.networkLatency > 500) {
      results.push({
        type: "NETWORK_LATENCY",
        severity: "high",
        value: metrics.networkLatency
      });
    }

    if (metrics.packetLoss > 0.05) {
      results.push({
        type: "PACKET_LOSS",
        severity: "critical",
        value: metrics.packetLoss
      });
    }

    return results;
  }

  /**
   * ==========================================
   * SEVERITY ENGINE
   * ==========================================
   */
  computeSeverity(bottlenecks) {

    if (
      bottlenecks.some(
        x => x.severity === "critical"
      )
    ) {
      return "critical";
    }

    if (
      bottlenecks.some(
        x => x.severity === "high"
      )
    ) {
      return "high";
    }

    return bottlenecks.length
      ? "medium"
      : "low";
  }

  /**
   * ==========================================
   * BOTTLENECK SCORE
   * ==========================================
   */
  computeScore(bottlenecks) {

    let score = 0;

    for (const item of bottlenecks) {

      switch (item.severity) {

        case "critical":
          score += 0.35;
          break;

        case "high":
          score += 0.20;
          break;

        case "medium":
          score += 0.10;
          break;

        default:
          score += 0.05;
      }
    }

    return Math.min(score, 1);
  }

  /**
   * ==========================================
   * PRIMARY ROOT BOTTLENECK
   * ==========================================
   */
  getPrimaryBottleneck(bottlenecks) {

    if (!bottlenecks.length) {
      return null;
    }

    const priority = {
      critical: 4,
      high: 3,
      medium: 2,
      low: 1
    };

    return bottlenecks.sort(
      (a, b) =>
        priority[b.severity] -
        priority[a.severity]
    )[0];
  }

  /**
   * ==========================================
   * SELF-HEALING RECOMMENDATIONS
   * ==========================================
   */
  generateRecommendations(bottlenecks) {

    const recommendations = [];

    for (const item of bottlenecks) {

      switch (item.type) {

        case "CPU_SATURATION":
          recommendations.push(
            "Scale worker instances or reduce background workload"
          );
          break;

        case "MEMORY_PRESSURE":
          recommendations.push(
            "Trigger cache cleanup and inspect memory leaks"
          );
          break;

        case "DATABASE_LATENCY":
          recommendations.push(
            "Optimize queries and review database indexes"
          );
          break;

        case "API_RESPONSE_DEGRADATION":
          recommendations.push(
            "Investigate slow endpoints and external dependencies"
          );
          break;

        case "NETWORK_LATENCY":
          recommendations.push(
            "Inspect network routes and infrastructure providers"
          );
          break;
      }
    }

    return [...new Set(recommendations)];
  }
}

module.exports = new PerformanceBottleneckDetector();
