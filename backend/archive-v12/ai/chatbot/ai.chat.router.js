
const RevenueService = require("../../analytics/revenue.service");
const ForecastEngine = require("../ai.revenue.forecast.service");
const GrowthDetector = require("../ai.growth.signal.detector");
const BusinessAI = require("../ai.business.recommendation.engine");

/**
 * ========================
 * 🔀 AI CHAT ROUTER ENGINE
 * UniMentorAI SaaS Intelligence Layer
 * ========================
 * Routes user intent → correct AI service module
 */

class AIChatRouter {

  /**
   * ========================
   * 🧠 INTENT DETECTION
   * ========================
   */
  detectIntent(query) {

    const q = query.toLowerCase();

    const intents = [
      {
        name: "revenue",
        keywords: ["revenue", "argent", "money", "income", "gains"]
      },
      {
        name: "growth",
        keywords: ["growth", "croissance", "évolution", "performance"]
      },
      {
        name: "forecast",
        keywords: ["predict", "forecast", "prévision", "projection"]
      },
      {
        name: "strategy",
        keywords: ["strategy", "business", "quoi faire", "plan", "action"]
      }
    ];

    for (const intent of intents) {
      if (intent.keywords.some(k => q.includes(k))) {
        return intent.name;
      }
    }

    return "dashboard";
  }

  /**
   * ========================
   * 🔀 ROUTE TO SERVICE
   * ========================
   */
  async route(intent) {

    const handlers = {

      revenue: async () => {
        return await RevenueService.getDashboard();
      },

      growth: async () => {
        return await GrowthDetector.getFullGrowthReport();
      },

      forecast: async () => {
        return await ForecastEngine.getForecastReport();
      },

      strategy: async () => {
        return await BusinessAI.getFullReport();
      },

      dashboard: async () => {
        return await RevenueService.getDashboard();
      }
    };

    const handler = handlers[intent];

    if (!handler) {
      return {
        error: "Unknown intent",
        fallback: await RevenueService.getDashboard()
      };
    }

    return await handler();
  }

  /**
   * ========================
   * 🧠 ENRICHED ROUTE RESPONSE
   * ========================
   */
  async process(query) {

    const intent = this.detectIntent(query);

    const data = await this.route(intent);

    return {
      intent,
      timestamp: new Date(),
      data
    };
  }

  /**
   * ========================
   * 🚀 REGISTER NEW INTENT (FUTURE AI AGENTS)
   * ========================
   */
  registerIntent(name, handlerFn) {

    if (!this.customHandlers) {
      this.customHandlers = {};
    }

    this.customHandlers[name] = handlerFn;
  }

  /**
   * ========================
   * 🤖 EXTENDED ROUTING (WITH CUSTOM AGENTS)
   * ========================
   */
  async routeExtended(intent) {

    if (this.customHandlers && this.customHandlers[intent]) {
      return await this.customHandlers[intent]();
    }

    return await this.route(intent);
  }
}

module.exports = new AIChatRouter();
