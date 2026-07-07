
/**
 * ==========================================
 * 🧠 MENTOR BRAIN ENGINE
 * UniMentorAI Decision Intelligence Core
 * ==========================================
 * Responsible for:
 * - context interpretation
 * - pedagogical decisions
 * - emotional adaptation signals
 * - response strategy selection
 */

class MentorBrain {

  /**
   * ==========================================
   * CONTEXT ANALYSIS
   * ==========================================
   */
  analyze(input, memory) {

    const lastInteraction =
      memory?.history?.slice(-1)[0];

    return {
      topic: input.topic || "general",

      engagement: this.computeEngagement(input),

      confusion: this.detectConfusion(input, memory),

      progress: memory?.progress || 0,

      repetitionRisk:
        this.detectRepetition(memory),

      emotionalState:
        this.detectEmotionalTone(input),

      lastInteraction
    };
  }

  /**
   * ==========================================
   * MAIN DECISION ENGINE
   * ==========================================
   */
  decideResponse({ context, memory, personality, learningState }) {

    // 🔴 HIGH CONFUSION → SIMPLIFY
    if (context.confusion > 0.7) {
      return {
        type: "SIMPLIFY_EXPLANATION",
        message: "Je vais simplifier cela étape par étape pour toi.",
        priority: "HIGH",
        suggestions: ["exemple concret", "visualisation"]
      };
    }

    // 🟡 LOW ENGAGEMENT → BOOST
    if (context.engagement < 0.4) {
      return {
        type: "ENGAGEMENT_BOOST",
        message: "Essayons un exemple pratique pour rendre ça plus clair.",
        priority: "MEDIUM",
        suggestions: ["exercice", "cas réel"]
      };
    }

    // 🔁 REPETITION DETECTED
    if (context.repetitionRisk > 0.6) {
      return {
        type: "PIVOT_METHOD",
        message: "Changeons d'approche pour mieux comprendre.",
        priority: "MEDIUM"
      };
    }

    // 📈 HIGH PROGRESS → CHALLENGE USER
    if (learningState.level > 3 && context.engagement > 0.7) {
      return {
        type: "ADVANCED_CHALLENGE",
        message: "Très bien, passons à un niveau plus avancé.",
        priority: "HIGH"
      };
    }

    // 🟢 DEFAULT FLOW
    return {
      type: "CONTINUE",
      message: personality.tone === "friendly"
        ? "Très bien, continuons."
        : "On continue.",
      priority: "LOW"
    };
  }

  /**
   * ==========================================
   * ENGAGEMENT DETECTION
   * ==========================================
   */
  computeEngagement(input) {

    let score = 0.5;

    if (input.chat?.length > 3) score += 0.2;
    if (input.audio?.responseTime < 2000) score += 0.2;
    if (input.video?.attention > 0.6) score += 0.3;

    return Math.min(score, 1);
  }

  /**
   * ==========================================
   * CONFUSION DETECTION
   * ==========================================
   */
  detectConfusion(input, memory) {

    let score = 0.2;

    if (input.chat?.includes("??")) score += 0.3;
    if (input.audio?.hesitation > 0.5) score += 0.3;

    const repeatTopics =
      memory?.history?.filter(h =>
        h.context?.topic === input.topic
      ).length || 0;

    if (repeatTopics > 2) score += 0.3;

    return Math.min(score, 1);
  }

  /**
   * ==========================================
   * REPETITION DETECTION
   * ==========================================
   */
  detectRepetition(memory) {

    const history = memory?.history || [];

    if (history.length < 2) return 0;

    const lastTopics =
      history.slice(-3).map(h => h.context?.topic);

    const uniqueTopics =
      new Set(lastTopics).size;

    return 1 - (uniqueTopics / lastTopics.length);
  }

  /**
   * ==========================================
   * EMOTIONAL STATE DETECTION (SIMPLIFIED)
   * ==========================================
   */
  detectEmotionalTone(input) {

    if (input.chat?.includes("😞")) return "frustrated";
    if (input.chat?.includes("😃")) return "positive";
    if (input.audio?.stressLevel > 0.7) return "stressed";

    return "neutral";
  }
}

module.exports = MentorBrain;
