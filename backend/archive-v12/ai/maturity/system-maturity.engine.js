/**
 * ⚙️ SYSTEM MATURITY ENGINE — ENTRY POINT (PRODUCTION GRADE)
 * Level: Stripe / Notion / Uber scalable architecture style
 */

import { MaturityMetricsEngine } from "./maturity.metrics.engine.js";
import { MaturityLevelEngine } from "./maturity.level.engine.js";
import { FeatureFlagEngine } from "./feature-flag.engine.js";

export class SystemMaturityEngine {

  /* =========================
     🧠 SIMPLE CACHE LAYER
  ========================= */
  static cache = new Map();

  /* =========================
     🚀 MAIN EVALUATION PIPELINE
  ========================= */
  static evaluate(system = {}) {

    if (!system || typeof system !== "object") {
      return this.fallback();
    }

    const cacheKey = this.generateCacheKey(system);

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {

      /* =========================
         📊 METRICS COLLECTION
      ========================= */
      const metrics = MaturityMetricsEngine.collect(system);

      /* =========================
         🧠 LEVEL COMPUTATION
      ========================= */
      const level = MaturityLevelEngine.compute(metrics);

      /* =========================
         ⚙️ FEATURE FLAGS
      ========================= */
      const features = FeatureFlagEngine.getFeatures(level);

      const result = {
        level,
        metrics,
        features,
        meta: {
          system: "UNIMENTORAI_MATURITY_ENGINE",
          version: "1.0.0",
          timestamp: Date.now()
        }
      };

      /* =========================
         💾 CACHE STORE
      ========================= */
      this.setCache(cacheKey, result);

      return result;

    } catch (error) {

      return this.fallback(error);
    }
  }

  /* =========================
     🔑 CACHE KEY GENERATOR
  ========================= */
  static generateCacheKey(system) {

    return JSON.stringify({
      users: system.users || 0,
      revenue: system.revenue || 0,
      activity: system.activity || 0,
      errors: system.errors || 0,
      latency: system.latency || 0
    });
  }

  /* =========================
     💾 CACHE MANAGER
  ========================= */
  static setCache(key, value) {

    if (this.cache.size > 1000) {

      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, value);
  }

  /* =========================
     🧯 FALLBACK SAFE MODE
  ========================= */
  static fallback(error = null) {

    return {
      level: "MVP",
      metrics: {
        users: 0,
        revenue: 0,
        activity: 0,
        errors: 0,
        latency: 0
      },
      features: FeatureFlagEngine.getFeatures("MVP"),
      meta: {
        system: "UNIMENTORAI_MATURITY_ENGINE",
        fallback: true,
        error: error?.message || null,
        timestamp: Date.now()
      }
    };
  }

  /* =========================
     📊 DEBUG / INSPECT
  ========================= */
  static debug() {

    return {
      cacheSize: this.cache.size,
      cacheLimit: 1000,
      status: "HEALTHY"
    };
  }
}

