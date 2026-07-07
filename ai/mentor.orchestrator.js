/**
 * ==========================================
 * 🧠 MENTOR ORCHESTRATOR
 * UniMentorAI Core AI Pipeline
 * ==========================================
 * Responsibilities:
 * - orchestrate full AI learning pipeline
 * - manage data flow between engines
 * - ensure deterministic execution
 * - produce structured AI result
 * ==========================================
 */

class MentorOrchestrator {

  constructor(deps = {}) {

    this.contextAnalyzer = deps.contextAnalyzer;
    this.memoryStore = deps.memoryStore;
    this.learningEngine = deps.learningEngine;
    this.personalityEngine = deps.personalityEngine;
    this.difficultyAdjuster = deps.difficultyAdjuster;
    this.dialogueEngine = deps.dialogueEngine;
    this.responseGenerator = deps.responseGenerator;
    this.feedbackLoop = deps.feedbackLoop;
    this.analyticsEngine = deps.analyticsEngine;
  }

  /**
   * ==========================================
   * MAIN PIPELINE
   * ==========================================
   */
  async run(userId, input) {

    // --------------------------
    // 1. LOAD MEMORY
    // --------------------------
    const memory =
      this.memoryStore.get(userId) || {
        profile: {},
        history: []
      };

    // --------------------------
    // 2. CONTEXT ANALYSIS
    // --------------------------
    const context =
      this.contextAnalyzer.analyze(
        input,
        memory
      );

    // --------------------------
    // 3. LEARNING ENGINE
    // --------------------------
    const learning =
      this.learningEngine.process(
        userId,
        context,
        memory
      );

    // --------------------------
    // 4. PERSONALITY ENGINE
    // --------------------------
    const personality =
      this.personalityEngine.resolve(
        memory.profile,
        context
      );

    // --------------------------
    // 5. DIFFICULTY ADJUSTMENT
    // --------------------------
    const difficulty =
      this.difficultyAdjuster.compute(
        memory.profile,
        memory,
        context
      );

    // --------------------------
    // 6. DIALOGUE ENGINE
    // --------------------------
    const dialogue =
      this.dialogueEngine.generate(
        userId,
        input,
        context
      );

    // --------------------------
    // 7. RESPONSE GENERATION
    // --------------------------
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

    // --------------------------
    // 8. FEEDBACK LOOP (POST RESPONSE LEARNING)
    // --------------------------
    this.feedbackLoop.process(
      userId,
      response,
      context
    );

    // --------------------------
    // 9. MEMORY UPDATE
    // --------------------------
    this.memoryStore.update(userId, {
      lastInput: input.text,
      lastResponse: response,
      lastContext: context,
      updatedAt: Date.now()
    });

    // --------------------------
    // 10. ANALYTICS TRACKING
    // --------------------------
    this.analyticsEngine.track(
      userId,
      {
        success:
          context.confusion < 0.5,

        engagement:
          context.engagement || 0.5,

        masteryGain:
          learning.masteryGain || 0
      },
      context
    );

    // --------------------------
    // FINAL OUTPUT
    // --------------------------
    return {
      userId,

      context,

      learning,

      difficulty,

      personality,

      dialogue,

      response: response.response,

      metadata: response.metadata || {},

      timestamp:
        Date.now()
    };
  }
}

module.exports =
  MentorOrchestrator;
