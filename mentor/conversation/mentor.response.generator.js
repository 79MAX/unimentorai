/**
 * ==========================================
 * 🧠 MENTOR RESPONSE GENERATOR
 * UniMentorAI Response Assembly Engine
 * ==========================================
 */

class MentorResponseGenerator {

  generate(
    userId,
    input,
    context,
    state = {}
  ) {

    const {
      learning = {},
      personality = {},
      difficulty = {},
      dialogue = {}
    } = state;

    return {

      metadata: this.buildMetadata(
        context,
        learning,
        difficulty
      ),

      response: {

        tone: personality.tone,

        style:
          dialogue.communicationStyle,

        content:
          this.buildContent(
            input,
            context,
            learning,
            personality,
            difficulty,
            dialogue
          ),

        nextAction:
          this.buildNextAction(
            learning
          ),

        followUp:
          this.buildFollowUpQuestion(
            context,
            learning
          )
      }
    };
  }

  /**
   * ==========================================
   * CONTENT BUILDER
   * ==========================================
   */
  buildContent(
    input,
    context,
    learning,
    personality,
    difficulty,
    dialogue
  ) {

    const sections = [];

    // --------------------------
    // ACKNOWLEDGEMENT
    // --------------------------
    sections.push(
      this.buildAcknowledgement(
        context,
        personality
      )
    );

    // --------------------------
    // EXPLANATION
    // --------------------------
    sections.push(
      this.buildExplanation(
        context,
        learning,
        dialogue
      )
    );

    // --------------------------
    // RECOMMENDATION
    // --------------------------
    sections.push(
      this.buildRecommendation(
        learning,
        difficulty
      )
    );

    return sections
      .filter(Boolean)
      .join("\n\n");
  }

  /**
   * ==========================================
   * ACKNOWLEDGEMENT
   * ==========================================
   */
  buildAcknowledgement(
    context,
    personality
  ) {

    if (context.confusion > 0.7) {
      return "Je vois que cette notion semble poser difficulté. Nous allons la simplifier étape par étape.";
    }

    if (
      personality.tone ===
      "MOTIVATIONAL_MENTOR"
    ) {
      return "Excellent travail. Continuons sur cette progression.";
    }

    if (
      personality.tone ===
      "SUPPORTIVE_GUIDE"
    ) {
      return "Bonne question. Prenons le temps de bien comprendre ensemble.";
    }

    return "Analysons ce sujet ensemble.";
  }

  /**
   * ==========================================
   * EXPLANATION
   * ==========================================
   */
  buildExplanation(
    context,
    learning,
    dialogue
  ) {

    const objective =
      learning.objective ||
      "LEARN";

    switch (objective) {

      case "UNDERSTAND":
        return "Objectif : comprendre clairement le concept étudié.";

      case "APPLY":
        return "Objectif : appliquer les connaissances à travers un exercice pratique.";

      case "VALIDATE":
        return "Objectif : vérifier la maîtrise des acquis.";

      case "MASTER":
        return "Objectif : approfondir et maîtriser le sujet.";

      default:
        return "Objectif : progresser sur ce sujet.";
    }
  }

  /**
   * ==========================================
   * RECOMMENDATION
   * ==========================================
   */
  buildRecommendation(
    learning,
    difficulty
  ) {

    const recommendation =
      learning.recommendation ||
      "CONTINUE_LEARNING";

    const difficultyLevel =
      difficulty.recommendedDifficulty ||
      0.5;

    return [
      `Recommandation : ${recommendation}`,
      `Difficulté cible : ${Math.round(difficultyLevel * 100)}%`
    ].join("\n");
  }

  /**
   * ==========================================
   * NEXT ACTION
   * ==========================================
   */
  buildNextAction(
    learning
  ) {

    return {

      action:
        learning.recommendation,

      stage:
        learning.stage,

      objective:
        learning.objective
    };
  }

  /**
   * ==========================================
   * FOLLOW-UP QUESTION
   * ==========================================
   */
  buildFollowUpQuestion(
    context,
    learning
  ) {

    if (
      context.intent ===
      "EXPLANATION"
    ) {
      return "Souhaitez-vous un exemple concret ?";
    }

    if (
      context.intent ===
      "PRACTICE"
    ) {
      return "Voulez-vous essayer un exercice ?";
    }

    if (
      context.intent ===
      "ASSESSMENT"
    ) {
      return "Êtes-vous prêt pour une question de validation ?";
    }

    return "Souhaitez-vous poursuivre ?";
  }

  /**
   * ==========================================
   * METADATA
   * ==========================================
   */
  buildMetadata(
    context,
    learning,
    difficulty
  ) {

    return {

      timestamp:
        Date.now(),

      topic:
        context.topicHint,

      intent:
        context.intent,

      masteryGain:
        learning.masteryGain || 0,

      learningZone:
        difficulty.learningZone
    };
  }
}

module.exports =
  MentorResponseGenerator;
