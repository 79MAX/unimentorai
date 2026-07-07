
/**
 * ==========================================
 * 📚 MENTOR LEARNING ENGINE
 * UniMentorAI Adaptive Learning System
 * ==========================================
 * Responsible for:
 * - skill progression tracking
 * - adaptive difficulty control
 * - learning path optimization
 * - mastery evaluation
 * - reinforcement learning loop (educational)
 */

class MentorLearningEngine {

  constructor() {

    this.skillModels = new Map();
  }

  /**
   * ==========================================
   * MAIN UPDATE LOOP
   * ==========================================
   */
  update(userId, context) {

    let model = this.getModel(userId);

    // --------------------------------------
    // UPDATE ATTEMPTS
    // --------------------------------------
    model.attempts += 1;

    // --------------------------------------
    // SUCCESS TRACKING
    // --------------------------------------
    if (context.intent === "PRACTICE" && context.confusion < 0.4) {
      model.successes += 1;
    }

    // --------------------------------------
    // UPDATE MASTERY SCORE
    // --------------------------------------
    model.mastery =
      this.calculateMastery(model);

    // --------------------------------------
    // UPDATE LEVEL
    // --------------------------------------
    model.level =
      this.calculateLevel(model);

    // --------------------------------------
    // UPDATE DIFFICULTY TARGET
    // --------------------------------------
    model.targetDifficulty =
      this.adjustDifficulty(model, context);

    // --------------------------------------
    // SAVE MODEL
    // --------------------------------------
    this.skillModels.set(userId, model);

    return model;
  }

  /**
   * ==========================================
   * SKILL MODEL INITIALIZATION
   * ==========================================
   */
  getModel(userId) {

    if (!this.skillModels.has(userId)) {

      this.skillModels.set(userId, {
        userId,
        attempts: 0,
        successes: 0,
        mastery: 0,
        level: 1,
        targetDifficulty: "medium",
        lastUpdated: Date.now()
      });
    }

    return this.skillModels.get(userId);
  }

  /**
   * ==========================================
   * MASTERY CALCULATION
   * ==========================================
   */
  calculateMastery(model) {

    if (model.attempts === 0) return 0;

    const ratio =
      model.successes / model.attempts;

    // Weighted mastery curve
    return Math.min(
      1,
      ratio * 0.7 + (model.level * 0.1)
    );
  }

  /**
   * ==========================================
   * LEVEL SYSTEM
   * ==========================================
   */
  calculateLevel(model) {

    if (model.mastery > 0.8 && model.attempts > 5) {
      return model.level + 1;
    }

    if (model.mastery < 0.3 && model.level > 1) {
      return model.level - 1;
    }

    return model.level;
  }

  /**
   * ==========================================
   * ADAPTIVE DIFFICULTY ENGINE
   * ==========================================
   */
  adjustDifficulty(model, context) {

    // Too easy → increase difficulty
    if (model.mastery > 0.75) {
      return "hard";
    }

    // Too hard → decrease difficulty
    if (model.mastery < 0.4 || context.confusion > 0.6) {
      return "easy";
    }

    // Balanced zone
    return "medium";
  }

  /**
   * ==========================================
   * LEARNING PROGRESSION STRATEGY
   * ==========================================
   */
  getLearningStrategy(model) {

    if (model.mastery < 0.3) {
      return {
        mode: "FOUNDATION",
        action: "simplify + repeat basics"
      };
    }

    if (model.mastery < 0.7) {
      return {
        mode: "DEVELOPMENT",
        action: "guided practice"
      };
    }

    return {
      mode: "ADVANCED",
      action: "challenge + problem solving"
    };
  }

  /**
   * ==========================================
   * RESET / REFRESH MODEL
   * ==========================================
   */
  reset(userId) {

    this.skillModels.set(userId, {
      userId,
      attempts: 0,
      successes: 0,
      mastery: 0,
      level: 1,
      targetDifficulty: "medium",
      lastUpdated: Date.now()
    });
  }
}

module.exports = MentorLearningEngine;
