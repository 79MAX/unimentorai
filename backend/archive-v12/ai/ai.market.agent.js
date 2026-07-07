const AIMetricsService = require("./ai.metrics.service");
const AIEventBus = require("./ai.event.bus.service");
const AIContextMemory = require("./ai.context.memory.service");

/**
 * AI MARKET AGENT - UniMentorAI
 * Revenue Intelligence Engine (AI Monetization Brain)
 * Role: Pricing + Upsell + Recommendation + Revenue optimization
 */

class AIMarketAgent {

  constructor() {

    this.metrics = AIMetricsService;
    this.eventBus = AIEventBus;
    this.memory = AIContextMemory;

    this.pricingRules = this.loadPricingRules();
  }

  /**
   * ========================
   * 🧠 MAIN MARKET ENTRY
   * ========================
   */
  async run({ userId, action, context = {} }) {

    switch (action) {

      case "recommend_offer":
        return this.recommendOffer(userId, context);

      case "dynamic_pricing":
        return this.getDynamicPricing(userId, context);

      case "upsell_engine":
        return this.generateUpsell(userId, context);

      case "revenue_analysis":
        return this.getRevenueAnalysis();

      case "user_value_score":
        return this.calculateUserValue(userId);

      default:
        return {
          success: false,
          message: "Unknown market action",
        };
    }
  }

  /**
   * ========================
   * 🎯 OFFER RECOMMENDATION ENGINE
   * ========================
   */
  async recommendOffer(userId, context) {

    const userContext = await this.memory.getContext({
      userId,
      sessionId: context.sessionId,
      query: context.query,
    });

    const score = this.calculateEngagementScore(userContext);

    let offer = "free";

    if (score > 80) offer = "premium_course";
    else if (score > 50) offer = "standard_course";
    else offer = "free_course";

    await this.eventBus.emitAsync("market.offer.recommended", {
      userId,
      offer,
      score,
    });

    return {
      success: true,
      offer,
      score,
    };
  }

  /**
   * ========================
   * 💰 DYNAMIC PRICING ENGINE
   * ========================
   */
  async getDynamicPricing(userId, context) {

    const basePrice = context.basePrice || 10;

    const userScore = await this.calculateUserValue(userId);

    let multiplier = 1;

    if (userScore.value > 80) multiplier = 1.5;
    else if (userScore.value < 30) multiplier = 0.7;

    const finalPrice = Math.round(basePrice * multiplier);

    return {
      success: true,
      pricing: {
        basePrice,
        multiplier,
        finalPrice,
      },
    };
  }

  /**
   * ========================
   * 🚀 UPSELL ENGINE
   * ========================
   */
  async generateUpsell(userId, context) {

    const engagement = await this.calculateUserValue(userId);

    const upsell = [];

    if (engagement.value > 70) {
      upsell.push("premium_certification");
    }

    if (engagement.value > 50) {
      upsell.push("advanced_course_pack");
    }

    if (engagement.value > 30) {
      upsell.push("mentorship_access");
    }

    await this.eventBus.emitAsync("market.upsell.generated", {
      userId,
      upsell,
    });

    return {
      success: true,
      upsell,
    };
  }

  /**
   * ========================
   * 📊 REVENUE ANALYSIS
   * ========================
   */
  async getRevenueAnalysis() {

    const metrics = await this.metrics.getGlobalMetrics();

    return {
      success: true,
      revenue: {
        total: metrics.totalRevenue || 0,
        cost: metrics.totalCost,
        profit: (metrics.totalRevenue || 0) - metrics.totalCost,
        efficiency:
          metrics.totalRevenue / (metrics.totalCost || 1),
      },
    };
  }

  /**
   * ========================
   * 🧠 USER VALUE SCORE ENGINE
   * ========================
   */
  async calculateUserValue(userId) {

    const context = await this.memory.getContext({
      userId,
      sessionId: "default",
      query: "engagement analysis",
    });

    const interactions = context.longTerm.length || 0;
    const semanticDepth = context.semantic.length || 0;

    const value =
      (interactions * 2) +
      (semanticDepth * 3);

    return {
      success: true,
      value,
      tier:
        value > 80
          ? "HIGH_VALUE"
          : value > 40
          ? "MEDIUM_VALUE"
          : "LOW_VALUE",
    };
  }

  /**
   * ========================
   * 📈 ENGAGEMENT SCORE
   * ========================
   */
  calculateEngagementScore(context) {

    const interactions = context.longTerm?.length || 0;
    const semantic = context.semantic?.length || 0;

    return (interactions * 1.5) + (semantic * 2);
  }

  /**
   * ========================
   * ⚙️ PRICING RULES
   * ========================
   */
  loadPricingRules() {

    return {
      low: 0.7,
      medium: 1.0,
      high: 1.5,
    };
  }
}

module.exports = new AIMarketAgent();
