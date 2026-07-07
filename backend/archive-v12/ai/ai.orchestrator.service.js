const AITutorAgent = require("./agents/ai.tutor.agent");
const AIMentorAgent = require("./agents/ai.mentor.agent");
const AIMarketAgent = require("./agents/ai.market.agent");
const AIAdminAgent = require("./agents/ai.admin.agent");
const RecommendationEngine = require("./ai.recommendation.engine");
const AIMetricsService = require("./ai.metrics.service");

/**
 * AI ORCHESTRATOR - UniMentorAI
 * Multi-agent brain coordinator
 * Role: Route, merge, prioritize AI responses
 */

class AIOrchestratorService {

  constructor() {
    this.tutor = AITutorAgent;
    this.mentor = AIMentorAgent;
    this.market = AIMarketAgent;
    this.admin = AIAdminAgent;
    this.reco = new RecommendationEngine();
    this.metrics = AIMetricsService;
  }

  /**
   * 🧠 MAIN ENTRY POINT (UNIFIED AI BRAIN)
   */
  async handle({ userId, input, mode = "auto", context = {} }) {

    const startTime = Date.now();

    try {

      // ========================
      // 1. ROUTE INTELLIGENT (AI DECISION)
      // ========================
      const route = this.routeIntent(input, mode);

      // ========================
      // 2. EXECUTE AGENTS
      // ========================
      const responses = await this.executeAgents(userId, route, input, context);

      // ========================
      // 3. MERGE RESULTS
      // ========================
      const finalResponse = this.mergeResponses(responses);

      // ========================
      // 4. ADD RECOMMENDATIONS
      // ========================
      const recommendations = await this.reco.generate(userId);

      // ========================
      // 5. LOG METRICS
      // ========================
      await this.metrics.logInteraction({
        userId,
        prompt: input,
        response: JSON.stringify(finalResponse),
        type: "orchestrator",
        latencyMs: Date.now() - startTime,
        success: true,
      });

      // ========================
      // 6. FINAL OUTPUT
      // ========================
      return {
        success: true,
        data: {
          response: finalResponse,
          recommendations: recommendations.recommendations,
          route,
        },
      };

    } catch (error) {

      await this.metrics.logInteraction({
        userId,
        prompt: input,
        response: null,
        type: "orchestrator",
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
   * 🎯 INTENT ROUTER (CORE AI DECISION ENGINE)
   */
  routeIntent(input, mode) {

    const text = input.toLowerCase();

    // ========================
    // ADMIN INTENT
    // ========================
    if (text.includes("system") || text.includes("status")) {
      return ["admin"];
    }

    // ========================
    // LEARNING INTENT
    // ========================
    if (text.includes("learn") || text.includes("course")) {
      return ["tutor"];
    }

    // ========================
    // CAREER / GUIDANCE
    // ========================
    if (text.includes("help") || text.includes("advise")) {
      return ["mentor"];
    }

    // ========================
    // BUSINESS / MONETIZATION
    // ========================
    if (text.includes("buy") || text.includes("price")) {
      return ["market"];
    }

    // ========================
    // AUTO MODE (FULL BRAIN)
    // ========================
    if (mode === "auto") {
      return ["tutor", "mentor"];
    }

    return ["tutor"];
  }

  /**
   * ⚙️ EXECUTE SELECTED AGENTS
   */
  async executeAgents(userId, route, input, context) {

    const results = [];

    for (const agent of route) {

      switch (agent) {

        case "tutor":
          results.push(await this.tutor.run({
            userId,
            topic: input,
            context,
          }));
          break;

        case "mentor":
          results.push(await this.mentor.run({
            userId,
            goal: input,
            context,
          }));
          break;

        case "market":
          results.push(await this.market.run({
            userId,
            context,
          }));
          break;

        case "admin":
          results.push(await this.admin.run({
            command: "system_health",
            context,
          }));
          break;
      }
    }

    return results;
  }

  /**
   * 🧠 RESPONSE MERGER ENGINE
   */
  mergeResponses(responses) {

    if (responses.length === 1) {
      return responses[0].data || responses[0];
    }

    return {
      combined: true,
      parts: responses.map(r => r.data || r),
    };
  }

  /**
   * ⚡ QUICK MODE (FAST RESPONSE)
   */
  async quick(userId, input) {

    return this.handle({
      userId,
      input,
      mode: "quick",
    });
  }

  /**
   * 🔥 FULL BRAIN MODE (ALL AGENTS)
   */
  async fullBrain(userId, input) {

    return this.handle({
      userId,
      input,
      mode: "auto",
    });
  }
}

module.exports = new AIOrchestratorService();
