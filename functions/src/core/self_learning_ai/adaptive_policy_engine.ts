import { LearnedPattern } from "./learning_types";

export class AdaptivePolicyEngine {

  static generateRule(pattern: LearnedPattern) {

    if (pattern.patternType === "high_risk_behavior") {
      return {
        ruleId: `rule_${Date.now()}`,
        condition: "score > 80",
        action: "BLOCK_DEVICE",
        weight: 0.9,
        active: true,
      };
    }

    if (pattern.patternType === "fraud_signature") {
      return {
        ruleId: `rule_${Date.now()}`,
        condition: "type == FRAUD_DETECTED",
        action: "RESET_SESSION",
        weight: 0.95,
        active: true,
      };
    }

    return null;
  }
}