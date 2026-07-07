const LearningEngine = require("../ai.adaptive.learning.service");
const AIMetricsService = require("../ai.metrics.service");
const PromptEngine = require("../ai.prompt.engine");

/**
 * AI TUTOR AGENT - UniMentorAI
 * Autonomous pedagogical agent
 * Role: Teach, explain, adapt, evaluate, guide
 */

class AITutorAgent {

  constructor() {
    this.learningEngine = LearningEngine;
    this.metrics = AIMetricsService;
    this.promptEngine = new PromptEngine();
  }

  /**
   * 🧠 MAIN TUTOR ENTRY
   */
  async run({ userId, topic, context = {} }) {

    const startTime = Date.now();

    try {

      // ========================
      // 1. LOAD USER INTELLIGENCE
      // ========================
      const profile = await this.learningEngine.getUserProfile(userId);

      // ========================
      // 2. BUILD EDUCATIONAL PROMPT
      // ========================
      const promptPackage = await this.promptEngine.build({
        input: topic,
        type: "course_generation",
        userProfile: profile,
        context: {
          mode: "tutor_agent",
          ...context,
        },
      });

      // ========================
      // 3. GENERATE EXPLANATION
      // ========================
      const lesson = await this.generateLesson(promptPackage.optimizedPrompt);

      // ========================
      // 4. ADAPT DIFFICULTY
      // ========================
      const adaptedLesson = this.adaptToLevel(lesson, profile.level);

      // ========================
      // 5. SUGGEST NEXT STEP
      // ========================
      const nextStep = this.suggestNextStep(profile, topic);

      // ========================
      // 6. UPDATE LEARNING MEMORY
      // ========================
      await this.learningEngine.update(userId, {
        input: topic,
        response: lesson,
        type: "tutor",
      });

      // ========================
      // 7. METRICS LOGGING
      // ========================
      await this.metrics.logInteraction({
        userId,
        prompt: topic,
        response: lesson,
        type: "tutor",
        latencyMs: Date.now() - startTime,
        success: true,
      });

      // ========================
      // 8. FINAL OUTPUT
      // ========================
      return {
        success: true,
        data: {
          lesson: adaptedLesson,
          nextStep,
          level: profile.level,
        },
      };

    } catch (error) {

      await this.metrics.logInteraction({
        userId,
        prompt: topic,
        response: null,
        type: "tutor",
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
   * 📚 LESSON GENERATION ENGINE
   */
  async generateLesson(prompt) {

    // MOCK AI CALL (replace with OpenAI / Claude later)
    return `
📚 LESSON GENERATED

Based on your topic:
${prompt}

1. Introduction
- Core explanation of the topic

2. Key Concepts
- Important fundamentals

3. Example
- Practical illustration

4. Summary
- Key takeaways
`;
  }

  /**
   * 🎯 ADAPT CONTENT TO USER LEVEL
   */
  adaptToLevel(lesson, level) {

    if (level === "beginner") {
      return `
🟢 BEGINNER MODE

${lesson}

💡 Tip: Focus on understanding basics first.
`;
    }

    if (level === "intermediate") {
      return `
🟡 INTERMEDIATE MODE

${lesson}

⚡ Challenge: Try applying this in a real case.
`;
    }

    if (level === "advanced") {
      return `
🔴 ADVANCED MODE

${lesson}

🚀 Task: Implement or teach this concept to others.
`;
    }

    return lesson;
  }

  /**
   * 🔁 NEXT STEP ENGINE
   */
  suggestNextStep(profile, topic) {

    if (profile.level === "beginner") {
      return {
        type: "quiz",
        action: "Test basic understanding",
      };
    }

    if (profile.level === "intermediate") {
      return {
        type: "exercise",
        action: "Practice application",
      };
    }

    return {
      type: "project",
      action: "Build real-world project",
    };
  }

  /**
   * ⚡ QUICK TUTOR MODE
   */
  async quickExplain(userId, topic) {

    return this.run({
      userId,
      topic,
      context: { mode: "quick" },
    });
  }

  /**
   * 🧠 DEEP TUTOR MODE (STRUCTURED LEARNING)
   */
  async deepTeach(userId, topic) {

    return this.run({
      userId,
      topic,
      context: { mode: "deep" },
    });
  }
}

module.exports = new AITutorAgent();
