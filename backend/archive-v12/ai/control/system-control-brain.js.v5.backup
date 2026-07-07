/**
 * 🧠 UNIMENTORAI SYSTEM CONTROL BRAIN (PRO OPTIMIZED)
 * Central Orchestrator — Production Grade AI System Manager
 */

import { SystemMaturityEngine } from "../maturity/system-maturity.engine.js";
import { FeatureFlagEngine } from "../maturity/feature-flag.engine.js";

export class SystemControlBrain {

  /* =========================
     🧠 IMMUTABLE STATE CORE
  ========================= */
  static state = Object.freeze({
    currentLevel: "MVP",
    activeFeatures: {},
    stability: 100,
    lastUpdate: null,
    executionCount: 0
  });

  /* =========================
     🚀 MAIN ORCHESTRATION ENGINE
  ========================= */
  static run(systemState = {}) {

    const startTime = performance.now();

    try {

      const safeState = this.normalize(systemState);

      /* =========================
         🧠 1. MATURITY ANALYSIS
      ========================= */
      const maturity = SystemMaturityEngine.evaluate(safeState);

      const level = maturity?.level ?? "MVP";

      /* =========================
         ⚙️ 2. FEATURE RESOLUTION
      ========================= */
      const baseFeatures = FeatureFlagEngine.getFeatures(level);

      /* =========================
         🧯 3. SAFETY LAYER (IMMUTABLE)
      ========================= */
      const features = this.applySafety(baseFeatures, safeState);

      /* =========================
         📊 4. SYSTEM STABILITY
      ========================= */
      const stability = this.computeStability(safeState);

      /* =========================
         🔁 5. STATE UPDATE (SAFE IMMUTATION)
      ========================= */
      this.state = {
        ...this.state,
        currentLevel: level,
        activeFeatures: Object.freeze(features),
        stability,
        lastUpdate: Date.now(),
        executionCount: this.state.executionCount + 1
      };

      return {
        success: true,

        system: {
          level,
          features,
          stability
        },

        metrics: maturity?.metrics ?? {},

        meta: {
          system: "UNIMENTORAI_SYSTEM_CONTROL_BRAIN",
          executionTime: Math.round(performance.now() - startTime),
          timestamp: this.state.lastUpdate
        }
      };

    } catch (error) {

      return this.fallback(error, systemState);
    }
  }

  /* =========================
     🧼 INPUT NORMALIZATION
  ========================= */
  static normalize(state) {

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
     🧯 SAFETY LAYER (PRODUCTION GUARD)
  ========================= */
  static applySafety(features, state) {

    const errorRate = state.errors || 0;
    const latency = state.latency || 0;

    const isUnsafe =
      errorRate > 10 ||
      latency > 600;

    if (!isUnsafe) {
      return { ...features };
    }

    // 🔴 SAFE MODE — MINIMAL FEATURE SET
    return {
      ...features,

      vectorAI: false,
      legalAI: false,
      orchestration: false
    };
  }

  /* =========================
     📊 STABILITY ENGINE
  ========================= */
  static computeStability(state) {

    const errors = state.errors || 0;
    const latency = state.latency || 0;

    let score = 100;

    score -= errors * 3;
    score -= latency * 0.05;

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /* =========================
     🔁 FALLBACK SYSTEM (SAFE MODE)
  ========================= */
  static fallback(error, state = {}) {

    return {
      success: false,

      system: {
        level: "MVP",
        features: FeatureFlagEngine.getFeatures("MVP"),
        stability: 50
      },

      metrics: {},

      meta: {
        system: "UNIMENTORAI_SYSTEM_CONTROL_BRAIN",
        fallback: true,
        error: error?.message || "UNKNOWN_ERROR",
        lastState: state,
        timestamp: Date.now()
      }
    };
  }

  /* =========================
     📡 SYSTEM INSPECTION
  ========================= */
  static inspect() {

    return {
      ...this.state,
      health: this.state.stability > 70 ? "HEALTHY" : "DEGRADED"
    };
  }
}

