const LearningEngine = require("../ai.adaptive.learning.service");
const AIMetricsService = require("../ai.metrics.service");

/**
 * AI MARKET AGENT - UniMentorAI
 * Business intelligence + monetization + recommendation engine
 * Role: Increase revenue + personalize offers + optimize conversion
 */

class AIMarketAgent {

  constructor() {
    this.learningEngine = LearningEngine;
    this.metrics = AIMetricsService;
  }

  /**
   * 🧠 MAIN ENTRY POINT
   */
  async run({ userId, context = {} }) {

    const startTime = Date.now();

    try {

      // ========================
      // 1. LOAD USER PROFILE
      // ========================
      const profile = await this.learningEngine.getUserProfile(userId);

      // ========================
      // 2. DETECT BUYING INTENT
      // ========================
      const intent = this.detectIntent(profile, context);

      // ========================
      // 3. GENERATE OFFERS
      // ========================
      const offers = this.generateOffers(profile, intent);

      // ========================
      // 4. RANK OFFERS
      // ========================
      const rankedOffers = this.rankOffers(offers);

      // ========================
      // 5. LOG METRICS
      // ========================
      await this.metrics.logInteraction({
        userId,
        prompt: "market_recommendation",
        response: JSON.stringify(rankedOffers),
        type: "market",
        latencyMs: Date.now() - startTime,
        success: true,
      });

      // ========================
      // 6. RESPONSE
      // ========================
      return {
        success: true,
        data: {
          intent,
          offers: rankedOffers.slice(0, 5),
        },
      };

    } catch (error) {

      await this.metrics.logInteraction({
        userId,
        prompt: "market_recommendation",
        response: null,
        type: "market",
        success: false,
        errorMessage: error.message,
        latencyMs: Date.now() - startTime,
      });

      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * 🎯 DETECT BUYING INTENT
   */
  detectIntent(profile, context) {

    let score = 0;

    if (profile.level === "advanced") score += 2;
    if (profile.streak > 5) score += 1;
    if (profile.history.length > 20) score += 2;

    if (context.mode === "learning") score += 1;
    if (context.mode === "deep") score += 2;

    return {
      level: score > 4 ? "high" : score > 2 ? "medium" : "low",
      score,
    };
  }

  /**
   * 💰 GENERATE OFFERS (CORE MONETIZATION ENGINE)
   */
  generateOffers(profile, intent) {

    const offers = [];

    // ========================
    // BASIC OFFERS
    // ========================
    offers.push({
      type: "course",
      title: "Beginner Pack",
      price: 5,
      value: "Learn fundamentals fast",
      priority: 1,
    });

    // ========================
    // INTERMEDIATE OFFERS
    // ========================
    if (profile.level !== "beginner") {
      offers.push({
        type: "bundle",
        title: "Professional Pack",
        price: 15,
        value: "Intermediate mastery courses",
        priority: 2,
      });
    }

    // ========================
    // PREMIUM OFFERS
    // ========================
    if (intent.level === "high") {
      offers.push({
        type: "premium",
        title: "Mentorship Access",
        price: 30,
        value: "1-on-1 AI + mentor system",
        priority: 3,
      });
    }

    // ========================
    // PERSONALIZED OFFERS
    // ========================
    profile.strongAreas?.forEach(area => {
      offers.push({
        type: "specialization",
        title: `Advanced ${area}`,
        price: 10,
        value: `Master ${area} deeply`,
        priority: 2,
      });
    });

    return offers;
  }

  /**
   * 📊 OFFER RANKING ENGINE
   */
  rankOffers(offers) {

    return offers
      .map(o => ({
        ...o,
        score: this.calculateScore(o),
      }))
      .sort((a, b) => b.score - a.score);
  }

  /**
   * 🧠 SCORING SYSTEM (SALES OPTIMIZATION)
   */
  calculateScore(offer) {

    let score = offer.priority || 1;

    if (offer.type === "premium") score += 3;
    if (offer.type === "bundle") score += 2;
    if (offer.type === "course") score += 1;

    if (offer.price <= 10) score += 2; // affordability boost

    return score;
  }

  /**
   * ⚡ QUICK MARKET SNAPSHOT
   */
  async quickOffers(userId) {

    return this.run({
      userId,
      context: { mode: "quick" },
    });
  }

  /**
   * 🔥 HIGH CONVERSION MODE
   */
  async conversionMode(userId) {

    return this.run({
      userId,
      context: { mode: "deep" },
    });
  }
}

module.exports = new AIMarketAgent();
