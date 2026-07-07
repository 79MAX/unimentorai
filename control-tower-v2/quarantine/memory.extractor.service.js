import Memory from "./memory.model.js";

/* =========================
   🧠 UNIMENTOR AI MEMORY EXTRACTOR
   PRODUCTION-GRADE LONG TERM MEMORY ENGINE
========================= */

export class MemoryExtractor {

  /* =========================
     🚀 MAIN PIPELINE
     EXTRACT + FILTER + SAVE
  ========================= */
  static async extractAndSave({
    userId,
    message,
    aiResponse,
    level = "BEGINNER",
    sessionId = null
  }) {

    try {

      if (!userId || !message) return;

      const facts =
        await this.extractFacts(message, aiResponse);

      if (!facts.length) return;

      const topic = this.detectTopic(message);

      const memories = facts.map(fact => ({
        userId,
        role: "system",
        content: fact,

        metadata: {
          level,
          sessionId,
          source: "auto-extraction",
          topic
        },

        importanceScore: this.calculateImportance(
          fact,
          level
        )
      }));

      // batch insert (fast + scalable)
      await Memory.insertMany(memories);

    } catch (err) {

      console.error(
        "❌ MEMORY_EXTRACTOR_ERROR:",
        err.message
      );

    }
  }

  /* =========================
     🧠 SMART FACT EXTRACTION ENGINE
     (RULE-BASED + SEMANTIC READY)
  ========================= */
  static async extractFacts(userMsg, aiMsg) {

    const facts = [];

    const text = `${userMsg} ${aiMsg || ""}`.toLowerCase();

    /* =========================
       🎯 USER INTENT FACTS
    ========================= */
    if (userMsg.length > 15) {
      facts.push(`User intent: ${userMsg.trim()}`);
    }

    /* =========================
       🧠 AI ADVICE DETECTION
    ========================= */
    if (
      aiMsg &&
      (
        aiMsg.includes("you should") ||
        aiMsg.includes("recommend") ||
        aiMsg.includes("important")
      )
    ) {
      facts.push(`AI guidance: ${aiMsg.trim()}`);
    }

    /* =========================
       📌 PREFERENCE DETECTION
    ========================= */
    if (text.includes("i want") || text.includes("i need")) {
      facts.push(`User goal detected: ${userMsg}`);
    }

    if (text.includes("i like") || text.includes("i prefer")) {
      facts.push(`User preference: ${userMsg}`);
    }

    /* =========================
       📚 LEARNING FACT
    ========================= */
    if (text.includes("learn") || text.includes("study")) {
      facts.push(`Learning context: ${userMsg}`);
    }

    return facts;
  }

  /* =========================
     🧠 TOPIC DETECTION ENGINE
     (SCALABLE KEYWORD MAP)
  ========================= */
  static detectTopic(text = "") {

    const t = text.toLowerCase();

    const TOPICS = {
      programming: ["code", "javascript", "python", "api", "backend", "frontend"],
      business: ["business", "money", "startup", "marketing", "sales"],
      education: ["study", "learn", "school", "course", "exam"],
      ai: ["ai", "machine learning", "gpt", "openai", "model"],
      career: ["job", "career", "cv", "interview", "employment"]
    };

    for (const [topic, keywords] of Object.entries(TOPICS)) {
      if (keywords.some(k => t.includes(k))) {
        return topic;
      }
    }

    return "general";
  }

  /* =========================
     ⭐ IMPORTANCE SCORING ENGINE
     (CRITICAL FOR MEMORY PRIORITY)
  ========================= */
  static calculateImportance(text, level) {

    let score = 1;

    if (text.length > 80) score += 1;
    if (text.includes("goal")) score += 2;
    if (text.includes("prefer")) score += 2;
    if (text.includes("important")) score += 3;

    if (level === "ADVANCED") score += 1;

    return Math.min(score, 10);
  }

}
