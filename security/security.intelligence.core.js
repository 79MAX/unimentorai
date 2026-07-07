import { securityObservability } from "./security.observability.js";

/**
 * ==================================================
 * SECURITY INTELLIGENCE CORE V2
 * UniMentorAI Global Risk Brain
 * ==================================================
 */

class SecurityIntelligenceCore {
  constructor() {
    this.memory = new Map(); // short-term behavioral memory
  }

  /**
   * ==================================================
   * MAIN SIGNAL AGGREGATION ENTRY
   * ==================================================
   */
  async getSignals({ userId, ip, action }) {
    const key = `${userId || "anon"}:${ip}`;

    const previous = this.memory.get(key) || {
      requestCount: 0,
      lastAction: null,
      anomalyScore: 0,
    };

    const signals = {
      ipReputation: this._analyzeIP(ip),
      behaviorAnomaly: this._analyzeBehavior(
        previous,
        action
      ),
      deviceRisk: this._analyzeDevice(action),
      requestBurst: this._detectBurst(previous),
    };

    const aggregated = this._aggregate(signals);

    this._updateMemory(key, signals);

    await this._log(userId, ip, action, signals, aggregated);

    return {
      ...signals,
      totalRisk: aggregated,
    };
  }

  /**
   * ==================================================
   * IP ANALYSIS (HEURISTIC BASELINE)
   * ==================================================
   */
  _analyzeIP(ip) {
    if (!ip) return 10;

    // simple heuristics (upgrade later with GeoIP / threat intel)
    if (ip.startsWith("0.") || ip === "127.0.0.1") {
      return 30;
    }

    if (ip.includes("vpn") || ip.includes("proxy")) {
      return 50;
    }

    return 5;
  }

  /**
   * ==================================================
   * BEHAVIOR ANALYSIS
   * ==================================================
   */
  _analyzeBehavior(previous, action) {
    let score = 0;

    if (previous.lastAction === action) {
      score += 10; // repetitive behavior
    }

    if (previous.requestCount > 10) {
      score += 20; // high activity
    }

    return score;
  }

  /**
   * ==================================================
   * DEVICE / ACTION RISK
   * ==================================================
   */
  _analyzeDevice(action) {
    const riskyActions = [
      "payment",
      "withdraw",
      "refund",
      "admin_access",
    ];

    return riskyActions.includes(action) ? 25 : 0;
  }

  /**
   * ==================================================
   * BURST DETECTION
   * ==================================================
   */
  _detectBurst(previous) {
    return previous.requestCount > 15 ? true : false;
  }

  /**
   * ==================================================
   * FINAL AGGREGATION ENGINE
   * ==================================================
   */
  _aggregate(signals) {
    const score =
      signals.ipReputation +
      signals.behaviorAnomaly +
      signals.deviceRisk +
      (signals.requestBurst ? 30 : 0);

    return Math.min(score, 100);
  }

  /**
   * ==================================================
   * MEMORY UPDATE (SHORT TERM BEHAVIOR TRACKING)
   * ==================================================
   */
  _updateMemory(key, signals) {
    const existing = this.memory.get(key) || {
      requestCount: 0,
      lastAction: null,
      anomalyScore: 0,
    };

    this.memory.set(key, {
      requestCount: existing.requestCount + 1,
      lastAction: signals.lastAction,
      anomalyScore: signals.behaviorAnomaly,
    });
  }

  /**
   * ==================================================
   * OBSERVABILITY HOOK
   * ==================================================
   */
  async _log(userId, ip, action, signals, totalRisk) {
    await securityObservability.log({
      userId,
      ip,
      action,
      signals,
      totalRisk,
      source: "intelligence_core",
    });
  }
}

export const securityIntelligence =
  new SecurityIntelligenceCore();
