/**
 * ==========================================
 * 🧠 MENTOR ORCHESTRATOR
 * UniMentorAI Main AI Pipeline Controller
 * ==========================================
 * Responsibilities:
 * - orchestrate all mentor modules
 * - manage full AI learning pipeline
 * - ensure data flow consistency
 * - produce final user response
 * ==========================================
 */

class MentorOrchestrator {

  constructor(dependencies) {

    // Inject all modules (clean architecture MVP)
    this.contextAnalyzer = dependencies.contextAnalyzer;
    this.memoryStore = dependencies.memoryStore;
    this.learningEngine = dependencies.learningEngine;
    this.personalityEngine = dependencies.personalityEngine;
    this.difficultyAdjuster = dependencies.difficultyAdjuster;
    this.dialogueEngine = dependencies.dialogueEngine;
    this.responseGenerator = dependencies.responseGenerator;
    this.feedbackLoop = dependencies.feedbackLoop;
    this.analyticsEngine = dependencies.analyticsEngine;
  }

  /**
   * ==========================================
   * MAIN PIPELINE ENTRY
   * ==========================================
   */
  async run(userId, input) {

    // -----------------------------
    // 1. LOAD MEMORY
    // -----------------------------
    const memory =
      this.memoryStore.get(userId);

    // -----------------------------
    // 2. CONTEXT ANALYSIS
    // -----------------------------
    const context =
      this.contextAnalyzer.analyze(
        input,
        memory
      );

    // -----------------------------
    // 3. LEARNING ENGINE
    // -----------------------------
    const learning =
      this.learningEngine.process(
        userId,
        context,
        memory
      );

    // -----------------------------
    // 4. DIFFICULTY ADJUSTMENT
    // -----------------------------
    const difficulty =
      this.difficultyAdjuster.compute(
        memory.profile,
        memory,
        context
      );

    // -----------------------------
    // 5. PERSONALITY ENGINE
    // -----------------------------
    const personality =
      this.personalityEngine.resolve(
        memory.profile,
        context
      );

    // -----------------------------
    // 6. DIALOGUE ENGINE
    // -----------------------------
    const dialogue =
      this.dialogueEngine.generate(
        userId,
        input,
        context
      );

    // -----------------------------
    // 7. RESPONSE GENERATION
    // -----------------------------
    const response =
      this.responseGenerator.generate(
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

    // -----------------------------
    // 8. FEEDBACK LOOP
    // -----------------------------
    this.feedbackLoop.process(
      userId,
      response,
      context
    );

    // -----------------------------
    // 9. MEMORY UPDATE
    // -----------------------------
    this.memoryStore.update(userId, {
      lastInput: input.text,
      lastResponse: response,
      lastContext: context
    });

    // -----------------------------
    // 10. ANALYTICS TRACKING
    // -----------------------------
    this.analyticsEngine.track(
      userId,
      {
        success:
          context.confusion < 0.5,

        engagement:
          context.engagement,

        masteryGain:
          learning.masteryGain
      },
      context
    );

    // -----------------------------
    // FINAL OUTPUT
    // -----------------------------
    return {
      userId,
      context,
      learning,
      difficulty,
      personality,
      dialogue,
      response
    };
  }
}

module.exports =
  MentorOrchestrator;
