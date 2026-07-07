const AIMetricsService = require("./ai.metrics.service");
const AIEventBus = require("./ai.event.bus.service");
const AIContextMemory = require("./ai.context.memory.service");
const AIVectorStore = require("./ai.vector.store.service");

/**
 * AI TUTOR AGENT - UniMentorAI
 * Real-time Teaching & Explanation Engine
 * Role: Explain → Teach → Simplify → Test → Reinforce
 */

class AITutorAgent {

  constructor() {

    this.metrics = AIMetricsService;
    this.eventBus = AIEventBus;
    this.memory = AIContextMemory;
    this.vectorStore = AIVectorStore;
  }

  /**
   * ========================
   * 🧠 MAIN TUTOR ENTRY
   * ========================
   */
  async run({ userId, input, context = {} }) {

    // 1. Build learning context
    const learningContext = await this.buildContext(userId, input);

    // 2. Detect intent (explain / exercise / quiz)
    const intent = this.detectIntent(input);

    // 3. Generate teaching response
    const response = this.generateResponse(intent, learningContext);

    // 4. Emit tutoring event
    this.eventBus.emitAsync("tutor.session.created", {
      userId,
      intent,
    });

    return {
      success: true,
      intent,
      response,
    };
  }

  /**
   * ========================
   * 🧠 BUILD LEARNING CONTEXT
   * ========================
   */
  async buildContext(userId, input) {

    const memory = await this.memory.getContext({
      userId,
      sessionId: "default",
      query: input,
    });

    const knowledge = await this.vectorStore.search({
      query: input,
      userId,
      limit: 5,
    });

    return {
      memory,
      knowledge,
      input,
    };
  }

  /**
   * ========================
   * 🎯 INTENT DETECTION ENGINE
   * ========================
   */
  detectIntent(input) {

    const text = input.toLowerCase();

    if (text.includes("exercice") || text.includes("practice")) {
      return "EXERCISE";
    }

    if (text.includes("quiz") || text.includes("test")) {
      return "QUIZ";
    }

    if (text.includes("résume") || text.includes("summary")) {
      return "SUMMARY";
    }

    return "EXPLANATION";
  }

  /**
   * ========================
   * 📚 RESPONSE GENERATION ENGINE
   * ========================
   */
  generateResponse(intent, context) {

    switch (intent) {

      case "EXPLANATION":
        return this.explain(context);

      case "EXERCISE":
        return this.createExercise(context);

      case "QUIZ":
        return this.createQuiz(context);

      case "SUMMARY":
        return this.summarize(context);

      default:
        return this.explain(context);
    }
  }

  /**
   * ========================
   * 🧠 EXPLANATION ENGINE
   * ========================
   */
  explain(context) {

    const knowledge = context.knowledge[0]?.text || "Not enough data";

    return `
📚 EXPLANATION:

${knowledge}

💡 Simplification:
Imagine this like a real-world example...

🎯 Key idea:
- Focus on understanding the concept first
- Then practice with examples
`;
  }

  /**
   * ========================
   * 🏋️ EXERCISE GENERATOR
   * ========================
   */
  createExercise(context) {

    return `
🏋️ EXERCISE:

Based on your level:

1. Explain the concept in your own words
2. Give a real-life example
3. Solve a simple variation

💡 Tip: Start simple, then increase difficulty.
`;
  }

  /**
   * ========================
   * 🧪 QUIZ GENERATOR
   * ========================
   */
  createQuiz(context) {

    return `
🧪 QUIZ:

1. What is the main concept?
2. Give one example
3. What happens if we change variable X?

🎯 Goal: Check understanding, not memorization.
`;
  }

  /**
   * ========================
   * 📖 SUMMARY ENGINE
   * ========================
   */
  summarize(context) {

    const knowledge = context.knowledge;

    return `
📖 SUMMARY:

${knowledge.map(k => "- " + k.text).join("\n")}

🎯 Key takeaway:
Focus on core principles, not details.
`;
  }

  /**
   * ========================
   * 📊 LEARNING FEEDBACK LOOP
   * ========================
   */
  async feedback(userId, result) {

    this.eventBus.emitAsync("tutor.feedback", {
      userId,
      result,
    });
  }
}

module.exports = new AITutorAgent();
