
/**
 * ==========================================
 * 🎭 MENTOR PERSONALITY ENGINE
 * UniMentorAI Adaptive Personality System
 * ==========================================
 * Controls:
 * - tone adaptation
 * - teaching style
 * - emotional consistency
 * - user-specific personality evolution
 */

class MentorPersonalityEngine {

  constructor() {

    this.defaultProfile = {
      tone: "friendly",
      strictness: 0.5,
      motivationStyle: "balanced",
      explanationDepth: "medium"
    };
  }

  /**
   * ==========================================
   * ADAPT PERSONALITY BASED ON USER
   * ==========================================
   */
  adapt({ memory, context, learningState }) {

    let profile =
      memory.personalityProfile || this.defaultProfile;

    // --------------------------------------
    // LOW MOTIVATION → MORE ENCOURAGING
    // --------------------------------------
    if (memory.emotionalProfile?.motivationLevel < 0.4) {

      profile.tone = "encouraging";
      profile.motivationStyle = "high_energy";
    }

    // --------------------------------------
    // HIGH CONFUSION → SIMPLIFY TONE
    // --------------------------------------
    if (context.confusion > 0.7) {

      profile.explanationDepth = "very_simple";
      profile.tone = "calm";
    }

    // --------------------------------------
    // HIGH PERFORMANCE → MORE STRICT
    // --------------------------------------
    if (learningState.level > 3 && context.engagement > 0.7) {

      profile.strictness = 0.8;
      profile.tone = "challenging";
    }

    // --------------------------------------
    // FRUSTRATION DETECTED → SUPPORT MODE
    // --------------------------------------
    if (memory.emotionalProfile?.frustrationLevel > 0.6) {

      profile.tone = "supportive";
      profile.strictness = 0.2;
      profile.explanationDepth = "step_by_step";
    }

    // Save updated profile
    memory.personalityProfile = profile;

    return {
      profile,
      tone: profile.tone
    };
  }

  /**
   * ==========================================
   * GENERATE RESPONSE STYLE
   * ==========================================
   */
  formatResponse({ response, personality }) {

    const prefix =
      this.getTonePrefix(personality.tone);

    return {
      ...response,
      message: `${prefix} ${response.message}`
    };
  }

  /**
   * ==========================================
   * TONE SYSTEM
   * ==========================================
   */
  getTonePrefix(tone) {

    switch (tone) {

      case "encouraging":
        return "💪 Super !";

      case "calm":
        return "🧠 Ok, prenons ça doucement.";

      case "challenging":
        return "🔥 Niveau supérieur :";

      case "supportive":
        return "🤝 Ne t’inquiète pas,";

      default:
        return "👉";
    }
  }

  /**
   * ==========================================
   * DETERMINE EXPLANATION STYLE
   * ==========================================
   */
  getExplanationStyle(profile) {

    if (profile.explanationDepth === "very_simple") {
      return "Use basic words and step-by-step explanation.";
    }

    if (profile.explanationDepth === "step_by_step") {
      return "Break explanation into small steps.";
    }

    return "Standard explanation.";
  }

  /**
   * ==========================================
   * PERSONALITY EVOLUTION OVER TIME
   * ==========================================
   */
  evolve(memory) {

    const history = memory.history || [];

    // If user improves → increase challenge level
    if (memory.progress > 70) {
      memory.personalityProfile.strictness =
        Math.min(1, (memory.personalityProfile.strictness || 0.5) + 0.1);
    }

    // If user struggles → more supportive
    if (memory.emotionalProfile?.frustrationLevel > 0.5) {
      memory.personalityProfile.tone = "supportive";
    }

    // Long-term engagement → more dynamic tone
    if (history.length > 50) {
      memory.personalityProfile.motivationStyle = "adaptive";
    }

    return memory.personalityProfile;
  }
}

module.exports = MentorPersonalityEngine;
