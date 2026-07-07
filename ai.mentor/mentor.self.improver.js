
/**
 * ==========================================
 * 🧠 MENTOR SELF IMPROVER ENGINE
 * UniMentorAI Meta Learning System
 * ==========================================
 * Responsible for:
 * - global system performance analysis
 * - detection of weak AI behaviors
 * - automatic strategy tuning
 * - reinforcement of effective patterns
 * - continuous system evolution
 */

class MentorSelfImprover {

  constructor({
    brain,
    memory,
    learningEngine,
    personalityEngine,
    feedbackLoop,
    skillGraph
  }) {

    this.brain = brain;
    this.memory = memory;
    this.learningEngine = learningEngine;
    this.personalityEngine = personalityEngine;
    this.feedbackLoop = feedbackLoop;
    this.skillGraph = skillGraph;

    this.performanceHistory = [];
  }

  /**
   * ==========================================
   * MAIN EVALUATION CYCLE
   * ==========================================
   */
  evaluate({ userId, context, learningState }) {

    // --------------------------------------
    // 1. COLLECT SYSTEM METRICS
    // --------------------------------------
    const metrics =
      this.collectMetrics(userId, context, learningState);

    // --------------------------------------
    // 2. ANALYZE SYSTEM WEAKNESSES
    // --------------------------------------
    const weaknesses =
      this.detectWeaknesses(metrics);

    // --------------------------------------
    // 3. APPLY IMPROVEMENTS
    // --------------------------------------
    this.applyImprovements(weaknesses);

    // --------------------------------------
    // 4. STORE PERFORMANCE HISTORY
    // --------------------------------------
    this.performanceHistory.push(metrics);

    // limit memory
    if (this.performanceHistory.length > 1000) {
      this.performanceHistory.shift();
    }

    return {
      status: "SELF_IMPROVEMENT_RUN_COMPLETE",
      weaknesses
    };
  }

  /**
   * ==========================================
   * METRICS COLLECTION
   * ==========================================
   */
  collectMetrics(userId, context, learningState) {

    const memory = this.memory.get(userId);

    return {
      engagement: context.engagement,
      confusionRate: context.confusion,
      mastery: learningState.mastery,
      progressionSpeed: memory.progress,
      frustration: memory.emotionalProfile?.frustrationLevel || 0,
      repetition: this.computeRepetition(memory, context)
    };
  }

  /**
   * ==========================================
   * WEAKNESS DETECTION ENGINE
   * ==========================================
   */
  detectWeaknesses(metrics) {

    const weaknesses = [];

    // ❌ High confusion = poor explanation logic
    if (metrics.confusionRate > 0.7) {
      weaknesses.push({
        type: "EXPLANATION_FAILURE",
        severity: "HIGH"
      });
    }

    // ❌ Low engagement = boring teaching style
    if (metrics.engagement < 0.4) {
      weaknesses.push({
        type: "ENGAGEMENT_FAILURE",
        severity: "MEDIUM"
      });
    }

    // ❌ Slow progress = bad difficulty calibration
    if (metrics.progressionSpeed < 20) {
      weaknesses.push({
        type: "LEARNING_SPEED_INEFFICIENCY",
        severity: "HIGH"
      });
    }

    // ❌ High frustration = emotional mismatch
    if (metrics.frustration > 0.7) {
      weaknesses.push({
        type: "EMOTIONAL_MISMATCH",
        severity: "HIGH"
      });
    }

    return weaknesses;
  }

  /**
   * ==========================================
   * IMPROVEMENT APPLICATION ENGINE
   * ==========================================
   */
  applyImprovements(weaknesses) {

    weaknesses.forEach(w => {

      switch (w.type) {

        case "EXPLANATION_FAILURE":
          this.brain.mode = "simplify_logic";
          this.learningEngine.adjustMode("step_by_step");
          break;

        case "ENGAGEMENT_FAILURE":
          this.personalityEngine.defaultProfile.tone = "encouraging";
          break;

        case "LEARNING_SPEED_INEFFICIENCY":
          this.skillGraph.optimizePaths();
          break;

        case "EMOTIONAL_MISMATCH":
          this.personalityEngine.defaultProfile.tone = "supportive";
          break;
      }
    });
  }

  /**
   * ==========================================
   * REPETITION ANALYSIS
   * ==========================================
   */
  computeRepetition(memory, context) {

    const history = memory.history || [];

    const recent = history.slice(-10);

    const count =
      recent.filter(h =>
        h.context?.topic === context.topic
      ).length;

    return count / 10;
  }

  /**
   * ==========================================
   * GLOBAL SYSTEM HEALTH SCORE
   * ==========================================
   */
  systemHealth() {

    if (this.performanceHistory.length === 0) {
      return 1;
    }

    const avg =
      this.performanceHistory.reduce((acc, m) => {
        return acc +
          (1 - m.confusionRate) +
          m.engagement +
          m.mastery;
      }, 0) / this.performanceHistory.length;

    return Math.min(avg / 3, 1);
  }
}

module.exports = MentorSelfImprover;
