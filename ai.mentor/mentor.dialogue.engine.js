
/**
 * ==========================================
 * 💬 MENTOR DIALOGUE ENGINE
 * UniMentorAI Conversational Orchestrator
 * ==========================================
 * Responsible for:
 * - natural pedagogical dialogue generation
 * - response structuring
 * - tone + personality integration
 * - learning-aware communication
 * - multi-turn conversation coherence
 */

class MentorDialogueEngine {

  constructor({
    brain,
    personalityEngine,
    memory,
    learningEngine,
    skillGraph
  }) {

    this.brain = brain;
    this.personalityEngine = personalityEngine;
    this.memory = memory;
    this.learningEngine = learningEngine;
    this.skillGraph = skillGraph;
  }

  /**
   * ==========================================
   * MAIN DIALOGUE GENERATION PIPELINE
   * ==========================================
   */
  generate(userId, input, context, learningState) {

    const memory = this.memory.get(userId);

    // --------------------------------------
    // 1. BRAIN DECISION
    // --------------------------------------
    const decision =
      this.brain.decideResponse({
        context,
        memory,
        learningState
      });

    // --------------------------------------
    // 2. PERSONALITY SHAPING
    // --------------------------------------
    const personality =
      this.personalityEngine.adapt({
        memory,
        context,
        learningState
      });

    // --------------------------------------
    // 3. BASE MESSAGE
    // --------------------------------------
    let message =
      this.buildMessage(decision, context, learningState);

    // --------------------------------------
    // 4. PERSONALITY ENHANCEMENT
    // --------------------------------------
    message =
      this.applyTone(message, personality.profile);

    // --------------------------------------
    // 5. LEARNING CONTEXT ENRICHMENT
    // --------------------------------------
    const suggestions =
      this.generateSuggestions(userId, context, learningState);

    // --------------------------------------
    // 6. MEMORY UPDATE SIGNAL
    // --------------------------------------
    this.memory.store(userId, {
      input,
      response: message,
      context,
      learningState,
      timestamp: Date.now()
    });

    // --------------------------------------
    // FINAL OUTPUT
    // --------------------------------------
    return {
      message,
      type: decision.type,
      tone: personality.profile.tone,
      suggestions,
      nextStep: this.getNextStep(userId)
    };
  }

  /**
   * ==========================================
   * MESSAGE BUILDER (PEDAGOGICAL CORE)
   * ==========================================
   */
  buildMessage(decision, context, learningState) {

    switch (decision.type) {

      case "SIMPLIFY_EXPLANATION":
        return "On va simplifier ça étape par étape pour que tu comprennes facilement.";

      case "ENGAGEMENT_BOOST":
        return "Regardons un exemple concret pour rendre ça plus clair.";

      case "ADVANCED_CHALLENGE":
        return "Parfait, passons maintenant à un niveau plus avancé.";

      case "REINFORCEMENT":
        return "On va revoir ça différemment pour bien maîtriser le concept.";

      default:
        return "Continuons ensemble.";
    }
  }

  /**
   * ==========================================
   * APPLY PERSONALITY TONE
   * ==========================================
   */
  applyTone(message, profile) {

    const prefixMap = {
      encouraging: "💪",
      calm: "🧠",
      challenging: "🔥",
      supportive: "🤝",
      friendly: "👉"
    };

    const prefix =
      prefixMap[profile.tone] || "👉";

    return `${prefix} ${message}`;
  }

  /**
   * ==========================================
   * GENERATE SMART SUGGESTIONS
   * ==========================================
   */
  generateSuggestions(userId, context, learningState) {

    const suggestions = [];

    const nextSkills =
      this.skillGraph.getNextSkills(userId);

    if (context.confusion > 0.6) {
      suggestions.push("Voir un exemple simple");
    }

    if (learningState.mastery > 0.7) {
      suggestions.push("Passer au niveau suivant");
    }

    if (nextSkills.length > 0) {
      suggestions.push(`Apprendre: ${nextSkills[0]}`);
    }

    return suggestions;
  }

  /**
   * ==========================================
   * NEXT STEP PREDICTION
   * ==========================================
   */
  getNextStep(userId) {

    const nextSkills =
      this.skillGraph.getNextSkills(userId);

    return nextSkills[0] || "review_current_topic";
  }

  /**
   * ==========================================
   * CONVERSATION CONTEXT MEMORY CHECK
   * ==========================================
   */
  maintainCoherence(userId, input) {

    const memory = this.memory.get(userId);

    const lastInteraction =
      memory.history?.slice(-1)[0];

    if (!lastInteraction) return true;

    return lastInteraction.context?.topic === input.topic;
  }
}

module.exports = MentorDialogueEngine;
