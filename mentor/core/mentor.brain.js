
/**
 * ==========================================
 * 🧠 MENTOR BRAIN (MVP CORE)
 * UniMentorAI Central Decision Engine
 * ==========================================
 * Role:
 * - central coordinator of all mentor modules
 * - lightweight decision brain (NOT heavy AI logic)
 * - routes data between learning, personality, response
 */

class MentorBrain {

  constructor({
    contextAnalyzer,
    memoryStore,
    learningEngine,
    personalityEngine,
    difficultyAdjuster,
    dialogueEngine,
    responseGenerator,
    feedbackLoop,
    analyticsEngine
  }) {

    this.contextAnalyzer = contextAnalyzer;
    this.memoryStore = memoryStore;
    this.learningEngine = learningEngine;
    this.personalityEngine = personalityEngine;
    this.difficultyAdjuster = difficultyAdjuster;
    this.dialogueEngine = dialogueEngine;
    this.responseGenerator = responseGenerator;
    this.feedbackLoop = feedbackLoop;
    this.analyticsEngine = analyticsEngine;
  }

  /**
   * ==========================================
   * MAIN ENTRY POINT
   * ==========================================
   */
  async process(userId, input) {

    // --------------------------------------
    // 1. LOAD USER STATE
    // --------------------------------------
    const memory = this.memoryStore.get(userId);

    // --------------------------------------
    // 2. ANALYZE CONTEXT
    // --------------------------------------
    const context = this.contextAnalyzer.analyze(input, memory);

    // --------------------------------------
    // 3. UPDATE LEARNING STATE
    // --------------------------------------
    const learning = this.learningEngine.process(userId, context, memory);

    // --------------------------------------
    // 4. PERSONALITY ADAPTATION
    // --------------------------------------
    const personality = this.personalityEngine.resolve(
      memory.profile,
      context
    );

    // --------------------------------------
    // 5. DIFFICULTY ADJUSTMENT
    // --------------------------------------
    const difficulty = this.difficultyAdjuster.compute(
      memory.profile,
      memory,
      context
    );

    // --------------------------------------
    // 6. DIALOGUE STRUCTURE
    // --------------------------------------
    const dialogue = this.dialogueEngine.generate(
      userId,
      input,
      context
    );

    // --------------------------------------
    // 7. RESPONSE GENERATION
    // --------------------------------------
    const response = this.responseGenerator.generate(
      userId,
      input,
      context,
      {
        learning,
        personality,
        difficulty,
        dialogue
      }
    );

    // --------------------------------------
    // 8. FEEDBACK LOOP UPDATE
    // --------------------------------------
    this.feedbackLoop.process(userId, response, context);

    // --------------------------------------
    // 9. ANALYTICS TRACKING
    // --------------------------------------
    this.analyticsEngine.track(
      userId,
      {
        success: context.success || false,
        engagement: context.engagement || 0,
        masteryGain: learning?.masteryGain || 0
      },
      context
    );

    // --------------------------------------
    // 10. UPDATE MEMORY
    // --------------------------------------
    this.memoryStore.update(userId, {
      lastInput: input,
      lastResponse: response,
      lastContext: context
    });

    // --------------------------------------
    // FINAL OUTPUT
    // --------------------------------------
    return response;
  }
}

module.exports = MentorBrain;
