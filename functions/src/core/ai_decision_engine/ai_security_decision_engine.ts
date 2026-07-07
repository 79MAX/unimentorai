import { RiskScorer } from "./risk_scorer";
import { DecisionRules } from "./decision_rules";
import { ActionExecutor } from "./action_executor";
import { SecurityDecision } from "./decision_types";

export class AISecurityDecisionEngine {

  static async evaluate(event: any): Promise<SecurityDecision> {

    // 🧠 1. RISK SCORE
    const riskScore = RiskScorer.computeRisk(event);

    // ⚙️ 2. DECISION
    const action = DecisionRules.decide(riskScore);

    // 🚀 3. EXECUTE ACTION
    ActionExecutor.execute(action, event);

    // 📊 4. RESPONSE OBJECT
    const decision: SecurityDecision = {
      action,
      score: riskScore,
      reason: event.reasons || ["AI evaluation completed"],
      confidence: Math.min(100, riskScore + 10),
      timestamp: Date.now(),
    };

    return decision;
  }
}