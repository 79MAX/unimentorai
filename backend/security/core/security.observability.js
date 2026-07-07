
/**
 * ==================================================
 * SECURITY OBSERVABILITY V2
 * SOC Monitoring & Intelligence Dashboard Core
 * ==================================================
 *
 * 🎯 ROLE:
 * - Collect all security system signals
 * - Measure system health (precision, recall, drift)
 * - Track decisions, enforcement, rollbacks
 * - Provide real-time security snapshot
 */

class SecurityObservability {
  constructor() {
    this.logs = [];

    this.metrics = {
      decisions: 0,
      enforcement: 0,
      rollbacks: 0,

      allowed: 0,
      monitored: 0,
      restricted: 0,
      quarantined: 0,
    };

    this.performance = {
      truePositive: 0,
      falsePositive: 0,
      falseNegative: 0,
    };
  }

  /**
   * 🚀 CORE EVENT LOGGER
   */
  record(payload = {}) {
    this.metrics.decisions++;

    const decision = payload.decision;

    if (decision?.action?.type === "ALLOW") this.metrics.allowed++;
    if (decision?.action?.type === "MONITOR") this.metrics.monitored++;
    if (decision?.action?.type === "RESTRICT") this.metrics.restricted++;
    if (decision?.action?.type === "QUARANTINE")
      this.metrics.quarantined++;

    this.logs.push({
      type: "DECISION",
      payload,
      timestamp: Date.now(),
    });

    this._trim();
  }

  /**
   * ==========================
   * ENFORCEMENT LOGGER
   * ==========================
   */
  recordEnforcement(event = {}) {
    this.metrics.enforcement++;

    this.logs.push({
      type: "ENFORCEMENT",
      event,
      timestamp: Date.now(),
    });

    this._trim();
  }

  /**
   * ==========================
   * ROLLBACK LOGGER
   * ==========================
   */
  recordRollback(event = {}) {
    this.metrics.rollbacks++;

    this.logs.push({
      type: "ROLLBACK",
      event,
      timestamp: Date.now(),
    });

    this._trim();
  }

  /**
   * ==========================
   * SECURITY FEEDBACK LOOP (ML READY)
   * ==========================
   */
  recordOutcome(outcome = {}) {
    if (outcome.type === "TRUE_POSITIVE")
      this.performance.truePositive++;

    if (outcome.type === "FALSE_POSITIVE")
      this.performance.falsePositive++;

    if (outcome.type === "FALSE_NEGATIVE")
      this.performance.falseNegative++;
  }

  /**
   * ==========================
   * PRECISION / RECALL
   * ==========================
   */
  getPrecision() {
    const tp = this.performance.truePositive;
    const fp = this.performance.falsePositive;

    if (tp + fp === 0) return 0;

    return tp / (tp + fp);
  }

  getRecall() {
    const tp = this.performance.truePositive;
    const fn = this.performance.falseNegative;

    if (tp + fn === 0) return 0;

    return tp / (tp + fn);
  }

  /**
   * ==========================
   * SYSTEM DRIFT (CRITICAL)
   * ==========================
   */
  getDriftScore() {
    const total =
      this.performance.truePositive +
      this.performance.falsePositive +
      this.performance.falseNegative;

    if (total === 0) return 0;

    return (
      (this.performance.falsePositive +
        this.performance.falseNegative) /
      total
    );
  }

  /**
   * ==========================
   * SYSTEM HEALTH ENGINE
   * ==========================
   */
  getHealth() {
    const precision = this.getPrecision();
    const recall = this.getRecall();

    const score = (precision + recall) / 2;

    if (score >= 0.85) return "EXCELLENT";
    if (score >= 0.7) return "GOOD";
    if (score >= 0.5) return "DEGRADED";

    return "CRITICAL";
  }

  /**
   * ==========================
   * REAL-TIME SOC SNAPSHOT
   * ==========================
   */
  getSnapshot() {
    return {
      metrics: this.metrics,

      performance: {
        precision: this.getPrecision(),
        recall: this.getRecall(),
        drift: this.getDriftScore(),
      },

      health: this.getHealth(),

      logsCount: this.logs.length,
      lastLogs: this.logs.slice(-10),
    };
  }

  /**
   * ==========================
   * LOG MANAGEMENT (ANTI-MEMORY LEAK)
   * ==========================
   */
  _trim() {
    if (this.logs.length > 1000) {
      this.logs.shift();
    }
  }

  /**
   * RESET SYSTEM
   */
  reset() {
    this.logs = [];

    this.metrics = {
      decisions: 0,
      enforcement: 0,
      rollbacks: 0,
      allowed: 0,
      monitored: 0,
      restricted: 0,
      quarantined: 0,
    };

    this.performance = {
      truePositive: 0,
      falsePositive: 0,
      falseNegative: 0,
    };
  }
}

/**
 * Singleton instance
 */
export const securityObservability = new SecurityObservability();
