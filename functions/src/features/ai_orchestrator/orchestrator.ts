import { ContextAggregator } from "./context_aggregator";
import { DecisionEngine } from "./decision_engine";

export class AISecurityOrchestrator {

  static async process(event: any) {

    // 🧠 1. BUILD GLOBAL CONTEXT
    const context = ContextAggregator.buildContext(event);

    // ⚖️ 2. MAKE DECISION
    const decision = DecisionEngine.decide(context);

    // 🚀 3. DISPATCH ACTIONS (SIMULATED HOOKS)
    await this.dispatch(decision, event);

    return {
      eventId: event.id || null,
      decision,
      context,
      timestamp: Date.now(),
    };
  }

  // ─────────────────────────────
  // 📡 ACTION DISPATCHER
  // ─────────────────────────────

  private static async dispatch(decision: any, event: any) {

    switch (decision.action) {

      case "BLOCK":
        console.log("🚨 BLOCK EXECUTED", event.userId);
        break;

      case "ESCALATE":
        console.log("⚠️ ESCALATION SENT TO SOC");
        break;

      case "MONITOR":
        console.log("👁️ MONITOR MODE ACTIVE");
        break;

      case "ALLOW":
        console.log("✅ SAFE REQUEST");
        break;
    }
  }
}