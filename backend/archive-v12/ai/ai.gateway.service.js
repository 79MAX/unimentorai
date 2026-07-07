const AIMetricsService = require("./ai.metrics.service");
const PromptEngine = require("./ai.prompt.engine");
const LearningEngine = require("./ai.adaptive.learning.service");
const RecommendationEngine = require("./ai.recommendation.engine");

/**
 * AI GATEWAY - UniMentorAI
 * Central brain orchestrator (entry point AI system)
 * Supports: learning loop + metrics + personalization
 */

class AIGatewayService {
  constructor() {
    this.metrics = AIMetricsService;
    this.promptEngine = new PromptEngine();
    this.learningEngine = new LearningEngine();
    this.recommendationEngine = new RecommendationEngine(this.learningEngine);
  }

  /**
   * 🧠 MAIN ENTRY POINT
   */
  async handleRequest({ userId, type, input, context = {} }) {
    const startTime = Date.now();

    try {
      // ========================
      // 1. LOAD USER INTELLIGENCE
      // ========================
      const userProfile = await this.learningEngine.getUserProfile(userId);

      // ========================
      // 2. BUILD OPTIMIZED PROMPT
      // ========================
      const promptPackage = await this.promptEngine.build({
        input,
        type,
        userProfile,
        context,
      });

      // ========================
      // 3. CALL AI MODEL (ABSTRACTION LAYER)
      // ========================
      const aiResponse = await this.callAIModel(
        promptPackage.optimizedPrompt
      );

      const latency = Date.now() - startTime;

      // ========================
      // 4. METRICS LOGGING
      // ========================
      await this.metrics.logInteraction({
        userId,
        prompt: input,
        response: aiResponse,
        type,
        latencyMs: latency,
        tokensUsed: this.estimateTokens(promptPackage, aiResponse),
        cost: this.estimateCost(promptPackage, aiResponse),
        success: true,
      });

      // ========================
      // 5. UPDATE LEARNING ENGINE
      // ========================
      await this.learningEngine.update(userId, {
        input,
        response: aiResponse,
        type,
      });

      // ========================
      // 6. GENERATE RECOMMENDATIONS
      // ========================
      const recommendations =
        await this.recommendationEngine.generate(userId);

      // ========================
      // 7. FINAL RESPONSE PACKAGE
      // ========================
      return {
        success: true,
        data: {
          response: aiResponse,
          recommendations: recommendations.recommendations,
          meta: {
            latency,
            model: "unimentor-ai-core",
          },
        },
      };

    } catch (error) {
      // ========================
      // ERROR TRACKING
      // ========================
      await this.metrics.logInteraction({
        userId,
        prompt: input,
        response: null,
        type,
        latencyMs: Date.now() - startTime,
        success: false,
        errorMessage: error.message,
      });

      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * 🤖 AI MODEL ABSTRACTION LAYER
   * (future: OpenAI / Claude / local LLM / RAG)
   */
  async callAIModel(prompt) {
    // MOCK LAYER (replace with real provider later)
    return `AI_RESPONSE: ${prompt}`;
  }

  /**
   * 💰 TOKEN ESTIMATION (cost control)
   */
  estimateTokens(promptPackage, response) {
    const inputTokens = promptPackage.optimizedPrompt.length / 4;
    const outputTokens = response.length / 4;
    return Math.round(inputTokens + outputTokens);
  }

  /**
   * 💵 COST ESTIMATION (SaaS control)
   */
  estimateCost(promptPackage, response) {
    const tokens = this.estimateTokens(promptPackage, response);
    return tokens * 0.00002; // mock pricing model
  }

  /**
   * 🔁 DIRECT BRAIN SHORTCUT (FOR INTERNAL AGENTS)
   */
  async quickThink(userId, input) {
    return this.handleRequest({
      userId,
      type: "chat",
      input,
      context: { mode: "quick" },
    });
  }

  /**
   * 🧠 MULTI-TYPE AI ROUTING
   */
  async route({ userId, input, type }) {
    const supportedTypes = [
      "chat",
      "course_generation",
      "quiz_generation",
      "recommendation",
      "assessment",
    ];

    if (!supportedTypes.includes(type)) {
      type = "chat";
    }

    return this.handleRequest({
      userId,
      type,
      input,
      context: {},
    });
  }
}

module.exports = new AIGatewayService();
