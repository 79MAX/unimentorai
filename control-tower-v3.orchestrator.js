import fs from "fs";

export class ControlTowerV3 {

  loadSystemMap() {
    try {
      return JSON.parse(fs.readFileSync("./system-map-v2.json", "utf-8"));
    } catch {
      return { status: "NOT_PRESENT" };
    }
  }

  selectAgent(task) {
    if (/security|hack|auth|jwt/i.test(task)) return "security-agent";
    if (/refactor|cleanup|duplicate/i.test(task)) return "refactor-agent";
    if (/bug|error|fix|debug/i.test(task)) return "bug-fixer-agent";
    if (/performance|slow|optimize/i.test(task)) return "performance-agent";
    return "architect-agent";
  }

  selectModel(task) {
    if (/security/i.test(task)) return "deepseek-r1:8b";
    if (/code|refactor/i.test(task)) return "qwen3-coder:30b";
    if (/bug|fix/i.test(task)) return "qwen2.5-coder:7b";
    if (/design|architecture/i.test(task)) return "llama3.1:8b";
    return "llama3.1:8b";
  }

  buildPrompt(task) {
    const systemMap = this.loadSystemMap();

    return `
SYSTEM RULES:
- ABSOLUTE NO HALLUCINATION
- USE ONLY SYSTEM_MAP
- IF MISSING → NOT PRESENT

SYSTEM MAP:
${JSON.stringify(systemMap, null, 2)}

TASK:
${task}
`;
  }
}
