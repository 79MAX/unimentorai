class MentorResponseGenerator {

  // =========================
  // 🧠 MAIN GENERATION ENGINE
  // =========================
  async generate({
    message,
    context = {},
    memory = {},
    learning = {},
    personality = {},
    difficulty = {},
    dialogue = {}
  }) {

    // =========================
    // 🧠 BUILD RESPONSE CORE
    // =========================
    const base = this.buildBaseResponse(message, context);

    const enriched = this.enrichWithMemory(base, memory);

    const adapted = this.applyPersonality(enriched, personality);

    const leveled = this.applyDifficulty(adapted, difficulty);

    const dialogued = this.applyDialogueHints(leveled, dialogue);

    return {
      response: dialogued,
      metadata: {
        intent: context?.intent || "unknown",
        topic: learning?.topic || "general",
        level: difficulty?.level || "intermediate",
        emotion: context?.emotion || "neutral",
        mode: personality?.teachingMode || "conversational"
      }
    };
  }

  // =========================
  // 🧩 BASE RESPONSE BUILDER
  // =========================
  buildBaseResponse(message, context) {
    if (context.intent === "question") {
      return `Je vais t'expliquer cela clairement : ${message}`;
    }

    if (context.intent === "exercise") {
      return `Voici un exercice guidé basé sur ta demande : ${message}`;
    }

    return `Analysons ensemble : ${message}`;
  }

  // =========================
  // 🧠 MEMORY ENRICHMENT
  // =========================
  enrichWithMemory(response, memory) {
    const history = memory?.history || [];

    if (history.length > 0) {
      const lastTopic = history[history.length - 1]?.message;

      return `${response}\n\n💡 Rappel : nous avons déjà parlé de "${lastTopic}"`;
    }

    return response;
  }

  // =========================
  // 🎭 PERSONALITY LAYER
  // =========================
  applyPersonality(response, personality) {
    const tone = personality?.tone || "balanced";

    switch (tone) {
      case "gentle":
        return `😊 Prenons notre temps.\n\n${response}`;

      case "strict":
        return `⚠️ Concentre-toi bien.\n\n${response}`;

      case "supportive":
        return `💪 Tu peux y arriver.\n\n${response}`;

      case "direct":
        return response;

      default:
        return response;
    }
  }

  // =========================
  // 📊 DIFFICULTY ADAPTATION
  // =========================
  applyDifficulty(response, difficulty) {
    const mode = difficulty?.adaptationMode || "balanced";

    if (mode === "simplify") {
      return `📘 Version simple :\n\n${response}`;
    }

    if (mode === "challenge") {
      return `🔥 Niveau avancé :\n\n${response}\n\n👉 Peux-tu résoudre une variante plus difficile ?`;
    }

    return response;
  }

  // =========================
  // 🔗 DIALOGUE ENRICHMENT
  // =========================
  applyDialogueHints(response, dialogue) {
    const followUp = dialogue?.followUp;

    if (followUp) {
      return `${response}\n\n👉 ${followUp}`;
    }

    return response;
  }
}

export default MentorResponseGenerator;
