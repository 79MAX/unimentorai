import { OrchestrationDecision } from "./orchestration_types";

export class DecisionRouter {

  static route(event: any): OrchestrationDecision {

    if (event.severity === "CRITICAL") {
      return {
        action: "ESCALATE_AND_HEAL",
        targetModule: "SELF_HEALING",
        confidence: 95,
      };
    }

    if (event.type === "FRAUD_DETECTED") {
      return {
        action: "RUN_FRAUD_ANALYSIS",
        targetModule: "FRAUD_ENGINE",
        confidence: 90,
      };
    }

    return {
      action: "LOG_ONLY",
      targetModule: "OBSERVABILITY",
      confidence: 70,
    };
  }
}