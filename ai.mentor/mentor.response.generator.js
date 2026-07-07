
/**
 * ==========================================
 * 🧠 MENTOR RESPONSE GENERATOR
 * UniMentorAI Final Output Composer
 * ==========================================
 * Responsible for:
 * - final response structuring
 * - multi-layer AI output formatting
 * - UI-ready payload generation
 * - consistency enforcement
 * - tutor-friendly formatting
 */

class MentorResponseGenerator {

  constructor({
    dialogueEngine,
    personalityEngine
  }) {

    this.dialogueEngine = dialogueEngine;
    this.personalityEngine = personalityEngine;
  }

  /**
   * ==========================================
   * MAIN RESPONSE GENERATION PIPELINE
   * ==========================================
   */
  generate(userId, input, context, learningState, memory) {

    // --------------------------------------
    // 1. DIALOGUE GENERATION
    // --------------------------------------
    const dialogue =
      this.dialogueEngine.generate(
        userId,
        input,
        context,
        learningState
      );

    // --------------------------------------
    // 2. STRUCTURED RESPONSE BUILDING
    // --------------------------------------
    const response =
      this.buildStructuredResponse(dialogue, context, learningState);

    // --------------------------------------
    // 3. UI ENRICHMENT LAYER
    // --------------------------------------
    const uiPayload =
      this.buildUIPayload(context, learningState);

    // --------------------------------------
    // 4. FINAL PACKAGING
    // --------------------------------------
    return {
      success: true,

      message: response.message,

      type: response.type,

      tone: response.tone,

      suggestions: response.suggestions,

      nextStep: response.nextStep,

      ui: uiPayload,

      meta: {
        userId,
        timestamp: Date.now(),
        difficulty: learningState.targetDifficulty,
        mastery: learningState.mastery
      }
    };
  }

  /**
   * ==========================================
   * STRUCTURED RESPONSE BUILDER
   * ==========================================
   */
  buildStructuredResponse(dialogue, context, learningState) {

    return {
      message: dialogue.message,

      type: dialogue.type || "CONTINUE",

      tone: dialogue.tone || "neutral",

      suggestions: dialogue.suggestions || [],

      nextStep: dialogue.nextStep || null
    };
  }

  /**
   * ==========================================
   * UI PAYLOAD GENERATOR (FRONTEND READY)
   * ==========================================
   */
  buildUIPayload(context, learningState) {

    return {
      difficulty: learningState.targetDifficulty,

      progress: learningState.progress || 0,

      engagement: context.engagement,

      confusion: context.confusion,

      status: this.getLearningStatus(learningState, context),

      visualHints: this.getVisualHints(context)
    };
  }

  /**
   * ==========================================
   * LEARNING STATUS ENGINE
   * ==========================================
   */
  getLearningStatus(learningState, context) {

    if (context.confusion > 0.7) {
      return "STRUGGLING";
    }

    if (learningState.mastery > 0.8) {
      return "ADVANCED";
    }

    if (context.engagement > 0.7) {
      return "FLOW_STATE";
    }

    return "LEARNING";
  }

  /**
   * ==========================================
   * VISUAL HINTS FOR VIDEO/UI TUTOR
   * ==========================================
   */
  getVisualHints(context) {

    const hints = [];

    if (context.confusion > 0.6) {
      hints.push("show_simple_example");
    }

    if (context.engagement < 0.4) {
      hints.push("add_interactive_exercise");
    }

    if (context.emotionalSignal === "frustrated") {
      hints.push("show_encouragement_ui");
    }

    return hints;
  }

  /**
   * ==========================================
   * RESPONSE QUALITY VALIDATION
   * ==========================================
   */
  validate(response) {

    if (!response.message) {
      throw new Error("INVALID_RESPONSE: missing message");
    }

    if (response.message.length < 5) {
      throw new Error("INVALID_RESPONSE: message too short");
    }

    return true;
  }
}

module.exports = MentorResponseGenerator;
