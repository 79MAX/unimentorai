/**
 * 🧠 TUTOR STRATEGY SERVICE - UniMentorAI (OPTIMIZED PRO)
 * Cerveau pédagogique adaptatif intelligent
 */

class TutorStrategyService {
  constructor() {
    this.strategyMap = [
      { name: "step_by_step", min: 0.0, max: 0.35 },
      { name: "guided_practice", min: 0.35, max: 0.55 },
      { name: "problem_solving", min: 0.55, max: 0.75 },
      { name: "challenge_mode", min: 0.75, max: 1.0 }
    ];
  }

  /**
   * 🧠 SCORE CERVEAU UTILISATEUR (clé de tout le système)
   */
  computeUserScore(userProfile = {}) {
    const level = userProfile.level || 1;
    const engagement = userProfile.activityScore || 0;
    const mistakeRate = userProfile.mistakeRate || 0;

    // normalisation
    const levelScore = Math.min(level / 5, 1);
    const engagementScore = Math.min(engagement / 100, 1);
    const masteryScore = 1 - Math.min(mistakeRate, 1);

    // pondération intelligente
    const score =
      levelScore * 0.4 +
      engagementScore * 0.3 +
      masteryScore * 0.3;

    return this.clamp(score);
  }

  /**
   * 🎯 STRATÉGIE PRINCIPALE (VERSION INTELLIGENTE)
   */
  getStrategy(userProfile = {}) {
    const score = this.computeUserScore(userProfile);

    const strategy = this.strategyMap.find(
      s => score >= s.min && score <= s.max
    )?.name || "step_by_step";

    return {
      strategy,
      score,
      level: userProfile.level || 1,
      engagement: userProfile.activityScore || 0
    };
  }

  /**
   * 🧠 STYLE D'EXPLICATION ADAPTATIF
   */
  getExplanationStyle(userProfile = {}) {
    const score = this.computeUserScore(userProfile);

    if (score < 0.35) {
      return {
        style: "simple",
        depth: "basic",
        examples: true,
        repetition: true
      };
    }

    if (score < 0.75) {
      return {
        style: "structured",
        depth: "moderate",
        examples: true,
        repetition: false
      };
    }

    return {
      style: "analytical",
      depth: "deep",
      examples: false,
      reasoning: true
    };
  }

  /**
   * 🎯 TYPE D'EXERCICE ADAPTATIF
   */
  getExerciseType(userProfile = {}) {
    const score = this.computeUserScore(userProfile);

    if (score < 0.35) return "mcq";
    if (score < 0.75) return "guided_problem";

    return "real_world_problem";
  }

  /**
   * 🧬 FLOW ADAPTATIF (temps réel)
   */
  adaptTutorFlow(userProfile = {}, lastPerformance = {}) {
    const accuracy = lastPerformance.accuracy || 0;
    const timeSpent = lastPerformance.timeSpent || 0;

    let flow = "normal";

    if (accuracy < 0.4) flow = "slow_mode";
    else if (accuracy > 0.8 && timeSpent < 30) flow = "fast_track";

    return {
      flow,
      accuracy,
      timeSpent
    };
  }

  /**
   * 🧠 PLAN D'APPRENTISSAGE GLOBAL
   */
  generateLearningPlan(userProfile = {}) {
    return {
      strategy: this.getStrategy(userProfile).strategy,
      explanation: this.getExplanationStyle(userProfile),
      exerciseType: this.getExerciseType(userProfile),
      adaptiveMode: this.getAdaptiveMode(userProfile)
    };
  }

  /**
   * ⚙️ MODE GLOBAL D'APPRENTISSAGE
   */
  getAdaptiveMode(userProfile = {}) {
    const score = this.computeUserScore(userProfile);

    if (score < 0.35) return "safe_learning";
    if (score > 0.75) return "aggressive_learning";

    return "balanced_learning";
  }

  /**
   * 📏 UTILITAIRE
   */
  clamp(value) {
    return Math.max(0, Math.min(1, value));
  }
}

module.exports = TutorStrategyService;
