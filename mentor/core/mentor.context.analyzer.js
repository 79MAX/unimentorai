
/**
 * ==========================================
 * 🧠 MENTOR CONTEXT ANALYZER
 * UniMentorAI Context Understanding Engine
 * ==========================================
 * Role:
 * - interpret user input in learning context
 * - detect intent, difficulty, confusion, engagement
 * - enrich raw input into structured learning context
 * - provide signal layer for all AI modules
 */

class MentorContextAnalyzer {

  /**
   * ==========================================
   * MAIN ANALYSIS ENTRY
   * ==========================================
   */
  analyze(input, memory = {}) {

    const text = (input.text || "").toLowerCase();

    // --------------------------------------
    // 1. INTENT DETECTION
    // --------------------------------------
    const intent = this.detectIntent(text);

    // --------------------------------------
    // 2. EMOTION / STATE DETECTION
    // --------------------------------------
    const emotion = this.detectEmotion(text, memory);

    // --------------------------------------
    // 3. ENGAGEMENT ESTIMATION
    // --------------------------------------
    const engagement = this.estimateEngagement(text, memory);

    // --------------------------------------
    // 4. CONFUSION DETECTION
    // --------------------------------------
    const confusion = this.detectConfusion(text);

    // --------------------------------------
    // 5. LEARNING CONTEXT BUILD
    // --------------------------------------
    return {
      intent,
      emotion,
      engagement,
      confusion,

      // enriched signals
      difficultyHint: this.estimateDifficulty(text, memory),
      topicHint: this.extractTopic(text),

      // system signals
      timestamp: Date.now(),
      raw: input.text
    };
  }

  /**
   * ==========================================
   * INTENT DETECTION ENGINE
   * ==========================================
   */
  detectIntent(text) {

    if (text.includes("comment") || text.includes("explique")) {
      return "EXPLANATION";
    }

    if (text.includes("exercice") || text.includes("pratique")) {
      return "PRACTICE";
    }

    if (text.includes("quiz") || text.includes("test")) {
      return "ASSESSMENT";
    }

    if (text.includes("pourquoi")) {
      return "DEEP_DIVE";
    }

    if (text.includes("aide")) {
      return "HELP";
    }

    return "GENERAL_LEARNING";
  }

  /**
   * ==========================================
   * EMOTION DETECTION (SIMPLE MVP VERSION)
   * ==========================================
   */
  detectEmotion(text, memory) {

    if (text.includes("je ne comprends pas") || text.includes("difficile")) {
      return "FRUSTRATED";
    }

    if (text.includes("facile") || text.includes("ok")) {
      return "CONFIDENT";
    }

    if (memory.profile?.emotion?.frustration > 0.6) {
      return "NEEDS_SUPPORT";
    }

    return "NEUTRAL";
  }

  /**
   * ==========================================
   * ENGAGEMENT ESTIMATOR
   * ==========================================
   */
  estimateEngagement(text, memory) {

    let score = 0.5;

    if (text.length > 50) score += 0.2;
    if (text.includes("!")) score += 0.1;
    if (text.includes("?")) score += 0.1;

    if (memory.history?.length > 3) {
      score += 0.1;
    }

    return this.clamp(score);
  }

  /**
   * ==========================================
   * CONFUSION DETECTOR
   * ==========================================
   */
  detectConfusion(text) {

    const signals = [
      "je ne comprends pas",
      "c'est difficile",
      "je suis perdu",
      "hein",
      "??"
    ];

    let score = 0;

    signals.forEach(s => {
      if (text.includes(s)) score += 0.3;
    });

    return this.clamp(score);
  }

  /**
   * ==========================================
   * DIFFICULTY ESTIMATOR
   * ==========================================
   */
  estimateDifficulty(text, memory) {

    let difficulty = 0.5;

    if (text.length > 100) difficulty += 0.2;
    if (text.includes("explique en détail")) difficulty += 0.2;
    if (memory.profile?.level === "advanced") difficulty += 0.2;

    return this.clamp(difficulty);
  }

  /**
   * ==========================================
   * TOPIC EXTRACTOR (SIMPLE MVP)
   * ==========================================
   */
  extractTopic(text) {

    if (text.includes("math")) return "MATHEMATICS";
    if (text.includes("physique")) return "PHYSICS";
    if (text.includes("anglais")) return "ENGLISH";
    if (text.includes("code") || text.includes("javascript")) return "PROGRAMMING";

    return "GENERAL";
  }

  /**
   * ==========================================
   * UTILITY
   * ==========================================
   */
  clamp(value) {
    return Math.max(0, Math.min(1, value));
  }
}

module.exports = MentorContextAnalyzer;
