const AIMetricsService = require("./ai.metrics.service");
const AIEventBus = require("./ai.event.bus.service");
const AIContextMemory = require("./ai.context.memory.service");
const AIVectorStore = require("./ai.vector.store.service");

/**
 * AI MENTOR AGENT - UniMentorAI
 * Personalized Coaching & Learning Guidance Engine
 * Role: Diagnose learner → guide → motivate → adapt learning path
 */

class AIMentorAgent {

  constructor() {

    this.metrics = AIMetricsService;
    this.eventBus = AIEventBus;
    this.memory = AIContextMemory;
    this.vectorStore = AIVectorStore;
  }

  /**
   * ========================
   * 🧠 MAIN MENTOR ENTRY
   * ========================
   */
  async run({ userId, input, context = {} }) {

    // 1. Get full learner context
    const learnerProfile = await this.buildLearnerProfile(userId, input);

    // 2. Diagnose learning state
    const diagnosis = this.diagnoseLearner(learnerProfile);

    // 3. Generate guidance plan
    const plan = this.generateLearningPlan(diagnosis);

    // 4. Emit mentoring event
    this.eventBus.emitAsync("mentor.session.created", {
      userId,
      diagnosis,
    });

    return {
      success: true,
      diagnosis,
      plan,
      message: this.generateMentorMessage(diagnosis, plan),
    };
  }

  /**
   * ========================
   * 🧠 BUILD LEARNER PROFILE
   * ========================
   */
  async buildLearnerProfile(userId, input) {

    const memory = await this.memory.getContext({
      userId,
      sessionId: "default",
      query: input,
    });

    const semanticKnowledge = await this.vectorStore.getUserContext(
      userId,
      input
    );

    return {
      memory,
      semanticKnowledge,
      input,
    };
  }

  /**
   * ========================
   * 🔍 LEARNER DIAGNOSIS ENGINE
   * ========================
   */
  diagnoseLearner(profile) {

    const interactions = profile.memory.longTerm.length;
    const semanticDepth = profile.memory.semantic.length;
    const knowledgeMatches = profile.semanticKnowledge.context.length;

    let level = "BEGINNER";

    if (interactions > 50 && semanticDepth > 20) {
      level = "INTERMEDIATE";
    }

    if (interactions > 120 && knowledgeMatches > 10) {
      level = "ADVANCED";
    }

    const bottleneck =
      knowledgeMatches < 3
        ? "LACK_OF_KNOWLEDGE"
        : interactions < 10
        ? "LOW_ENGAGEMENT"
        : "NONE";

    return {
      level,
      bottleneck,
      confidence: Math.min(100, interactions + semanticDepth),
    };
  }

  /**
   * ========================
   * 📚 LEARNING PLAN GENERATION
   * ========================
   */
  generateLearningPlan(diagnosis) {

    const plan = [];

    if (diagnosis.level === "BEGINNER") {
      plan.push("Start with fundamentals");
      plan.push("Daily 10-minute practice");
    }

    if (diagnosis.level === "INTERMEDIATE") {
      plan.push("Project-based learning");
      plan.push("Increase difficulty gradually");
    }

    if (diagnosis.level === "ADVANCED") {
      plan.push("Real-world simulations");
      plan.push("Mentor-assisted challenges");
    }

    if (diagnosis.bottleneck === "LACK_OF_KNOWLEDGE") {
      plan.push("Reinforcement of basics");
    }

    if (diagnosis.bottleneck === "LOW_ENGAGEMENT") {
      plan.push("Gamification boost");
      plan.push("Short interactive sessions");
    }

    return plan;
  }

  /**
   * ========================
   * 💬 MENTOR MESSAGE GENERATOR
   * ========================
   */
  generateMentorMessage(diagnosis, plan) {

    let message = "👋 ";

    if (diagnosis.level === "BEGINNER") {
      message += "Let’s build your foundations step by step.";
    }

    if (diagnosis.level === "INTERMEDIATE") {
      message += "You’re progressing well — let’s go deeper.";
    }

    if (diagnosis.level === "ADVANCED") {
      message += "You’re at an advanced level — time to master real scenarios.";
    }

    if (diagnosis.bottleneck === "LOW_ENGAGEMENT") {
      message += "I noticed your engagement is low — I’ll simplify your path.";
    }

    message += " Here’s your plan: " + plan.join(", ");

    return message;
  }

  /**
   * ========================
   * 📊 LEARNING PROGRESS INSIGHT
   * ========================
   */
  async getProgressInsight(userId) {

    const memory = await this.memory.getContext({
      userId,
      sessionId: "default",
      query: "progress",
    });

    const progress = memory.longTerm.length;

    return {
      success: true,
      progress,
      trend:
        progress > 100
          ? "STRONG"
          : progress > 50
          ? "STABLE"
          : "WEAK",
    };
  }
}

module.exports = new AIMentorAgent();
