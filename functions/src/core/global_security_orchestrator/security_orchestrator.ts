import { OrchestrationEngine } from "./orchestration_engine";

export class GlobalSecurityOrchestrator {

  static async handle(event: any) {

    return OrchestrationEngine.process(event);
  }
}