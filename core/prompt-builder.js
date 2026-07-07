export default class PromptBuilder {

  build(intent, message) {

    const safe = String(message)
      .replace(/```/g, "")
      .replace(/[\u0000-\u001F]/g, "")
      .trim()
      .slice(0, 8000);

    const base = `
You are a senior software engineer inside an AI production system.
You MUST return only final output.

RULES:
- No explanations
- No thinking process
- No markdown
- No comments
`;

    switch (intent) {

      case "CODE":
        return `${base}
TASK: Fix or improve code only
INPUT:
${safe}`;

      case "ANALYSIS":
        return `${base}
TASK: Analyze and give structured answer
INPUT:
${safe}`;

      case "FAST":
        return `${base}
TASK: Short direct answer only
INPUT:
${safe}`;

      case "AUTO_FIX":
        return `${base}
TASK: Fix all issues and return corrected code only
INPUT:
${safe}`;

      default:
        return `${base}
TASK:
${safe}`;
    }
  }
}
