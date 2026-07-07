/**
 * 📊 MATURITY METRICS ENGINE — PRODUCTION GRADE
 * Level: Stripe / Datadog / Uber metrics style
 */

export class MaturityMetricsEngine {

  /* =========================
     📊 MAIN COLLECTION METHOD
  ========================= */
  static collect(system = {}) {

    const safe = this.sanitize(system);

    const users = safe.users;
    const revenue = safe.revenue;
    const activity = safe.activity;
    const errors = safe.errors;
    const latency = safe.latency;

    /* =========================
       📈 DERIVED METRICS (IMPORTANT)
    ========================= */
    const errorRate = users > 0 ? errors / users : 0;

    const revenuePerUser = users > 0 ? revenue / users : 0;

    const healthScore =
      Math.max(0,
        100 -
        (errorRate * 50) -
        (latency * 0.1)
      );

    return {
      users,
      revenue,
      activity,
      errors,
      latency,

      /* 📊 DERIVED INTELLIGENCE */
      errorRate: Math.round(errorRate * 1000) / 1000,
      revenuePerUser: Math.round(revenuePerUser * 100) / 100,
      healthScore: Math.round(healthScore),

      meta: {
        timestamp: Date.now(),
        engine: "MATURITY_METRICS_ENGINE"
      }
    };
  }

  /* =========================
     🧼 INPUT SANITIZATION
  ========================= */
  static sanitize(system) {

    if (!system || typeof system !== "object") {
      return this.defaults();
    }

    return {
      users: this.toNumber(system.users),
      revenue: this.toNumber(system.revenue),
      activity: this.toNumber(system.activity),
      errors: this.toNumber(system.errors),
      latency: this.toNumber(system.latency)
    };
  }

  /* =========================
     🔢 SAFE NUMBER CONVERTER
  ========================= */
  static toNumber(value) {

    const n = Number(value);

    return Number.isFinite(n) ? n : 0;
  }

  /* =========================
     🧯 DEFAULT FALLBACK
  ========================= */
  static defaults() {

    return {
      users: 0,
      revenue: 0,
      activity: 0,
      errors: 0,
      latency: 0
    };
  }
}

