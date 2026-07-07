
/**
 * ==========================================
 * 🧠 MENTOR BRAIN ENGINE
 * UniMentorAI Cognitive Orchestrator
 * ==========================================
 * Responsible for:
 * - global decision making
 * - routing between AI subsystems
 * - pedagogical strategy selection
 * - context interpretation
 * - learning state orchestration
 */

class MentorBrain {

  constructor({
    memory,
    skillGraph,
    learningEngine,
    strategyEvolver,
    behaviorOptimizer
  }) {

    this.memory = memory;
    this.skillGraph = skillGraph;
    this.learningEngine = learningEngine;
    this.strategyEvolver = strategyEvolver;
    this.behaviorOptimizer = behaviorOptimizer;

    this.mode = "balanced";
  }

  /**
   * ==========================================
   * MAIN DECISION ENGINE
   * ==========================================
   */
  decide(userId, input, context, learningState) {

    const memory = this.memory.get(userId);

    // --------------------------------------
    // 1. CONTEXT UNDERSTANDING
    // --------------------------------------
    const intent = this.analyzeIntent(input, context);

    // --------------------------------------
    // 2. LEARNING STATE ANALYSIS
    // --------------------------------------
    const state = this.analyzeLearningState(learningState);

    // --------------------------------------
    // 3. STRATEGY SELECTION
    // --------------------------------------
    const strategy =
      this.strategyEvolver.selectStrategy(context, memory);

    // --------------------------------------
    // 4. ROUTING DECISION
    // --------------------------------------
    const route =
      this.routeDecision(intent, state, strategy);

    // --------------------------------------
    // 5. UPDATE INTERNAL MODE
    // --------------------------------------
    this.updateMode(context, state);

    return {
      intent,
      state,
      strategy,
      route,
      mode: this.mode
    };
  }

  /**
   * ==========================================
   * INTENT ANALYSIS ENGINE
   * ==========================================
   */
  analyzeIntent(input, context) {

    const text = (input.text || "").toLowerCase();

    if (text.includes("expliquer")) return "EXPLAIN";
    if (text.includes("exercice")) return "PRACTICE";
    if (text.includes("quiz")) return "QUIZ";
    if (text.includes("aide")) return "SUPPORT";
    if (context.confusion > 0.7) return "SIMPLIFY";

    return "LEARN";
  }

  /**
   * ==========================================
   * LEARNING STATE ANALYSIS
   * ==========================================
   */
  analyzeLearningState(state) {

    return {
      mastery: state.mastery || 0,
      confusion: state.confusion || 0,
      engagement: state.engagement || 0,
      level: this.calculateLevel(state.mastery)
    };
  }

  /**
   * ==========================================
   * LEVEL CALCULATION
   * ==========================================
   */
  calculateLevel(mastery) {

    if (mastery < 0.3) return "BEGINNER";
    if (mastery < 0.7) return "INTERMEDIATE";
    return "ADVANCED";
  }

  /**
   * ==========================================
   * ROUTING DECISION ENGINE
   * ==========================================
   */
  routeDecision(intent, state, strategy) {

    // HIGH CONFUSION → SIMPLIFICATION PATH
    if (state.confusion > 0.7) {
      return "SIMPLIFICATION_ENGINE";
    }

    // HIGH MASTERY → ADVANCED PATH
    if (state.mastery > 0.8) {
      return "ADVANCED_CHALLENGE_ENGINE";
    }

    // PRACTICE MODE
    if (intent === "PRACTICE") {
      return "EXERCISE_ENGINE";
    }

    // QUIZ MODE
    if (intent === "QUIZ") {
      return "ASSESSMENT_ENGINE";
    }

    // DEFAULT LEARNING PATH
    return "LEARNING_ENGINE";
  }

  /**
   * ==========================================
   * MODE UPDATER
   * ==========================================
   */
  updateMode(context, state) {

    if (state.confusion > 0.7) {
      this.mode = "supportive";
    }

    if (state.engagement > 0.8) {
      this.mode = "accelerated";
    }

    if (state.mastery > 0.8) {
      this.mode = "challenging";
    }

    if (state.confusion < 0.3 && state.engagement < 0.4) {
      this.mode = "interactive";
    }
  }

  /**
   * ==========================================
   * FULL ORCHESTRATION OUTPUT
   * ==========================================
   */
  process(userId, input, context, learningState) {

    const decision =
      this.decide(userId, input, context, learningState);

    return {
      decision,
      nextEngine: decision.route,
      systemMode: this.mode
    };
  }
}

module.exports = MentorBrain;
