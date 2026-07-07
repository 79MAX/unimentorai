class MentorDifficultyAdjuster {

  // =========================
  // 🧠 MAIN ENTRY
  // =========================
  async adjust(userId, learning = {}) {
    const userLevel = learning?.difficultyGuess || "intermediate";
    const score = learning?.score || 50;
    const intent = learning?.intent || "exploration";

    return {
      level: this.computeLevel(userLevel, score),
      difficultyScore: this.computeDifficultyScore(score),
      recommendation: this.getRecommendation(score, intent),
      nextStep: this.suggestNextStep(score),
      adaptationMode: this.getAdaptationMode(score)
    };
  }

  // =========================
  // 📊 LEVEL CALCULATION
  // =========================
  computeLevel(level, score) {
    if (score < 30) return "beginner";
    if (score < 70) return level || "intermediate";
    return "advanced";
  }

  // =========================
  // 🧮 DIFFICULTY SCORE ENGINE
  // =========================
  computeDifficultyScore(score) {
    if (score < 20) return 1;
    if (score < 40) return 2;
    if (score < 60) return 3;
    if (score < 80) return 4;

    return 5;
  }

  // =========================
  // 🎯 RECOMMENDATION ENGINE
  // =========================
  getRecommendation(score, intent) {
    if (score < 30) {
      return "reduce_complexity";
    }

    if (score > 70 && intent === "practice") {
      return "increase_challenge";
    }

    return "keep_current_level";
  }

  // =========================
  // 🚀 NEXT STEP SUGGESTION
  // =========================
  suggestNextStep(score) {
    if (score < 30) {
      return "basic_explanation";
    }

    if (score < 60) {
      return "guided_practice";
    }

    return "advanced_problem_solving";
  }

  // =========================
  // ⚙️ ADAPTATION MODE ENGINE
  // =========================
  getAdaptationMode(score) {
    if (score < 30) return "simplify";
    if (score > 70) return "challenge";

    return "balanced";
  }
}

export default MentorDifficultyAdjuster;
