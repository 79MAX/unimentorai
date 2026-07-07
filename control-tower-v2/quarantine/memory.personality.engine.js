import Memory from "./memory.model.js";

/* =========================
   🧠 UNIMENTOR AI PERSONALITY ENGINE
   WORLD CLASS USER BEHAVIOR ANALYSIS SYSTEM
========================= */

export class PersonalityEngine {

  /* =========================
     🚀 MAIN PERSONALITY BUILDER
  ========================= */
  static async build(userId) {

    if (!userId) return this.emptyProfile();

    const memories =
      await Memory.find({ userId }).lean();

    if (!memories.length) {
      return this.emptyProfile();
    }

    const text =
      this.normalize(memories);

    /* =========================
       🧠 INTELLIGENT TRAIT DETECTION
    ========================= */
    return {
      learner: this.score(text, [
        "learn", "study", "understand", "course", "lesson"
      ]),

      builder: this.score(text, [
        "create", "build", "project", "app", "design"
      ]),

      business: this.score(text, [
        "business", "money", "startup", "sell", "marketing"
      ]),

      developer: this.score(text, [
        "code", "programming", "javascript", "api", "backend", "frontend"
      ]),

      curious: this.score(text, [
        "why", "how", "explain", "what", "meaning"
      ]),

      disciplined: this.score(text, [
        "goal", "routine", "daily", "focus", "discipline"
      ]),

      creative: this.score(text, [
        "design", "idea", "imagine", "innovation", "creative"
      ])
    };
  }

  /* =========================
     ⚡ NORMALIZATION LAYER
  ========================= */
  static normalize(memories) {

    return memories
      .map(m => m.content.toLowerCase())
      .join(" ");
  }

  /* =========================
     🧠 SMART SCORING SYSTEM
     (LIGHTWEIGHT NLP STYLE)
  ========================= */
  static score(text, keywords) {

    let score = 0;

    for (const word of keywords) {

      if (text.includes(word)) {
        score += 1;
      }
    }

    return score >= 2; // threshold = personality activation
  }

  /* =========================
     🧠 EMPTY SAFE PROFILE
  ========================= */
  static emptyProfile() {

    return {
      learner: false,
      builder: false,
      business: false,
      developer: false,
      curious: false,
      disciplined: false,
      creative: false
    };
  }

}
