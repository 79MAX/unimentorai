
/**
 * ==========================================
 * 📚 MENTOR LEARNING ENGINE
 * UniMentorAI Adaptive Learning Core
 * ==========================================
 * Responsible for:
 * - dynamic lesson generation
 * - adaptive difficulty selection
 * - learning path orchestration
 * - mastery computation support
 * - skill progression activation
 */

class MentorLearningEngine {

  constructor({ skillGraph, memory, difficultyAdjuster }) {

    this.skillGraph = skillGraph;
    this.memory = memory;
    this.difficultyAdjuster = difficultyAdjuster;
  }

  /**
   * ==========================================
   * MAIN LEARNING DECISION
   * ==========================================
   */
  generate(userId, context, profile) {

    const memory = this.memory.get(userId);

    // --------------------------------------
    // 1. CURRENT SKILL DETECTION
    // --------------------------------------
    const currentSkill =
      this.detectCurrentSkill(memory, context);

    // --------------------------------------
    // 2. DIFFICULTY SELECTION
    // --------------------------------------
    const difficulty =
      this.difficultyAdjuster.compute(profile, memory, context);

    // --------------------------------------
    // 3. NEXT LEARNING STEP
    // --------------------------------------
    const nextStep =
      this.selectNextStep(currentSkill, difficulty, memory);

    // --------------------------------------
    // 4. LEARNING MODE SELECTION
    // --------------------------------------
    const mode =
      this.selectLearningMode(profile, context);

    return {
      skill: currentSkill,
      difficulty,
      nextStep,
      mode
    };
  }

  /**
   * ==========================================
   * SKILL DETECTION ENGINE
   * ==========================================
   */
  detectCurrentSkill(memory, context) {

    if (context?.topic) return context.topic;

    if (memory.learning?.currentTopic) {
      return memory.learning.currentTopic;
    }

    if (memory.learning?.weakAreas?.length > 0) {
      return memory.learning.weakAreas[0];
    }

    return "general_fundamentals";
  }

  /**
   * ==========================================
   * NEXT STEP SELECTOR
   * ==========================================
   */
  selectNextStep(skill, difficulty, memory) {

    const history = memory.history || [];

    const lastPerformance =
      history.length > 0
        ? history[history.length - 1].mastery
        : 0.5;

    // --------------------------------------
    // ADAPTIVE RULES
    // --------------------------------------

    if (lastPerformance < 0.3) {
      return {
        type: "SIMPLIFIED_EXPLANATION",
        depth: "basic",
        repetition: true
      };
    }

    if (lastPerformance > 0.8) {
      return {
        type: "ADVANCED_CHALLENGE",
        depth: "deep",
        complexity: "high"
      };
    }

    if (difficulty > 0.7) {
      return {
        type: "GUIDED_PRACTICE",
        depth: "medium",
        hints: true
      };
    }

    return {
      type: "STANDARD_LESSON",
      depth: "medium"
    };
  }

  /**
   * ==========================================
   * LEARNING MODE SELECTOR
   * ==========================================
   */
  selectLearningMode(profile, context) {

    if (profile.flags?.atRisk) {
      return "SUPPORT_MODE";
    }

    if (context.confusion > 0.7) {
      return "SIMPLIFIED_MODE";
    }

    if (profile.identity?.globalMastery > 0.8) {
      return "CHALLENGE_MODE";
    }

    if (context.engagement > 0.7) {
      return "ACCELERATED_MODE";
    }

    return "BALANCED_MODE";
  }

  /**
   * ==========================================
   * LEARNING PATH BUILDER
   * ==========================================
   */
  buildPath(userId, skill, profile) {

    const graph = this.skillGraph.get(skill);

    if (!graph) {
      return ["intro", "practice", "quiz"];
    }

    const mastery = profile.identity.globalMastery;

    if (mastery < 0.3) {
      return graph.basicPath;
    }

    if (mastery < 0.7) {
      return graph.intermediatePath;
    }

    return graph.advancedPath;
  }

  /**
   * ==========================================
   * FEEDBACK INTEGRATION POINT
   * ==========================================
   */
  updateFromFeedback(userId, result, memory) {

    const skill = memory.learning.currentTopic;

    if (!skill) return;

    if (result.success) {
      this.skillGraph.increaseMastery(userId, skill, 0.05);
    } else {
      this.skillGraph.decreaseMastery(userId, skill, 0.03);
    }
  }
}

module.exports = MentorLearningEngine;
