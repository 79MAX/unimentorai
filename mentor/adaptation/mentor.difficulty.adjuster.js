/**
 * ==========================================
 * ⚖️ MENTOR DIFFICULTY ADJUSTER
 * UniMentorAI Adaptive Difficulty Engine
 * ==========================================
 * Responsibilities:
 * - adapt learning difficulty
 * - avoid boredom and frustration
 * - maintain learning flow
 * - generate next difficulty recommendation
 * ==========================================
 */

class MentorDifficultyAdjuster {

  constructor() {

    this.config = {

      MIN_DIFFICULTY: 0.1,
      MAX_DIFFICULTY: 1.0,

      LOW_MASTERY: 0.3,
      HIGH_MASTERY: 0.7,

      LOW_ENGAGEMENT: 0.4,
      HIGH_ENGAGEMENT: 0.8,

      HIGH_CONFUSION: 0.7
    };
  }

  /**
   * ==========================================
   * MAIN ENTRY
   * ==========================================
   */
  compute(profile = {}, memory = {}, context = {}) {

    const mastery =
      profile.mastery || 0.3;

    const engagement =
      profile.engagement || 0.5;

    const confusion =
      context.confusion || 0;

    const currentDifficulty =
      profile.currentDifficulty || 0.5;

    let targetDifficulty =
      currentDifficulty;

    // --------------------------
    // MASTERY ADJUSTMENT
    // --------------------------
    targetDifficulty =
      this.applyMasteryRules(
        targetDifficulty,
        mastery
      );

    // --------------------------
    // CONFUSION ADJUSTMENT
    // --------------------------
    targetDifficulty =
      this.applyConfusionRules(
        targetDifficulty,
        confusion
      );

    // --------------------------
    // ENGAGEMENT ADJUSTMENT
    // --------------------------
    targetDifficulty =
      this.applyEngagementRules(
        targetDifficulty,
        engagement
      );

    // --------------------------
    // NORMALIZATION
    // --------------------------
    targetDifficulty =
      this.clamp(targetDifficulty);

    return {

      currentDifficulty,

      recommendedDifficulty:
        targetDifficulty,

      learningZone:
        this.determineLearningZone(
          mastery,
          confusion,
          engagement
        ),

      adaptationReason:
        this.buildReason(
          mastery,
          confusion,
          engagement
        )
    };
  }

  /**
   * ==========================================
   * MASTERY RULES
   * ==========================================
   */
  applyMasteryRules(
    difficulty,
    mastery
  ) {

    if (
      mastery <
      this.config.LOW_MASTERY
    ) {
      return difficulty - 0.15;
    }

    if (
      mastery >
      this.config.HIGH_MASTERY
    ) {
      return difficulty + 0.15;
    }

    return difficulty;
  }

  /**
   * ==========================================
   * CONFUSION RULES
   * ==========================================
   */
  applyConfusionRules(
    difficulty,
    confusion
  ) {

    if (
      confusion >
      this.config.HIGH_CONFUSION
    ) {
      return difficulty - 0.20;
    }

    return difficulty;
  }

  /**
   * ==========================================
   * ENGAGEMENT RULES
   * ==========================================
   */
  applyEngagementRules(
    difficulty,
    engagement
  ) {

    if (
      engagement <
      this.config.LOW_ENGAGEMENT
    ) {
      return difficulty - 0.10;
    }

    if (
      engagement >
      this.config.HIGH_ENGAGEMENT
    ) {
      return difficulty + 0.10;
    }

    return difficulty;
  }

  /**
   * ==========================================
   * LEARNING ZONE DETECTOR
   * ==========================================
   */
  determineLearningZone(
    mastery,
    confusion,
    engagement
  ) {

    if (
      confusion > 0.7
    ) {
      return "FRUSTRATION_ZONE";
    }

    if (
      mastery > 0.8 &&
      engagement < 0.4
    ) {
      return "BOREDOM_ZONE";
    }

    if (
      engagement > 0.6 &&
      confusion < 0.5
    ) {
      return "OPTIMAL_ZONE";
    }

    return "STABLE_ZONE";
  }

  /**
   * ==========================================
   * ADAPTATION EXPLANATION
   * ==========================================
   */
  buildReason(
    mastery,
    confusion,
    engagement
  ) {

    const reasons = [];

    if (mastery < 0.3) {
      reasons.push(
        "LOW_MASTERY"
      );
    }

    if (mastery > 0.7) {
      reasons.push(
        "HIGH_MASTERY"
      );
    }

    if (confusion > 0.7) {
      reasons.push(
        "HIGH_CONFUSION"
      );
    }

    if (engagement < 0.4) {
      reasons.push(
        "LOW_ENGAGEMENT"
      );
    }

    if (engagement > 0.8) {
      reasons.push(
        "HIGH_ENGAGEMENT"
      );
    }

    return reasons;
  }

  /**
   * ==========================================
   * CLAMP
   * ==========================================
   */
  clamp(value) {

    return Math.max(
      this.config.MIN_DIFFICULTY,
      Math.min(
        this.config.MAX_DIFFICULTY,
        value
      )
    );
  }
}

module.exports =
  MentorDifficultyAdjuster;
