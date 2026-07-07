import { AttackScenarios } from "./attack_scenarios";
import { FakeEventGenerator } from "./fake_event_generator";
import { SimulationMetrics } from "./simulation_metrics";

import { FraudEngineV2 } from "../fraud/fraud_engine_v2";
import { AutoResponseEngine } from "../auto_response/response_engine";

export class SimulationEngine {

  static async runFullSimulation() {

    const scenarios = Object.values(AttackScenarios);

    for (const scenario of scenarios) {

      for (let i = 0; i < scenario.frequency; i++) {

        const event = FakeEventGenerator.generateAttackEvent(scenario);

        // 🧠 FRAUD ANALYSIS
        const result = await FraudEngineV2.analyze(event);

        // 🚨 AUTO RESPONSE
        await AutoResponseEngine.process({
          ...event,
          score: result.score,
          userId: event.userId,
          deviceId: event.deviceId,
        });

        const blocked = result.isFraud;

        SimulationMetrics.record(event, blocked);
      }
    }

    return SimulationMetrics.getReport();
  }
}