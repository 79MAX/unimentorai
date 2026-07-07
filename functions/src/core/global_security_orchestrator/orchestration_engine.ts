import { DecisionRouter } from "./decision_router";
import { AutonomousResponseManager } from "./autonomous_response_manager";
import { OrchestrationMemory } from "./orchestration_memory";

export class OrchestrationEngine {

  static async process(event: any) {

    // 🧠 1. DECISION
    const decision = DecisionRouter.route(event);

    // ⚙️ 2. EXECUTION
    await AutonomousResponseManager.execute(
      decision,
      event
    );

    // 📦 3. MEMORY
    OrchestrationMemory.add({
      event,
      decision,
      timestamp: Date.now(),
    });

    return {
      success: true,
      decision,
    };
  }
}