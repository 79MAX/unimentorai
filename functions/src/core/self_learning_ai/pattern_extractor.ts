export class PatternExtractor {

  static extract(event: SecurityEvent) {

    if (event.score > 80) {
      return {
        patternType: "high_risk_behavior",
        confidence: 0.9,
      };
    }

    if (event.type === "FRAUD_DETECTED") {
      return {
        patternType: "fraud_signature",
        confidence: 0.95,
      };
    }

    return {
      patternType: "normal_behavior",
      confidence: 0.5,
    };
  }
}