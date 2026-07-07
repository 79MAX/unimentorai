class MentorContextAnalyzer {

  // =========================
  // 🧠 MAIN ANALYSIS ENTRY
  // =========================
  async analyze(userId, message) {
    if (!message || typeof message !== "string") {
      return this.emptyContext();
    }

    const text = message.toLowerCase();

    return {
      intent: this.detectIntent(text),
      topic: this.detectTopic(text),
      level: this.detectLevel(text),
      complexity: this.detectComplexity(text),
      emotion: this.detectEmotion(text),
      type: this.detectType(text)
    };
  }

  // =========================
  // 🎯 INTENT DETECTION
  // =========================
  detectIntent(text) {
    if (text.includes("comment") || text.includes("how")) return "question";
    if (text.includes("corrige") || text.includes("fix")) return "correction";
    if (text.includes("exercice") || text.includes("practice")) return "exercise";
    return "conversation";
  }

  // =========================
  // 📚 TOPIC DETECTION (SIMPLE NLP RULES MVP)
  // =========================
  detectTopic(text) {
    if (text.includes("math") || text.includes("equation")) return "mathematics";
    if (text.includes("code") || text.includes("javascript")) return "programming";
    if (text.includes("english") || text.includes("grammar")) return "language";
    if (text.includes("business") || text.includes("entrepreneur")) return "business";
    return "general";
  }

  // =========================
  // 📊 LEVEL DETECTION
  // =========================
  detectLevel(text) {
    if (text.includes("simple") || text.includes("basic")) return "beginner";
    if (text.includes("advanced") || text.includes("complex")) return "advanced";
    return "intermediate";
  }

  // =========================
  // ⚙️ COMPLEXITY SCORE
  // =========================
  detectComplexity(text) {
    const words = text.split(" ").length;

    if (words < 8) return "low";
    if (words < 20) return "medium";
    return "high";
  }

  // =========================
  // 😊 EMOTION (LIGHTWEIGHT)
  // =========================
  detectEmotion(text) {
    if (text.includes("help") || text.includes("stuck")) return "confused";
    if (text.includes("thanks") || text.includes("great")) return "positive";
    return "neutral";
  }

  // =========================
  // 🧠 MESSAGE TYPE
  // =========================
  detectType(text) {
    if (text.includes("?")) return "question";
    if (text.includes("!") ) return "strong";
    return "statement";
  }

  // =========================
  // 🧼 FALLBACK CONTEXT
  // =========================
  emptyContext() {
    return {
      intent: "unknown",
      topic: "general",
      level: "intermediate",
      complexity: "low",
      emotion: "neutral",
      type: "unknown"
    };
  }
}

export default MentorContextAnalyzer;
