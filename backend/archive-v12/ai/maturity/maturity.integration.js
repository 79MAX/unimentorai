/**
 * 🚀 MATURITY INTEGRATION — UNIMENTORAI CORE CONNECTOR
 * Level: Production-ready orchestration layer (Stripe / Uber style)
 */

import { SystemMaturityEngine } from "./system-maturity.engine.js";

export class MaturityIntegration {

  /* =========================
     🚀 MAIN ENTRY POINT
  ========================= */
  static run(systemState = {}, options = {}) {

    const start = Date.now();

    try {

      /* =========================
         🧼 INPUT VALIDATION
      ========================= */
      const safeState = this.sanitize(systemState);

      const result = SystemMaturityEngine.evaluate(safeState);

      const latency = Date.now() - start;

      /* =========================
         📊 STRUCTURED LOGGING
      ========================= */
      this.log({
        level: result.level,
        latency,
        success: true
      }, options.debug);

      /* =========================
         📦 STANDARDIZED OUTPUT
      ========================= */
      return {
        success: true,
        ...result,
        meta: {
          latency,
          system: "UNIMENTORAI_MATURITY_INTEGRATION",
          timestamp: Date.now()
        }
      };

    } catch (error) {

      return this.fallback(error);
    }
  }

  /* =========================
     🧼 INPUT SANITIZER
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
     📊 SAFE LOGGER
  ========================= */
  static log(data, debug = false) {

    if (!debug) return;

    console.log("🧠 MATURITY ENGINE LOG:", {
      ...data,
      timestamp: Date.now()
    });
  }

  /* =========================
     🧯 FALLBACK SAFE MODE
  ========================= */
  static fallback(error = null) {

    return {
      success: false,
      level: "MVP",
      metrics: {
        users: 0,
        revenue: 0,
        activity: 0,
        errors: 0,
        latency: 0
      },
      features: {},
      meta: {
        system: "UNIMENTORAI_MATURITY_INTEGRATION",
        fallback: true,
        error: error?.message || "UNKNOWN_ERROR",
        timestamp: Date.now()
      }
    };
  }
}

