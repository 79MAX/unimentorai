import { BehaviorAnalyzer } from "./behavior_analyzer";
import { AnomalyDetector } from "./anomaly_detector";

export class RiskModel {

  static compute(input: any): number {

    const behaviorScore = BehaviorAnalyzer.analyze(input);
    const anomalyScore = AnomalyDetector.detect(input.ip);

    // 🧠 weighted AI model
    const totalScore =
      behaviorScore * 0.6 +
      anomalyScore * 0.4;

    return Math.round(totalScore);
  }
}