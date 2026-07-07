import Memory from "../core/memory.model.js";

/* =========================
   🧠 USER PROFILE ENGINE (PRODUCTION GRADE)
   - lightweight AI persona inference
   - scalable memory-based profiling
   - ready for personalization engine
========================= */

export class MemoryProfileService {

  /**
   * 🚀 BUILD USER AI PROFILE
   */
  static async buildProfile(userId) {

    if (!userId) return this.emptyProfile();

    try {

      const memories =
        await Memory.find({ userId }).lean();

      if (!memories.length) return this.emptyProfile();

      const text =
        this.buildText(memories);

      return {
        learner: this.has(text, ["learn", "study", "understand"]),
        builder: this.has(text, ["build", "create", "make"]),
        business: this.has(text, ["business", "money", "sell", "market"]),
        coder: this.has(text, ["code", "program", "developer"]),
        curious: this.has(text, ["why", "how", "what"]),
        goalDriven: this.has(text, ["goal", "plan", "become", "want"]),
        productivityFocused: this.has(text, ["work", "improve", "better"])
      };

    } catch (err) {

      console.error("[PROFILE_BUILD_ERROR]", err.message);

      return this.emptyProfile();
    }
  }

  /**
   * 🧠 BUILD MEMORY TEXT (OPTIMIZED)
   */
  static buildText(memories) {

    return memories
      .slice(0, 100) // safe cap for performance
      .map(m => m.content)
      .join(" ")
      .toLowerCase();
  }

  /**
   * 🧠 KEYWORD DETECTOR (FAST SCORING ENGINE)
   */
  static has(text, keywords = []) {

    return keywords.some(k => text.includes(k));
  }

  /**
   * 🚫 EMPTY PROFILE FALLBACK
   */
  static emptyProfile() {

    return {
      learner: false,
      builder: false,
      business: false,
      coder: false,
      curious: false,
      goalDriven: false,
      productivityFocused: false
    };
  }

}
