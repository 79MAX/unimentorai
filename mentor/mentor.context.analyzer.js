
/**
 * ==========================================
 * 🔍 MENTOR CONTEXT ANALYZER ENGINE
 * UniMentorAI Context Intelligence System
 * ==========================================
 * Responsible for:
 * - interpreting user input context
 * - detecting cognitive/emotional state
 * - extracting learning signals
 * - enriching brain decision inputs
 * - building real-time situational awareness
 */

class MentorContextAnalyzer {

  constructor() {}

  /**
   * ==========================================
   * MAIN CONTEXT ANALYSIS PIPELINE
   * ==========================================
   */
  analyze(input, memory, sessionState) {

    // --------------------------------------
    // 1. TEXT CONTEXT EXTRACTION
    // --------------------------------------
    const linguistic = this.extractLinguisticContext(input);

    // --------------------------------------
    // 2. BEHAVIOR SIGNALS
    // --------------------------------------
    const behavior = this.extractBehaviorSignals(sessionState);

    // --------------------------------------
    // 3. EMOTIONAL STATE DETECTION
    // --------------------------------------
    const emotion = this.detectEmotion(input, memory);

    // --------------------------------------
    // 4. LEARNING CONTEXT
    // --------------------------------------
    const learning = this.extractLearningContext(memory);

    // --------------------------------------
    // 5. GLOBAL CONTEXT FUSION
    // --------------------------------------
    const context = this.fuse(
      linguistic,
      behavior,
      emotion,
      learning
    );

    return context;
  }

  /**
   * ==========================================
   * LINGUISTIC CONTEXT ANALYSIS
   * ==========================================
   */
  extractLinguisticContext(input) {

    const text = (input.text || "").toLowerCase();

    return {
      isQuestion: text.includes("?"),
      isRequest: this.containsKeywords(text, ["explique", "montre", "aide", "comment"]),
      isExercise: this.containsKeywords(text, ["exercice", "pratique", "quiz"]),
      isShortMessage: text.length < 40,
      complexity: this.estimateComplexity(text)
    };
  }

  /**
   * ==========================================
   * BEHAVIOR SIGNALS
   * ==========================================
   */
  extractBehaviorSignals(sessionState) {

    return {
      engagement: sessionState.engagement || 0.5,
      confusion: sessionState.confusion || 0,
      responseDelay: sessionState.responseTime || 1000,
      repetition: sessionState.repetition || 0
    };
  }

  /**
   * ==========================================
   * EMOTION DETECTION ENGINE
   * ==========================================
   */
  detectEmotion(input, memory) {

    const text = (input.text || "").toLowerCase();

    let emotion = "neutral";

    if (this.containsKeywords(text, ["difficile", "je ne comprends pas", "bloqué"])) {
      emotion = "frustrated";
    }

    if (this.containsKeywords(text, ["merci", "super", "cool", "ok"])) {
      emotion = "positive";
    }

    if (memory?.emotionalProfile?.frustrationLevel > 0.7) {
      emotion = "frustrated";
    }

    return {
      emotion,
      frustrationLevel: memory?.emotionalProfile?.frustrationLevel || 0
    };
  }

  /**
   * ==========================================
   * LEARNING CONTEXT EXTRACTION
   * ==========================================
   */
  extractLearningContext(memory) {

    return {
      mastery: memory?.progress || 0,
      weakTopics: memory?.weakTopics || [],
      strongTopics: memory?.strongTopics || [],
      sessionCount: memory?.history?.length || 0
    };
  }

  /**
   * ==========================================
   * CONTEXT FUSION ENGINE
   * ==========================================
   */
  fuse(linguistic, behavior, emotion, learning) {

    return {
      // cognitive signals
      complexity: linguistic.complexity,
      isQuestion: linguistic.isQuestion,
      isExercise: linguistic.isExercise,

      // behavior signals
      engagement: behavior.engagement,
      confusion: behavior.confusion,
      repetition: behavior.repetition,

      // emotional state
      emotion: emotion.emotion,
      frustration: emotion.frustrationLevel,

      // learning state
      mastery: learning.mastery,
      sessionCount: learning.sessionCount,

      // derived intelligence
      urgency: this.computeUrgency(behavior, emotion),
      difficultyPressure: this.computeDifficultyPressure(learning, behavior)
    };
  }

  /**
   * ==========================================
   * COMPLEXITY ESTIMATION
   * ==========================================
   */
  estimateComplexity(text) {

    let score = 0;

    if (text.length > 80) score += 0.3;
    if (text.includes("pourquoi")) score += 0.2;
    if (text.includes("comment")) score += 0.2;
    if (text.split(" ").length > 15) score += 0.3;

    return Math.min(score, 1);
  }

  /**
   * ==========================================
   * URGENCY CALCULATION
   * ==========================================
   */
  computeUrgency(behavior, emotion) {

    let urgency = 0;

    if (behavior.confusion > 0.7) urgency += 0.5;
    if (emotion.emotion === "frustrated") urgency += 0.3;
    if (behavior.responseDelay > 3000) urgency += 0.2;

    return Math.min(urgency, 1);
  }

  /**
   * ==========================================
   * DIFFICULTY PRESSURE
   * ==========================================
   */
  computeDifficultyPressure(learning, behavior) {

    let pressure = 0;

    if (learning.mastery < 0.3) pressure += 0.5;
    if (behavior.confusion > 0.6) pressure += 0.3;
    if (learning.sessionCount < 3) pressure += 0.2;

    return Math.min(pressure, 1);
  }

  /**
   * ==========================================
   * KEYWORD CHECKER
   * ==========================================
   */
  containsKeywords(text, keywords) {

    return keywords.some(k => text.includes(k));
  }
}

module.exports = MentorContextAnalyzer;
