
/**
 * ==========================================
 * 🔁 MENTOR FEEDBACK LOOP ENGINE
 * UniMentorAI Continuous Learning Optimization System
 * ==========================================
 * Responsible for:
 * - closing the learning loop (teach → test → evaluate → adapt)
 * - capturing user response signals
 * - updating learning, skill graph, and behavior systems
 * - reinforcing successful pedagogical strategies
 * - detecting failure patterns and correcting them
 */

class MentorFeedbackLoop {

  constructor({
    progressTracker,
    skillGraph,
    behaviorOptimizer,
    learningEngine
  }) {

    this.progressTracker = progressTracker;
    this.skillGraph = skillGraph;
    this.behaviorOptimizer = behaviorOptimizer;
    this.learningEngine = learningEngine;
  }

  /**
   * ==========================================
   * MAIN FEEDBACK PROCESSOR
   * ==========================================
   */
  process(userId, interaction, context) {

    // --------------------------------------
    // 1. EXTRACT FEEDBACK SIGNALS
    // --------------------------------------
    const signals =
      this.extractSignals(interaction, context);

    // --------------------------------------
    // 2. UPDATE SKILL GRAPH
    // --------------------------------------
    this.updateSkillGraph(userId, signals);

    // --------------------------------------
    // 3. UPDATE PROGRESS TRACKER
    // --------------------------------------
    this.updateProgress(userId, signals, context);

    // --------------------------------------
    // 4. UPDATE BEHAVIOR OPTIMIZER
    // --------------------------------------
    this.updateBehavior(userId, signals, context);

    // --------------------------------------
    // 5. ADAPT LEARNING ENGINE
    // --------------------------------------
    this.adaptLearning(userId, signals, context);

    // --------------------------------------
    // 6. RETURN INSIGHTS
    // --------------------------------------
    return this.generateInsights(userId, signals);
  }

  /**
   * ==========================================
   * SIGNAL EXTRACTION ENGINE
   * ==========================================
   */
  extractSignals(interaction, context) {

    return {
      success: interaction.success || false,
      score: interaction.score || 0,
      responseTime: interaction.responseTime || 0,
      hintsUsed: interaction.hintsUsed || 0,

      engagement: context.engagement || 0,
      confusion: context.confusion || 0,

      masteryGain: interaction.success ? 0.05 : -0.03
    };
  }

  /**
   * ==========================================
   * SKILL GRAPH UPDATER
   * ==========================================
   */
  updateSkillGraph(userId, signals) {

    const currentSkill = signals.skillId || "general";

    this.skillGraph.update(userId, currentSkill, {
      success: signals.success,
      score: signals.score
    });
  }

  /**
   * ==========================================
   * PROGRESS TRACKER UPDATER
   * ==========================================
   */
  updateProgress(userId, signals, context) {

    this.progressTracker.update(userId, {
      mastery: signals.masteryGain,
      engagement: signals.engagement
    }, context);
  }

  /**
   * ==========================================
   * BEHAVIOR OPTIMIZER UPDATE
   * ==========================================
   */
  updateBehavior(userId, signals, context) {

    this.behaviorOptimizer.optimize(
      userId,
      {
        engagement: signals.engagement,
        masteryGain: signals.masteryGain
      },
      context,
      { dropoutRisk: context.dropoutRisk }
    );
  }

  /**
   * ==========================================
   * LEARNING ENGINE ADAPTATION
   * ==========================================
   */
  adaptLearning(userId, signals, context) {

    // feedback directly influences learning strategy
    if (signals.success) {
      context.reinforce = true;
    } else {
      context.remedial = true;
    }
  }

  /**
   * ==========================================
   * INSIGHTS GENERATOR
   * ==========================================
   */
  generateInsights(userId, signals) {

    return {
      outcome: signals.success ? "SUCCESS" : "FAILURE",
      masteryDelta: signals.masteryGain,
      engagementLevel: signals.engagement,
      adjustmentRequired: signals.confusion > 0.6
    };
  }
}

module.exports = MentorFeedbackLoop;
