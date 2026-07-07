
/**
 * ========================
 * 🔍 AI DIAGNOSIS ENGINE
 * UniMentorAI Self-Healing Layer
 * ========================
 * Converts system signals into structured diagnoses
 */

const HealthAnalyzer = require("./ai.system.health.analyzer");
const ErrorDetector = require("./ai.error.pattern.detector");
const BottleneckDetector = require("./ai.performance.bottleneck.detector");
const RootCauseEngine = require("./ai.root.cause.engine");
const FailureClassifier = require("./ai.failure.classifier");

class DiagnosisEngine {

  /**
   * ========================
   * 🚀 MAIN DIAGNOSIS PIPELINE
   * ========================
   */
  analyze(context = {}) {

    // 📊 STEP 1 — SYSTEM HEALTH ANALYSIS
    const health = HealthAnalyzer.analyze(context);

    // ⚠️ STEP 2 — ERROR PATTERN DETECTION
    const errors = ErrorDetector.detect(context);

    // 🐢 STEP 3 — PERFORMANCE BOTTLENECK DETECTION
    const bottlenecks = BottleneckDetector.detect(context);

    // 🧠 STEP 4 — ROOT CAUSE ANALYSIS
    const rootCause = RootCauseEngine.analyze({
      health,
      errors,
      bottlenecks
    });

    // 🧾 STEP 5 — FAILURE CLASSIFICATION
    const classification = FailureClassifier.classify({
      health,
      errors,
      bottlenecks,
      rootCause
    });

    return {
      issues: this.collectIssues({
        health,
        errors,
        bottlenecks
      }),

      rootCause,
      classification,

      severity: this.computeSeverity({
        health,
        errors,
        bottlenecks
      }),

      summary: this.buildSummary({
        health,
        errors,
        bottlenecks,
        rootCause
      }),

      timestamp: new Date()
    };
  }

  /**
   * ========================
   * ⚠️ ISSUE AGGREGATION
   * ========================
   */
  collectIssues({ health, errors, bottlenecks }) {

    const issues = [];

    if (health.status !== "healthy") {
      issues.push({
        type: "HEALTH_DEGRADATION",
        severity: health.level || "medium"
      });
    }

    if (errors.count > 0) {
      issues.push({
        type: "ERROR_PATTERNS",
        severity: errors.severity || "high",
        count: errors.count
      });
    }

    if (bottlenecks.detected) {
      issues.push({
        type: "PERFORMANCE_BOTTLENECK",
        severity: bottlenecks.severity || "high"
      });
    }

    return issues;
  }

  /**
   * ========================
   * ⚖️ SEVERITY ENGINE
   * ========================
   */
  computeSeverity({ health, errors, bottlenecks }) {

    let score = 0;

    if (health.status !== "healthy") score += 0.3;
    if (errors.count > 5) score += 0.4;
    if (bottlenecks.detected) score += 0.3;

    if (score >= 0.8) return "critical";
    if (score >= 0.5) return "high";
    if (score >= 0.2) return "medium";

    return "low";
  }

  /**
   * ========================
   * 🧾 SUMMARY BUILDER
   * ========================
   */
  buildSummary({ health, errors, bottlenecks, rootCause }) {

    return {
      systemStatus: health.status,
      errorCount: errors.count || 0,
      bottlenecks: bottlenecks.detected || false,
      primaryCause: rootCause?.primary || "unknown"
    };
  }
}

module.exports = new DiagnosisEngine();
