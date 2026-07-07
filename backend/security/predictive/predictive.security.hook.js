import { predictiveSecurityEngine } from "./predictive.security.engine.js";
import { applyAutoProtection } from "../auto/auto.protection.service.js";
import { quarantineUser } from "../auto/quarantine.service.js";
import { selfHealMetrics } from "../self-heal/self.heal.metrics.js";

/**
 * ==================================================
 * PREDICTIVE SECURITY HOOK V2
 * Decision Orchestration Layer
 * ==================================================
 *
 * 🎯 ROLE:
 * - Convert predictions → safe decisions
 * - Orchestrate protection actions
 * - Prevent over-blocking (false positives)
 */

class PredictiveSecurityHook {
  constructor() {
    this.decisionQueue = [];
    this.processing = false;
  }

  /**
   * 🚀 MAIN ENTRY POINT
   */
  async handle(event = {}) {
    const prediction = predictiveSecurityEngine.predict(event);

    const decision = this._decide(prediction, event);

    this._enqueue(decision);

    return this._processQueue();
  }

  /**
   * ==========================
   * DECISION ENGINE (CRITICAL LAYER)
   * ==========================
   */
  _decide(prediction, event) {
    const { riskScore, prediction: label, confidence } = prediction;

    /**
     * IMMINENT THREAT → HARD BLOCK
     */
    if (label === "IMMINENT_THREAT" && confidence > 0.7) {
      return {
        action: "QUARANTINE",
        severity: "CRITICAL",
        userId: event.userId,
        reason: "predictive_imminent_threat",
        riskScore,
      };
    }

    /**
     * HIGH RISK → STRICT MONITORING
     */
    if (label === "HIGH_RISK" && confidence > 0.6) {
      return {
        action: "STRICT_MONITOR",
        severity: "HIGH",
        userId: event.userId,
        reason: "predictive_high_risk",
        riskScore,
      };
    }

    /**
     * SUSPICIOUS → SOFT PROTECTION
     */
    if (label === "SUSPICIOUS") {
      return {
        action: "SOFT_PROTECTION",
        severity: "MEDIUM",
        userId: event.userId,
        reason: "predictive_suspicious_behavior",
        riskScore,
      };
    }

    /**
     * NORMAL → NO ACTION
     */
    return {
      action: "ALLOW",
      severity: "LOW",
      userId: event.userId,
      reason: "normal_behavior",
      riskScore,
    };
  }

  /**
   * ==========================
   * QUEUE SYSTEM (ANTI-OVERLOAD)
   * ==========================
   */
  _enqueue(decision) {
    this.decisionQueue.push(decision);

    if (this.decisionQueue.length > 1000) {
      this.decisionQueue.shift();
    }
  }

  /**
   * ==========================
   * PROCESSOR (SAFE EXECUTION LAYER)
   * ==========================
   */
  async _processQueue() {
    if (this.processing) return;
    this.processing = true;

    try {
      while (this.decisionQueue.length > 0) {
        const decision = this.decisionQueue.shift();

        await this._execute(decision);
      }
    } finally {
      this.processing = false;
    }
  }

  /**
   * ==========================
   * ACTION EXECUTOR
   * ==========================
   */
  async _execute(decision) {
    switch (decision.action) {
      case "QUARANTINE":
        await quarantineUser(decision.userId, decision.riskScore, {
          source: "PREDICTIVE_ENGINE",
        });
        break;

      case "STRICT_MONITOR":
        await applyAutoProtection({
          userId: decision.userId,
          mode: "STRICT_MONITOR",
          reason: decision.reason,
        });
        break;

      case "SOFT_PROTECTION":
        await applyAutoProtection({
          userId: decision.userId,
          mode: "SOFT",
          reason: decision.reason,
        });
        break;

      case "ALLOW":
        // no-op but tracked
        break;
    }

    /**
     * ==========================
     * FEEDBACK TO SELF-HEAL SYSTEM
     * ==========================
     */
    selfHealMetrics.track(
      { thresholds: {} },
      decision.action === "ALLOW" ? "STABLE" : "BALANCE"
    );
  }

  /**
   * 📊 STATUS DEBUG
   */
  getStatus() {
    return {
      queueSize: this.decisionQueue.length,
      processing: this.processing,
    };
  }
}

/**
 * Singleton instance
 */
export const predictiveSecurityHook = new PredictiveSecurityHook();
