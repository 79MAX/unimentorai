/**
 * 🚀 AUTONOMOUS MATURITY CONTROL SYSTEM
 * Level: Stripe / Uber / Google adaptive infra architecture
 */

import { SystemMaturityEngine } from "./system-maturity.engine.js";
import { FeatureFlagEngine } from "./feature-flag.engine.js";

export class AutonomousMaturityControlSystem {

  /* =========================
     🧠 SYSTEM STATE (IN-MEMORY)
  ========================= */
  static state = {
    lastLevel: "MVP",
    lastFeatures: {},
    stabilityScore: 100,
    failures: 0,
    lastRun: null
  };

  /* =========================
     🚀 MAIN ENTRY POINT
  ========================= */
  static run(systemState = {}) {

    const start = Date.now();

    try {

      const safeState = this.sanitize(systemState);

      /* =========================
         🧠 MATURITY ENGINE
      ========================= */
      const maturity = SystemMaturityEngine.evaluate(safeState);

      const level = maturity?.level || "MVP";

      /* =========================
         ⚙️ FEATURE ENGINE
      ========================= */
      let features = FeatureFlagEngine.getFeatures(level);

      /* =========================
         🧯 SAFETY LAYER
      ========================= */
      features = this.applySafetyLayer(features, safeState);

      /* =========================
         📊 STABILITY UPDATE
      ========================= */
      this.updateStability(safeState);

      /* =========================
         🔁 STATE SYNC
      ========================= */
      this.state.lastLevel = level;
      this.state.lastFeatures = features;
      this.state.lastRun = Date.now();

      return {
        success: true,
        level,
        features,
        metrics: maturity.metrics,
        stability: this.state.stabilityScore,

        meta: {
          system: "AUTONOMOUS_MATURITY_CONTROL",
          duration: Date.now() - start,
          timestamp: this.state.lastRun
        }
      };

    } catch (error) {

      this.state.failures++;

      return this.rollback(error);
    }
  }

  /* =========================
     🧼 INPUT SANITIZER (IMPORTANT)
  ========================= */
  static sanitize(state) {

    if (!state || typeof state !== "object") {
      return {};
    }

    return {
      users: Number(state.users) || 0,
      revenue: Number(state.revenue) || 0,
      activity: Number(state.activity) || 0,
      errors: Number(state.errors) || 0,
      latency: Number(state.latency) || 0
    };
  }

  /* =========================
     🧯 SAFETY ENGINE (INTELLIGENT)
  ========================= */
  static applySafetyLayer(features, state) {

    const errorRate = state.errors || 0;
    const latency = state.latency || 0;

    const unstableSystem = errorRate > 10 || latency > 500;

    if (unstableSystem) {

      return {
        ...features,

        // 🚨 auto downgrade heavy AI systems
        vectorAI: false,
        legalAI: false,
        orchestration: false
      };
    }

    return features;
  }

  /* =========================
     📊 STABILITY ENGINE
  ========================= */
  static updateStability(state) {

    let score = this.state.stabilityScore;

    const errors = state.errors || 0;
    const latency = state.latency || 0;

    // 📉 penalties
    score -= errors * 3;
    score -= latency * 0.05;

    // 📈 recovery (system healthy bonus)
    if (errors === 0 && latency < 200) {
      score += 2;
    }

    // 🧯 bounds
    this.state.stabilityScore = Math.max(0, Math.min(100, score));
  }

  /* =========================
     🔁 SAFE ROLLBACK SYSTEM
  ========================= */
  static rollback(error) {

    return {
      success: false,
      level: "MVP",

      features: {
        vectorAI: false,
        legalAI: false,
        advancedJobs: false,
        orchestration: false,
        fraudDetection: true
      },

      stability: this.state.stabilityScore,

      meta: {
        system: "AUTONOMOUS_MATURITY_CONTROL",
        rollback: true,
        error: error?.message || "UNKNOWN_ERROR",
        timestamp: Date.now()
      }
    };
  }

  /* =========================
     📡 INSPECT / DEBUG TOOL
  ========================= */
  static inspect() {

    return {
      state: this.state,
      status: this.state.stabilityScore > 70 ? "HEALTHY" : "DEGRADED"
    };
  }
}

