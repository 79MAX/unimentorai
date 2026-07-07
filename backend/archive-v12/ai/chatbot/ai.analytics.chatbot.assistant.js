
const RevenueService = require("../../analytics/revenue.service");
const ForecastEngine = require("../ai.revenue.forecast.service");
const GrowthDetector = require("../ai.growth.signal.detector");
const BusinessAI = require("../ai.business.recommendation.engine");

/**
 * ========================
 * 🤖 AI ANALYTICS CHATBOT ASSISTANT
 * UniMentorAI SaaS Brain Layer v2
 * ========================
 * Converts natural language → structured business intelligence
 */

class AIAnalyticsChatbotAssistant {

  /**
   * ========================
   * 🧠 INTENT CLASSIFICATION (LIGHT NLP)
   * ========================
   */
  detectIntent(query) {

    const q = query.toLowerCase();

    if (q.includes("revenue") || q.includes("argent") || q.includes("money")) {
      return "revenue";
    }

    if (q.includes("growth") || q.includes("croissance") || q.includes("évolution")) {
      return "growth";
    }

    if (q.includes("predict") || q.includes("forecast") || q.includes("prévision")) {
      return "forecast";
    }

    if (q.includes("strategy") || q.includes("business") || q.includes("quoi faire")) {
      return "strategy";
    }

    return "dashboard";
  }

  /**
   * ========================
   * 🧠 ROUTER ENGINE
   * ========================
   */
  async routeIntent(intent) {

    switch (intent) {

      case "revenue":
        return await RevenueService.getDashboard();

      case "growth":
        return await GrowthDetector.getFullGrowthReport();

      case "forecast":
        return await ForecastEngine.getForecastReport();

      case "strategy":
        return await BusinessAI.getFullReport();

      default:
        return await RevenueService.getDashboard();
    }
  }

  /**
   * ========================
   * 💡 RESPONSE NORMALIZER
   * ========================
   */
  formatResponse(intent, data) {

    return {
      intent,
      success: true,
      timestamp: new Date(),
      summary: this.generateSummary(intent, data),
      data
    };
  }

  /**
   * ========================
   * 🧠 AI SUMMARY GENERATOR
   * ========================
   */
  generateSummary(intent, data) {

    switch (intent) {

      case "revenue":
        return `📊 Ton revenu total est de ${data.revenue?.total || 0} avec une performance globale du SaaS.`;

      case "growth":
        return `📈 Ton business est en phase: ${data.analysis?.state || "stable"} avec un score de ${data.analysis?.score || 0}/100.`;

      case "forecast":
        return `🔮 Prévision générée avec tendance de ${data.forecast?.meta?.trend || 0}.`;

      case "strategy":
        return `💡 Stratégie actuelle: ${data.strategy?.focus || "optimisation générale"}.`;

      default:
        return "📊 Analyse globale du système disponible.";
    }
  }

  /**
   * ========================
   * 🤖 MAIN CHAT ENTRY POINT
   * ========================
   */
  async chat(query) {

    const intent = this.detectIntent(query);

    const data = await this.routeIntent(intent);

    return this.formatResponse(intent, data);
  }
}

module.exports = new AIAnalyticsChatbotAssistant();
