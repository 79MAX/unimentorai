import { SelfHealingEngine } from "./control-tower-v4.selfheal.js";

export class V4Engine {

  constructor() {
    this.healer = new SelfHealingEngine();
  }

  process(aiOutput) {

    const issues = this.healer.detectIssues(aiOutput);

    const fixes = [];

    for (const [key, value] of Object.entries(issues)) {
      if (value) {
        fixes.push(this.healer.generatePatch(key));
      }
    }

    return {
      issues,
      fixes,
      status: fixes.length === 0 ? "HEALTHY" : "NEEDS_REPAIR"
    };
  }
}
