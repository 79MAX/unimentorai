/**
 * VIDEO TUTOR PRICING CORE - UniMentorAI
 * Dynamic pricing engine (geo-aware + LTV + usage-based optimization)
 */

class VideoTutorPricingCore {
  constructor({
    eventBus,
    telemetry,
    logger
  }) {
    this.eventBus = eventBus;
    this.telemetry = telemetry;
    this.logger = logger;

    // base pricing model
    this.basePlans = {
      free: 0,
      basic: 4.99,
      premium: 12.99,
      enterprise: 49.99
    };
  }

  /**
   * 💰 MAIN PRICING DECISION ENGINE
   */
  calculate(userContext) {
    const factors = this._analyzeContext(userContext);

    const price = this._computePrice(factors);

    const plan = this._selectPlan(price, factors);

    this._emitPricingEvent(userContext.userId, plan, price);

    return {
      plan,
      price,
      currency: factors.currency,
      discount: factors.discount
    };
  }

  /**
   * 🧠 Analyze pricing factors
   */
  _analyzeContext(ctx) {
    return {
      ltv: ctx.derived?.ltv || 0,
      engagement: ctx.derived?.engagementLevel || "low",
      usage: ctx.usage || 0,
      country: ctx.geo?.country || "global",
      risk: ctx.derived?.riskLevel || "low",
      currency: this._resolveCurrency(ctx.geo?.country),
      discount: this._geoDiscount(ctx.geo?.country)
    };
  }

  /**
   * 💰 Core pricing formula engine
   */
  _computePrice(f) {
    let multiplier = 1;

    // =========================
    // 📊 LTV multiplier
    // =========================
    if (f.ltv > 500) multiplier *= 1.8;
    else if (f.ltv > 100) multiplier *= 1.3;

    // =========================
    // 📈 Engagement multiplier
    // =========================
    if (f.engagement === "high") multiplier *= 1.4;
    if (f.engagement === "medium") multiplier *= 1.1;

    // =========================
    // 🌍 Geo pricing adjustment
    // =========================
    multiplier *= this._geoMultiplier(f.country);

    // =========================
    // ⚠️ Risk correction (protect UX)
    // =========================
    if (f.risk === "high") multiplier *= 0.7;

    // base premium reference
    const base = this.basePlans.premium;

    return Math.round(base * multiplier * 100) / 100;
  }

  /**
   * 🧩 Plan selection logic
   */
  _selectPlan(price, factors) {
    if (price > 40) return "enterprise";
    if (price > 15) return "premium";
    if (price > 5) return "basic";
    return "free";
  }

  /**
   * 🌍 Geo pricing multiplier
   */
  _geoMultiplier(country) {
    const map = {
      US: 1.2,
      EU: 1.1,
      BJ: 0.5,
      NG: 0.4,
      IN: 0.6,
      GLOBAL: 1
    };

    return map[country] || 1;
  }

  /**
   * 💸 Geo discount logic
   */
  _geoDiscount(country) {
    if (["BJ", "NG", "IN"].includes(country)) return 0.4;
    return 0;
  }

  /**
   * 💱 Currency resolver
   */
  _resolveCurrency(country) {
    const map = {
      US: "USD",
      EU: "EUR",
      BJ: "XOF",
      NG: "NGN",
      IN: "INR"
    };

    return map[country] || "USD";
  }

  /**
   * 📡 Emit pricing event
   */
  _emitPricingEvent(userId, plan, price) {
    this.eventBus.emit("pricing.calculated", {
      userId,
      plan,
      price,
      timestamp: Date.now()
    });

    this.telemetry.collect({
      type: "pricing.calculation",
      userId,
      plan,
      price
    });

    this.logger.info("pricing_calculated", {
      userId,
      plan,
      price
    });
  }

  /**
   * 📊 Pricing snapshot
   */
  getPricingSnapshot(userContext) {
    return this.calculate(userContext);
  }
}

module.exports = VideoTutorPricingCore;
