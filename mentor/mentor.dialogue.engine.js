
/**
 * ==========================================
 * 💬 MENTOR DIALOGUE ENGINE
 * UniMentorAI Conversational Intelligence Core
 * ==========================================
 * Responsible for:
 * - adaptive pedagogical dialogue generation
 * - context-aware response shaping
 * - emotional tone alignment
 * - learning-driven conversation flow
 * - multi-turn reasoning continuity
 */

class MentorDialogueEngine {

  constructor({ memory, profile, learningEngine, difficultyAdjuster }) {

    this.memory = memory;
    this.profile = profile;
    this.learningEngine = learningEngine;
    this.difficultyAdjuster = difficultyAdjuster;
  }

  /**
   * ==========================================
   * MAIN RESPONSE ENGINE
   * ==========================================
   */
  generate(userId, input, context) {

    const memory = this.memory.get(userId);
    const profile = this.profile.get(userId);

    // --------------------------------------
    // 1. INTENT ANALYSIS
    // --------------------------------------
    const intent = this.detectIntent(input);

    // --------------------------------------
    // 2. EMOTIONAL STATE
    // --------------------------------------
    const emotion = this.detectEmotion(context, profile);

    // --------------------------------------
    // 3. LEARNING CONTEXT
    // --------------------------------------
    const learning = this.learningEngine.generate(
      userId,
      context,
      profile
    );

    // --------------------------------------
    // 4. DIFFICULTY ADJUSTMENT
    // --------------------------------------
    const difficulty =
      this.difficultyAdjuster.compute(profile, memory, context);

    // --------------------------------------
    // 5. RESPONSE STRATEGY
    // --------------------------------------
    const strategy =
      this.selectStrategy(intent, emotion, profile, context);

    // --------------------------------------
    // 6. RESPONSE BUILDING
    // --------------------------------------
    const response =
      this.buildResponse(strategy, learning, difficulty, context);

    // --------------------------------------
    // 7. MEMORY UPDATE HOOK
    // --------------------------------------
    this.updateMemory(memory, input, response);

    return response;
  }

  /**
   * ==========================================
   * INTENT DETECTION ENGINE
   * ==========================================
   */
  detectIntent(input) {

    const text = (input.text || "").toLowerCase();

    if (text.includes("comment")) return "EXPLANATION";
    if (text.includes("exercice")) return "PRACTICE";
    if (text.includes("pourquoi")) return "DEEP_DIVE";
    if (text.includes("aide")) return "ASSISTANCE";
    if (text.includes("quiz")) return "ASSESSMENT";

    return "GENERAL_LEARNING";
  }

  /**
   * ==========================================
   * EMOTION DETECTION ENGINE
   * ==========================================
   */
  detectEmotion(context, profile) {

    if (profile.emotion?.frustration > 0.7) {
      return "SUPPORTIVE";
    }

    if (context.confusion > 0.7) {
      return "SIMPLIFIED";
    }

    if (profile.emotion?.motivation > 0.7) {
      return "CHALLENGING";
    }

    return "NEUTRAL";
  }

  /**
   * ==========================================
   * STRATEGY SELECTION ENGINE
   * ==========================================
   */
  selectStrategy(intent, emotion, profile, context) {

    if (emotion === "SUPPORTIVE") {
      return "GUIDED_EXPLANATION";
    }

    if (intent === "PRACTICE") {
      return "ACTIVE_PRACTICE";
    }

    if (intent === "DEEP_DIVE") {
      return "DETAILED_REASONING";
    }

    if (emotion === "CHALLENGING") {
      return "ADVANCED_EXPLORATION";
    }

    if (context.engagement > 0.8) {
      return "ACCELERATED_TRAINING";
    }

    return "BALANCED_EXPLANATION";
  }

  /**
   * ==========================================
   * RESPONSE BUILDER ENGINE
   * ==========================================
   */
  buildResponse(strategy, learning, difficulty, context) {

    const base = {
      strategy,
      difficulty: this.difficultyAdjuster.label(difficulty),
      learningNode: learning.skill,
      mode: learning.mode
    };

    // --------------------------------------
    // STRATEGY MAPPING
    // --------------------------------------

    switch (strategy) {

      case "GUIDED_EXPLANATION":
        return {
          ...base,
          type: "EXPLANATION",
          tone: "supportive",
          structure: [
            "simplify concept",
            "step-by-step breakdown",
            "confirm understanding"
          ]
        };

      case "ACTIVE_PRACTICE":
        return {
          ...base,
          type: "INTERACTIVE",
          tone: "engaging",
          structure: [
            "ask question",
            "wait response",
            "correct gently"
          ]
        };

      case "DETAILED_REASONING":
        return {
          ...base,
          type: "DEEP_EXPLANATION",
          tone: "analytical",
          structure: [
            "concept breakdown",
            "logic explanation",
            "real example"
          ]
        };

      case "ADVANCED_EXPLORATION":
        return {
          ...base,
          type: "CHALLENGE",
          tone: "advanced",
          structure: [
            "hard problem",
            "no hints initially",
            "progressive hints"
          ]
        };

      case "ACCELERATED_TRAINING":
        return {
          ...base,
          type: "FAST_TRACK",
          tone: "motivational",
          structure: [
            "quick explanation",
            "immediate exercise",
            "fast feedback loop"
          ]
        };

      default:
        return {
          ...base,
          type: "STANDARD_LESSON",
          tone: "neutral",
          structure: [
            "explain concept",
            "example",
            "practice"
          ]
        };
    }
  }

  /**
   * ==========================================
   * MEMORY UPDATE HOOK
   * ==========================================
   */
  updateMemory(memory, input, response) {

    memory.history.push({
      input: input.text,
      responseType: response.type,
      timestamp: Date.now()
    });

    if (memory.history.length > 300) {
      memory.history.shift();
    }
  }
}

module.exports = MentorDialogueEngine;
