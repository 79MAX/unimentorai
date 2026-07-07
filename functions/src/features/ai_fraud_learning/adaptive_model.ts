export class AdaptiveModel {

  static adjustScore(baseScore: number, patterns: any) {

    let adjusted = baseScore;

    // 🔥 auto-learning rule
    if (patterns.riskTrend === "HIGH") {
      adjusted += 10;
    }

    if (patterns.fraudRate > 0.5) {
      adjusted += 15;
    }

    return Math.min(adjusted, 100);
  }
}