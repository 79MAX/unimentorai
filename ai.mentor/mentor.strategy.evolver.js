
/**
 * ==========================================
 * 🧠 MENTOR STRATEGY EVOLVER ENGINE
 * UniMentorAI Pedagogical Strategy System
 * ==========================================
 * Responsible for:
 * - selecting teaching strategies
 * - evaluating strategy effectiveness
 * - evolving pedagogical approach
 * - balancing learning modalities
 * - optimizing long-term learning outcomes
 */

class MentorStrategyEvolver {

  constructor() {

    this.strategies = new Map();

    this.initializeDefaultStrategies();
  }

  /**
   * ==========================================
   * DEFAULT STRATEGY SET
   * ==========================================
   */
  initializeDefaultStrategies() {

    this.strategies.set("EXPLANATION_FIRST", {
      successRate: 0.5,
      usage: 0
    });

    this.strategies.set("EXAMPLE_DRIVEN", {
      successRate: 0.6,
      usage: 0
    });

    this.strategies.set("QUIZ_BASED", {
      successRate: 0.55,
      usage: 0
    });

    this.strategies.set("STEP_BY_STEP_GUIDE", {
      successRate: 0.65,
      usage: 0
    });

    this.strategies.set("CHALLENGE_MODE", {
      successRate: 0.7,
      usage: 0
    });
  }

  /**
   * ==========================================
   * SELECT BEST STRATEGY
   * ==========================================
   */
  selectStrategy(context, memory) {

    let best = null;
    let bestScore = -1;

    for (let [name, strategy] of this.strategies) {

      const score =
        this.scoreStrategy(name, strategy, context, memory);

      if (score > bestScore) {
        bestScore = score;
        best = name;
      }
    }

    this.strategies.get(best).usage += 1;

    return best;
  }

  /**
   * ==========================================
   * STRATEGY SCORING ENGINE
   * ==========================================
   */
  scoreStrategy(name, strategy, context, memory) {

    let score = strategy.successRate;

    // --------------------------------------
    // HIGH CONFUSION → FAVOR STEP BY STEP
    // --------------------------------------
    if (context.confusion > 0.7 &&
        name === "STEP_BY_STEP_GUIDE") {
      score += 0.3;
    }

    // --------------------------------------
    // HIGH ENGAGEMENT → FAVOR CHALLENGE
    // --------------------------------------
    if (context.engagement > 0.7 &&
        name === "CHALLENGE_MODE") {
      score += 0.3;
    }

    // --------------------------------------
    // LOW SKILL → FAVOR EXPLANATION
    // --------------------------------------
    if ((memory.progress || 0) < 30 &&
        name === "EXPLANATION_FIRST") {
      score += 0.25;
    }

    // --------------------------------------
    // HIGH MASTERY → QUIZ BASED
    // --------------------------------------
    if ((memory.progress || 0) > 70 &&
        name === "QUIZ_BASED") {
      score += 0.2;
    }

    return score;
  }

  /**
   * ==========================================
   * UPDATE STRATEGY PERFORMANCE
   * ==========================================
   */
  updateStrategyOutcome(strategyName, success) {

    const strategy =
      this.strategies.get(strategyName);

    if (!strategy) return;

    const alpha = 0.1;

    strategy.successRate =
      strategy.successRate * (1 - alpha) +
      (success ? 1 : 0) * alpha;
  }

  /**
   * ==========================================
   * EVOLVE STRATEGIES OVER TIME
   * ==========================================
   */
  evolve() {

    for (let [name, strategy] of this.strategies) {

      // Penalize unused strategies
      if (strategy.usage < 5) {
        strategy.successRate *= 0.98;
      }

      // Reinforce successful strategies
      if (strategy.successRate > 0.75) {
        strategy.successRate *= 1.01;
      }

      // Clamp values
      strategy.successRate =
        Math.max(0, Math.min(1, strategy.successRate));
    }
  }

  /**
   * ==========================================
   * BEST CURRENT STRATEGY
   * ==========================================
   */
  getBestStrategy() {

    let best = null;
    let bestRate = -1;

    for (let [name, strategy] of this.strategies) {

      if (strategy.successRate > bestRate) {
        bestRate = strategy.successRate;
        best = name;
      }
    }

    return best;
  }

  /**
   * ==========================================
   * STRATEGY INSIGHT (FOR DEBUG / AI TUNING)
   * ==========================================
   */
  insights() {

    return Array.from(this.strategies.entries()).map(
      ([name, data]) => ({
        name,
        successRate: data.successRate,
        usage: data.usage
      })
    );
  }
}

module.exports = MentorStrategyEvolver;
