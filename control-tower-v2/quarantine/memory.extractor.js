import { openai } from "../../openai.client.js";

/* =========================
   🧠 MEMORY FACT EXTRACTOR (PRODUCTION GRADE)
   - Structured output safe parsing
   - Strong prompt control
   - JSON guard
   - RAG-ready memory pipeline
========================= */

export class MemoryExtractor {

  /**
   * 🚀 EXTRACT LONG TERM FACTS
   */
  static async extract(message, aiResponse) {

    if (!message || typeof message !== "string") return [];

    const prompt = `
You are a high-precision MEMORY EXTRACTION ENGINE.

Extract ONLY long-term useful facts about the user.

STRICT RULES:
- Extract ONLY: goals, preferences, skills, intentions, decisions
- Ignore greetings, jokes, or temporary context
- Keep facts short and reusable in future AI conversations
- Output MUST be valid JSON array of strings
- If nothing useful → return []

USER MESSAGE:
${message}

AI RESPONSE:
${aiResponse}

OUTPUT FORMAT:
["fact1", "fact2", "fact3"]
`;

    try {

      const res = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.1, // 🔥 lower = more consistent extraction
        messages: [
          {
            role: "system",
            content:
              "You are a strict JSON-only memory extraction system. Return ONLY valid JSON arrays."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      });

      const content = res?.choices?.[0]?.message?.content?.trim();

      if (!content) return [];

      /* =========================
         🧠 SAFE JSON PARSING LAYER
      ========================= */
      const parsed = this.safeParse(content);

      return Array.isArray(parsed) ? parsed : [];

    } catch (err) {

      console.error("[MEMORY_EXTRACT_ERROR]", {
        message: err.message,
        stack: err.stack
      });

      return [];
    }
  }

  /**
   * 🧠 SAFE JSON PARSER (ANTI GPT MALFORMED OUTPUT)
   */
  static safeParse(text) {

    try {
      return JSON.parse(text);
    } catch {

      // fallback cleanup (GPT sometimes returns ```json blocks)
      const cleaned = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      try {
        return JSON.parse(cleaned);
      } catch {
        return [];
      }
    }
  }

}
