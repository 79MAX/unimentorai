import { OrchestratorDecision } from "./orchestrator_types";

export class DecisionEngine {

  static decide(context: any): OrchestratorDecision {

    const score = context.riskScore;

    // 🚨 CRITICAL THREAT
    if (score >= 90) {
      return {
        action: "BLOCK",
        reason: "Critical fraud risk detected",
        confidence: 0.98,
        targetSystems: ["auto_response", "fraud_engine", "alert_system"],
      };
    }

    // ⚠️ HIGH RISK
    if (score >= 70) {
      return {
        action: "ESCALATE",
        reason: "High risk behavior detected",
        confidence: 0.85,
        targetSystems: ["alert_system", "soc_dashboard"],
      };
    }

    // 👁️ MEDIUM RISK
    if (score >= 40) {
      return {
        action: "MONITOR",
        reason: "Suspicious behavior requires observation",
        confidence: 0.7,
        targetSystems: ["logging", "analytics"],
      };
    }

    // ✅ SAFE
    return {
      action: "ALLOW",
      reason: "Normal behavior",
      confidence: 0.95,
      targetSystems: ["none"],
    };
  }
}