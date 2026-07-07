
/**
 * ========================
 * ⚠️ ERROR PATTERN DETECTOR
 * UniMentorAI Self-Healing Layer
 * ========================
 * Detects recurring error patterns and systemic failures
 */

class ErrorPatternDetector {

  /**
   * ========================
   * 🚀 MAIN DETECTION ENGINE
   * ========================
   */
  detect(context = {}) {

    const logs = context.logs || [];
    const errors = this.extractErrors(logs);

    const patterns = [
      this.detectRepetition(errors),
      this.detectCrashLoops(errors),
      this.detectSpikeErrors(errors),
      this.detectDependencyFailures(errors)
    ].flat().filter(Boolean);

    return {
      count: errors.length,
      patterns,
      severity: this.computeSeverity(patterns)
    };
  }

  /**
   * ========================
   * 📡 ERROR EXTRACTION
   * ========================
   */
  extractErrors(logs) {

    return logs.filter(l =>
      l.level === "error" ||
      l.type === "exception" ||
      l.status === "failed"
    );
  }

  /**
   * ========================
   * 🔁 REPETITION DETECTION
   * ========================
   */
  detectRepetition(errors) {

    const map = new Map();

    for (const e of errors) {

      const key = e.message || e.code || "unknown";

      map.set(key, (map.get(key) || 0) + 1);
    }

    const repeated = [];

    for (const [key, count] of map.entries()) {

      if (count >= 5) {
        repeated.push({
          type: "REPEATED_ERROR",
          message: key,
          occurrences: count,
          severity: "high"
        });
      }
    }

    return repeated;
  }

  /**
   * ========================
   * 🔄 CRASH LOOP DETECTION
   * ========================
   */
  detectCrashLoops(errors) {

    const recent = errors.filter(e =>
      Date.now() - new Date(e.timestamp).getTime() < 60000
    );

    if (recent.length > 20) {
      return [{
        type: "CRASH_LOOP",
        message: "Rapid error loop detected",
        severity: "critical",
        count: recent.length
      }];
    }

    return [];
  }

  /**
   * ========================
   * 📈 ERROR SPIKE DETECTION
   * ========================
   */
  detectSpikeErrors(errors) {

    const last5Min = errors.filter(e =>
      Date.now() - new Date(e.timestamp).getTime() < 300000
    );

    if (last5Min.length > 50) {
      return [{
        type: "ERROR_SPIKE",
        message: "Sudden spike in system errors",
        severity: "high",
        count: last5Min.length
      }];
    }

    return [];
  }

  /**
   * ========================
   * 🔗 DEPENDENCY FAILURE DETECTION
   * ========================
   */
  detectDependencyFailures(errors) {

    const dbErrors = errors.filter(e =>
      e.source === "database"
    );

    const apiErrors = errors.filter(e =>
      e.source === "external_api"
    );

    const results = [];

    if (dbErrors.length > 10) {
      results.push({
        type: "DATABASE_FAILURE_PATTERN",
        severity: "critical",
        count: dbErrors.length
      });
    }

    if (apiErrors.length > 15) {
      results.push({
        type: "EXTERNAL_API_FAILURE_PATTERN",
        severity: "high",
        count: apiErrors.length
      });
    }

    return results;
  }

  /**
   * ========================
   * ⚖️ SEVERITY ENGINE
   * ========================
   */
  computeSeverity(patterns) {

    if (patterns.some(p => p.severity === "critical")) {
      return "critical";
    }

    if (patterns.some(p => p.severity === "high")) {
      return "high";
    }

    if (patterns.length > 0) {
      return "medium";
    }

    return "low";
  }
}

module.exports = new ErrorPatternDetector();
