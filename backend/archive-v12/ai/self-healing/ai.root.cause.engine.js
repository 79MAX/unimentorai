/**
 * ==========================================
 * 🧠 AI ROOT CAUSE ENGINE
 * UniMentorAI Self-Healing Layer
 * ==========================================
 */

class RootCauseEngine {

  /**
   * ==========================================
   * MAIN ANALYSIS
   * ==========================================
   */
  analyze(data = {}) {

    const health = data.health || {};
    const errors = data.errors || {};
    const bottlenecks = data.bottlenecks || {};

    const candidates = [];

    candidates.push(
      ...this.analyzeDatabaseIssues(
        health,
        errors,
        bottlenecks
      )
    );

    candidates.push(
      ...this.analyzeApiIssues(
        health,
        errors,
        bottlenecks
      )
    );

    candidates.push(
      ...this.analyzeMemoryIssues(
        health,
        errors,
        bottlenecks
      )
    );

    candidates.push(
      ...this.analyzeCpuIssues(
        health,
        errors,
        bottlenecks
      )
    );

    candidates.push(
      ...this.analyzeDependencyIssues(
        errors
      )
    );

    const ranked =
      this.rankCandidates(candidates);

    return {
      primary: ranked[0]?.cause || "UNKNOWN",
      confidence:
        ranked[0]?.confidence || 0,
      candidates: ranked,
      timestamp: new Date()
    };
  }

  /**
   * ==========================================
   * DATABASE ANALYSIS
   * ==========================================
   */
  analyzeDatabaseIssues(
    health,
    errors,
    bottlenecks
  ) {

    const results = [];

    const dbIssue =
      bottlenecks.bottlenecks?.find(
        b =>
          b.type === "DATABASE_LATENCY"
      );

    const dbFailure =
      errors.patterns?.find(
        p =>
          p.type ===
          "DATABASE_FAILURE_PATTERN"
      );

    if (dbIssue || dbFailure) {

      results.push({
        cause:
          "DATABASE_RESOURCE_EXHAUSTION",
        confidence: 0.92,
        category: "database"
      });
    }

    return results;
  }

  /**
   * ==========================================
   * API ANALYSIS
   * ==========================================
   */
  analyzeApiIssues(
    health,
    errors,
    bottlenecks
  ) {

    const results = [];

    const apiLatency =
      bottlenecks.bottlenecks?.find(
        b =>
          b.type ===
          "API_RESPONSE_DEGRADATION"
      );

    if (apiLatency) {

      results.push({
        cause:
          "API_PERFORMANCE_DEGRADATION",
        confidence: 0.88,
        category: "api"
      });
    }

    return results;
  }

  /**
   * ==========================================
   * MEMORY ANALYSIS
   * ==========================================
   */
  analyzeMemoryIssues(
    health,
    errors,
    bottlenecks
  ) {

    const results = [];

    const memoryIssue =
      bottlenecks.bottlenecks?.find(
        b =>
          b.type ===
          "MEMORY_PRESSURE"
      );

    const heapIssue =
      bottlenecks.bottlenecks?.find(
        b =>
          b.type ===
          "HEAP_EXHAUSTION_RISK"
      );

    if (memoryIssue || heapIssue) {

      results.push({
        cause:
          "MEMORY_LEAK_OR_PRESSURE",
        confidence: 0.90,
        category: "memory"
      });
    }

    return results;
  }

  /**
   * ==========================================
   * CPU ANALYSIS
   * ==========================================
   */
  analyzeCpuIssues(
    health,
    errors,
    bottlenecks
  ) {

    const results = [];

    const cpuIssue =
      bottlenecks.bottlenecks?.find(
        b =>
          b.type ===
          "CPU_SATURATION"
      );

    if (cpuIssue) {

      results.push({
        cause:
          "CPU_RESOURCE_EXHAUSTION",
        confidence: 0.89,
        category: "cpu"
      });
    }

    return results;
  }

  /**
   * ==========================================
   * DEPENDENCY ANALYSIS
   * ==========================================
   */
  analyzeDependencyIssues(
    errors
  ) {

    const results = [];

    const dependencyFailure =
      errors.patterns?.find(
        p =>
          p.type ===
          "EXTERNAL_API_FAILURE_PATTERN"
      );

    if (dependencyFailure) {

      results.push({
        cause:
          "EXTERNAL_DEPENDENCY_FAILURE",
        confidence: 0.94,
        category: "dependency"
      });
    }

    return results;
  }

  /**
   * ==========================================
   * RANKING ENGINE
   * ==========================================
   */
  rankCandidates(candidates) {

    return candidates.sort(
      (a, b) =>
        b.confidence - a.confidence
    );
  }
}

module.exports =
  new RootCauseEngine();
