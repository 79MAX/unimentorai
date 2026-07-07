class MentorDialogueEngine {

  // =========================
  // 🧠 MAIN PROCESSOR
  // =========================
  async process(message, memory = {}, context = {}) {
    const history = memory?.history || [];

    return {
      mode: this.detectDialogueMode(message, context),
      flow: this.buildFlow(message, history),
      continuity: this.checkContinuity(history, message),
      followUp: this.generateFollowUp(context),
      engagement: this.engagementLevel(context)
    };
  }

  // =========================
  // 🎭 DIALOGUE MODE DETECTION
  // =========================
  detectDialogueMode(message, context) {
    const text = message.toLowerCase();

    if (text.includes("explique")) return "teaching";
    if (text.includes("corrige")) return "correction";
    if (text.includes("exercice")) return "practice";
    if (text.includes("?")) return "qa";

    return context.intent || "conversation";
  }

  // =========================
  // 🔄 CONVERSATION FLOW BUILDER
  // =========================
  buildFlow(message, history) {
    const last = history.length > 0 ? history[history.length - 1] : null;

    return {
      hasContext: !!last,
      previousTopic: last?.message || null,
      step: history.length < 3 ? "start" : "continue",
      continuityScore: history.length
    };
  }

  // =========================
  // 🔗 CONTINUITY CHECK
  // =========================
  checkContinuity(history, message) {
    if (!history.length) return "new_conversation";

    const lastMessage = history[history.length - 1]?.message || "";

    const similarity =
      this.simpleSimilarity(lastMessage, message);

    if (similarity > 0.7) return "high_continuity";
    if (similarity > 0.3) return "medium_continuity";

    return "low_continuity";
  }

  // =========================
  // 📊 SIMPLE SIMILARITY (NO AI LIB REQUIRED)
  // =========================
  simpleSimilarity(a, b) {
    const wordsA = new Set(a.toLowerCase().split(" "));
    const wordsB = new Set(b.toLowerCase().split(" "));

    const intersection = [...wordsA].filter(x => wordsB.has(x));

    return intersection.length /
      Math.max(wordsA.size, 1);
  }

  // =========================
  // 🔥 FOLLOW-UP GENERATION
  // =========================
  generateFollowUp(context) {
    if (context?.intent === "question") {
      return "Souhaites-tu un exemple pratique ?";
    }

    if (context?.intent === "exercise") {
      return "Veux-tu un niveau plus difficile ?";
    }

    return "Veux-tu continuer ou approfondir ce sujet ?";
  }

  // =========================
  // 💬 ENGAGEMENT LEVEL
  // =========================
  engagementLevel(context) {
    if (context?.emotion === "confused") return "high_support";
    if (context?.emotion === "positive") return "motivational";

    return "neutral";
  }
}

export default MentorDialogueEngine;
