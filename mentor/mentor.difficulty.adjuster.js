
/**
 * ==========================================
 * ⚖️ MENTOR DIFFICULTY ADJUSTER ENGINE
 * UniMentorAI Adaptive Cognitive Load System
 * ==========================================
 * Responsible for:
 * - dynamic difficulty calibration
 * - cognitive load balancing
 * - frustration prevention
 * - challenge optimization
 * - personalized difficulty scaling
 */

class MentorDifficultyAdjuster {

  constructor() {}

  /**
   * ==========================================
   * MAIN DIFFICULTY ENGINE
   * ==========================================
   */
  compute(profile, memory, context) {

    // --------------------------------------
    // 1. BASE DIFFICULTY FROM MASTERY
    // --------------------------------------
    let difficulty =
      this.baseDifficulty(profile.identity.globalMastery);

    // --------------------------------------
    // 2. COGNITIVE LOAD ADJUSTMENT
    // --------------------------------------
    difficulty =
      this.adjustForCognition(difficulty, profile.cognition);

    // --------------------------------------
    // 3. EMOTIONAL ADJUSTMENT
    // --------------------------------------
    difficulty =
      this.adjustForEmotion(difficulty, profile.emotion);

    // --------------------------------------
    // 4. BEHAVIOR ADJUSTMENT
    // --------------------------------------
    difficulty =
      this.adjustForBehavior(difficulty, profile.behavior);

    // --------------------------------------
    // 5. CONTEXT BOOST
    // --------------------------------------
    difficulty =
      this.adjustForContext(difficulty, context);

    return this.clamp(difficulty);
  }

  /**
   * ==========================================
   * BASE DIFFICULTY ENGINE
   * ==========================================
   */
  baseDifficulty(mastery) {

    if (mastery < 0.3) return 0.2; // easy
    if (mastery < 0.7) return 0.5; // medium
    return 0.8; // hard
  }

  /**
   * ==========================================
   * COGNITIVE ADJUSTMENT
   * ==========================================
   */
  adjustForCognition(difficulty, cognition) {

    let adjusted = difficulty;

    // low comprehension → reduce difficulty
    if (cognition.comprehension < 0.4) {
      adjusted -= 0.2;
    }

    // high cognitive load → reduce difficulty
    if (cognition.cognitiveLoad > 0.7) {
      adjusted -= 0.3;
    }

    // high focus → allow higher difficulty
    if (cognition.focus > 0.7) {
      adjusted += 0.1;
    }

    return adjusted;
  }

  /**
   * ==========================================
   * EMOTIONAL ADJUSTMENT ENGINE
   * ==========================================
   */
  adjustForEmotion(difficulty, emotion) {

    let adjusted = difficulty;

    // frustration → reduce difficulty
    if (emotion.frustration > 0.7) {
      adjusted -= 0.3;
    }

    // low confidence → reduce difficulty
    if (emotion.confidence < 0.4) {
      adjusted -= 0.2;
    }

    // high motivation → increase challenge
    if (emotion.motivation > 0.7) {
      adjusted += 0.15;
    }

    return adjusted;
  }

  /**
   * ==========================================
   * BEHAVIOR ADJUSTMENT ENGINE
   * ==========================================
   */
  adjustForBehavior(difficulty, behavior) {

    let adjusted = difficulty;

    // low engagement → simplify
    if (behavior.engagement < 0.4) {
      adjusted -= 0.2;
    }

    // high persistence → increase challenge
    if (behavior.persistence > 0.7) {
      adjusted += 0.1;
    }

    // dropout risk → reduce difficulty drastically
    if (behavior.dropoutRisk > 0.7) {
      adjusted -= 0.4;
    }

    return adjusted;
  }

  /**
   * ==========================================
   * CONTEXT ADJUSTMENT ENGINE
   * ==========================================
   */
  adjustForContext(difficulty, context) {

    let adjusted = difficulty;

    // confusion spike → simplify
    if (context.confusion > 0.7) {
      adjusted -= 0.3;
    }

    // high engagement moment → increase challenge
    if (context.engagement > 0.8) {
      adjusted += 0.2;
    }

    // repetition signal → reduce difficulty slightly
    if (context.repetition > 2) {
      adjusted -= 0.1;
    }

    return adjusted;
  }

  /**
   * ==========================================
   * DIFFICULTY CLAMP
   * ==========================================
   */
  clamp(value) {

    return Math.max(0, Math.min(1, value));
  }

  /**
   * ==========================================
   * DIFFICULTY LABEL TRANSLATOR
   * ==========================================
   */
  label(difficulty) {

    if (difficulty < 0.3) return "EASY";
    if (difficulty < 0.7) return "MEDIUM";
    return "HARD";
  }

  /**
   * ==========================================
   * EXPLANATION ENGINE (WHY DIFFICULTY CHANGED)
   * ==========================================
   */
  explain(profile, context) {

    const reasons = [];

    if (profile.emotion.frustration > 0.7) {
      reasons.push("Reduced due to frustration level");
    }

    if (profile.cognition.comprehension < 0.4) {
      reasons.push("Reduced due to low comprehension");
    }

    if (profile.identity.globalMastery > 0.7) {
      reasons.push("Increased due to high mastery");
    }

    if (context.engagement > 0.8) {
      reasons.push("Increased due to high engagement");
    }

    return reasons;
  }
}

module.exports = MentorDifficultyAdjuster;
