import fs from "fs";

export class ControlTowerOrchestrator {
  constructor(systemMapPath = "./system-map-v2.json") {
    this.systemMapPath = systemMapPath;
  }

  loadSystemMap() {
    try {
      return JSON.parse(fs.readFileSync(this.systemMapPath, "utf-8"));
    } catch {
      return { status: "NOT_PRESENT" };
    }
  }

  selectModel(task) {
    if (/bug|error|fix/i.test(task)) return "qwen2.5-coder:7b";
    if (/code|refactor|architecture/i.test(task)) return "qwen3-coder:30b";
    if (/analysis|audit|security/i.test(task)) return "deepseek-r1:8b";
    if (/ui|ux|flutter/i.test(task)) return "gemma3:latest";
    return "llama3.1:8b";
  }

  buildPrompt(task) {
    const map = this.loadSystemMap();

    return `
SYSTEM RULES:
- DO NOT hallucinate
- ONLY use SYSTEM_MAP
- If missing → NOT PRESENT

SYSTEM_MAP:
${JSON.stringify(map, null, 2)}

TASK:
${task}
`;
  }
}
