/**
 * ==========================================
 * 📚 MENTOR LEARNING ENGINE
 * UniMentorAI Learning Decision System
 * ==========================================
 * Responsibilities:
 * - determine next learning action
 * - estimate mastery progression
 * - identify learning gaps
 * - generate learning recommendations
 * - feed response generator
 * ==========================================
 */

class MentorLearningEngine {

  constructor() {

    this.MASTERY_THRESHOLDS = {
      beginner: 0.30,
      intermediate: 0.70,
      advanced: 1.00
    };
  }

  /**
   * ==========================================
   * MAIN ENTRY
   * ==========================================
   */
  process(userId, context, memory) {

    const profile = memory?.profile || {};

    const mastery = profile.mastery || 0.3;

    const learningStage =
      this.determineStage(mastery);

    const learningObjective =
      this.determineObjective(context);

    const recommendedDifficulty =
      this.determineDifficulty(
        mastery,
        context
      );

    const masteryGain =
      this.computeMasteryGain(context);

    const gaps =
      this.detectLearningGaps(
        context,
        profile
      );

    return {

      stage: learningStage,

      objective: learningObjective,

      difficulty: recommendedDifficulty,

      masteryGain,

      gaps,

      recommendation:
        this.generateRecommendation(
          learningStage,
          learningObjective,
          gaps
        )
    };
  }

  /**
   * ==========================================
   * LEARNING STAGE
   * ==========================================
   */
  determineStage(mastery) {

    if (mastery < this.MASTERY_THRESHOLDS.beginner) {
      return "BEGINNER";
    }

    if (mastery < this.MASTERY_THRESHOLDS.intermediate) {
      return "INTERMEDIATE";
    }

    return "ADVANCED";
  }

  /**
   * ==========================================
   * OBJECTIVE DETECTION
   * ==========================================
   */
  determineObjective(context) {

    switch (context.intent) {

      case "EXPLANATION":
        return "UNDERSTAND";

      case "PRACTICE":
        return "APPLY";

      case "ASSESSMENT":
        return "VALIDATE";

      case "DEEP_DIVE":
        return "MASTER";

      default:
        return "LEARN";
    }
  }

  /**
   * ==========================================
   * DIFFICULTY SELECTION
   * ==========================================
   */
  determineDifficulty(mastery, context) {

    let difficulty = 0.5;

    if (mastery < 0.3) {
      difficulty -= 0.2;
    }

    if (mastery > 0.7) {
      difficulty += 0.2;
    }

    if (context.confusion > 0.6) {
      difficulty -= 0.2;
    }

    if (context.engagement > 0.8) {
      difficulty += 0.1;
    }

    return this.clamp(difficulty);
  }

  /**
   * ==========================================
   * MASTERY PROGRESSION
   * ==========================================
   */
  computeMasteryGain(context) {

    let gain = 0.01;

    if (context.engagement > 0.7) {
      gain += 0.02;
    }

    if (context.confusion > 0.7) {
      gain -= 0.02;
    }

    return gain;
  }

  /**
   * ==========================================
   * GAP DETECTION
   * ==========================================
   */
  detectLearningGaps(context, profile) {

    const gaps = [];

    if (context.confusion > 0.7) {
      gaps.push("CONCEPTUAL_CONFUSION");
    }

    if ((profile.engagement || 0) < 0.4) {
      gaps.push("LOW_ENGAGEMENT");
    }

    if ((profile.mastery || 0) < 0.3) {
      gaps.push("FOUNDATION_WEAKNESS");
    }

    return gaps;
  }

  /**
   * ==========================================
   * RECOMMENDATION ENGINE
   * ==========================================
   */
  generateRecommendation(
    stage,
    objective,
    gaps
  ) {

    if (gaps.includes("FOUNDATION_WEAKNESS")) {
      return "REVIEW_FUNDAMENTALS";
    }

    if (gaps.includes("CONCEPTUAL_CONFUSION")) {
      return "SIMPLIFY_EXPLANATION";
    }

    if (objective === "APPLY") {
      return "PRACTICE_EXERCISES";
    }

    if (objective === "MASTER") {
      return "ADVANCED_CHALLENGE";
    }

    if (stage === "ADVANCED") {
      return "DEEP_APPLICATION";
    }

    return "CONTINUE_LEARNING";
  }

  /**
   * ==========================================
   * LEARNING PLAN EXPORT
   * ==========================================
   */
  buildLearningPlan(learningData) {

    return {
      nextAction:
        learningData.recommendation,

      targetDifficulty:
        learningData.difficulty,

      objective:
        learningData.objective,

      stage:
        learningData.stage
    };
  }

  /**
   * ==========================================
   * UTILITIES
   * ==========================================
   */
  clamp(value) {

    return Math.max(
      0,
      Math.min(1, value)
    );
  }
}

module.exports = MentorLearningEngine;
