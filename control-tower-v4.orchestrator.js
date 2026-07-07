import fs from "fs";

export class ControlTowerV4 {

  loadSystemMap() {
    try {
      return JSON.parse(fs.readFileSync("./system-map-v2.json", "utf-8"));
    } catch {
      return { status: "NOT_PRESENT" };
    }
  }

  analyzeResult(output) {
    const issues = [];

    if (output.includes("duplicate")) issues.push("DUPLICATION_DETECTED");
    if (output.includes("error")) issues.push("ERROR_DETECTED");
    if (output.includes("security")) issues.push("SECURITY_RISK");

    return issues;
  }

  selectModel(task) {
    if (/security/i.test(task)) return "deepseek-r1:8b";
    if (/refactor|clean|duplicate/i.test(task)) return "qwen3-coder:30b";
    if (/bug|fix|error/i.test(task)) return "qwen2.5-coder:7b";
    return "llama3.1:8b";
  }

  buildPrompt(task, systemMap) {
    return `
YOU ARE SELF-HEALING AI SYSTEM.

RULES:
- NO HALLUCINATION
- USE ONLY SYSTEM_MAP
- DETECT ISSUES
- PROPOSE FIXES
- OUTPUT STRUCTURED JSON

SYSTEM MAP:
${JSON.stringify(systemMap, null, 2)}

TASK:
${task}
`;
  }
}
