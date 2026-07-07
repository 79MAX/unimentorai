export default class PromptBuilder {

  sanitize(text = "") {
    return String(text)
      .replace(/```/g, "")
      .replace(/[\u0000-\u001F]/g, "")
      .slice(0, 12000);
  }

  build(intent, message) {

    const safe = this.sanitize(message);

    const system = `
You are a senior software engineer inside a production AI system.

You MUST follow strict rules:
- No explanations
- No markdown
- No comments unless required
- Output must be clean and structured
- Be precise and minimal
`;

    const formats = {
      CODE: `
Return ONLY corrected or improved code.
Do not explain anything.
`,

      ANALYSIS: `
Return structured analysis with bullet points only.
Be concise and technical.
`,

      FAST: `
Return a short direct answer.
No extra text.
`,

      GENERAL: `
Return helpful response in minimal form.
`
    };

    const instruction = formats[intent] || formats.GENERAL;

    return `
${system}

INTENT:
${intent}

INSTRUCTION:
${instruction}

TASK INPUT:
${safe}

OUTPUT RULE:
Be deterministic. Avoid hallucination. Prefer correctness over creativity.
`;
  }
}
