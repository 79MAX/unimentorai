
/**
 * ==========================================
 * 🧠 MENTOR RESPONSE GENERATOR ENGINE
 * UniMentorAI Final Pedagogical Output Layer
 * ==========================================
 * Responsible for:
 * - transforming AI decisions into human-readable learning responses
 * - structuring pedagogical output
 * - ensuring clarity, progression, and engagement
 * - formatting adaptive learning content
 * - bridging AI reasoning → learner experience
 */

class MentorResponseGenerator {

  constructor({ dialogueEngine }) {

    this.dialogueEngine = dialogueEngine;
  }

  /**
   * ==========================================
   * MAIN RESPONSE PIPELINE
   * ==========================================
   */
  generate(userId, input, context, learningPackage) {

    // --------------------------------------
    // 1. GET DIALOGUE STRUCTURE
    // --------------------------------------
    const dialogue =
      this.dialogueEngine.generate(userId, input, context);

    // --------------------------------------
    // 2. BUILD PEDAGOGICAL CONTENT
    // --------------------------------------
    const content =
      this.buildContent(dialogue, learningPackage, context);

    // --------------------------------------
    // 3. FORMAT FINAL RESPONSE
    // --------------------------------------
    const response =
      this.formatResponse(dialogue, content, context);

    // --------------------------------------
    // 4. SAFETY + CLARITY PASS
    // --------------------------------------
    return this.finalPolish(response);
  }

  /**
   * ==========================================
   * CONTENT BUILDER ENGINE
   * ==========================================
   */
  buildContent(dialogue, learningPackage, context) {

    const { strategy, learningNode, difficulty } = dialogue;

    const baseConcept = learningPackage?.skill || learningNode;

    let content = {
      concept: baseConcept,
      difficulty,
      strategy
    };

    // --------------------------------------
    // STRATEGY-BASED CONTENT GENERATION
    // --------------------------------------

    switch (strategy) {

      case "GUIDED_EXPLANATION":
        content.sections = [
          "📘 Explication simple du concept",
          "🧩 Décomposition étape par étape",
          "💡 Exemple concret",
          "✅ Vérification de compréhension"
        ];
        break;

      case "ACTIVE_PRACTICE":
        content.sections = [
          "🎯 Question interactive",
          "✏️ Résolution guidée",
          "🧠 Feedback immédiat",
          "🔁 Répétition adaptative"
        ];
        break;

      case "DETAILED_REASONING":
        content.sections = [
          "📊 Analyse complète du concept",
          "🔬 Logique interne expliquée",
          "📌 Cas réels",
          "🧠 Raisonnement avancé"
        ];
        break;

      case "ADVANCED_EXPLORATION":
        content.sections = [
          "🚀 Problème complexe",
          "⚠️ Sans assistance initiale",
          "🔍 Indices progressifs",
          "🏁 Solution approfondie"
        ];
        break;

      case "ACCELERATED_TRAINING":
        content.sections = [
          "⚡ Explication rapide",
          "🎯 Exercice immédiat",
          "🔥 Feedback instantané",
          "📈 Montée en difficulté rapide"
        ];
        break;

      default:
        content.sections = [
          "📘 Concept",
          "🧩 Exemple",
          "✏️ Pratique",
          "📊 Validation"
        ];
    }

    return content;
  }

  /**
   * ==========================================
   * RESPONSE FORMATTER ENGINE
   * ==========================================
   */
  formatResponse(dialogue, content, context) {

    return {
      meta: {
        type: dialogue.type,
        mode: dialogue.mode,
        tone: dialogue.tone,
        difficulty: dialogue.difficulty
      },

      learning: {
        node: dialogue.learningNode,
        concept: content.concept
      },

      pedagogicalFlow: content.sections,

      interaction: {
        expectsUserInput:
          dialogue.type === "INTERACTIVE" ||
          dialogue.type === "CHALLENGE",

        retryAllowed: true,
        hintsAvailable: dialogue.type === "CHALLENGE"
      },

      personalization: {
        adaptiveMode: dialogue.mode,
        emotionalTone: dialogue.tone
      }
    };
  }

  /**
   * ==========================================
   * FINAL POLISH ENGINE
   * ==========================================
   */
  finalPolish(response) {

    // --------------------------------------
    // ENSURE STRUCTURAL CONSISTENCY
    // --------------------------------------

    if (!response.meta) {
      throw new Error("Invalid response structure");
    }

    // --------------------------------------
    // SAFETY CLAMP (PREVENT INVALID STATES)
    // --------------------------------------

    if (!response.meta.difficulty) {
      response.meta.difficulty = "MEDIUM";
    }

    // --------------------------------------
    // ENSURE PEDAGOGICAL FLOW EXISTS
    // --------------------------------------

    if (!response.pedagogicalFlow || response.pedagogicalFlow.length === 0) {
      response.pedagogicalFlow = [
        "📘 Concept",
        "🧩 Example",
        "✏️ Practice"
      ];
    }

    return response;
  }
}

module.exports = MentorResponseGenerator;
