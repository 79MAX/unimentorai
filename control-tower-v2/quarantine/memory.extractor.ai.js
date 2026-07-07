import { openai } from "../openai.client.js";

/* =========================
   🧠 UNIMENTOR AI MEMORY EXTRACTION ENGINE
   WORLD CLASS FACT EXTRACTION SYSTEM
========================= */

export class MemoryExtractor {

  /* =========================
     🚀 MAIN EXTRACTION PIPELINE
  ========================= */
  static async extract(message, aiResponse) {

    if (!message && !aiResponse) return [];

    const prompt = `
You are a WORLD CLASS AI MEMORY EXTRACTION SYSTEM.

TASK:
Extract ONLY long-term useful facts about the user.

RULES:
- Extract preferences, goals, skills, intentions
- Ignore greetings, filler, or short-term chat
- Each fact must be a short clear sentence
- Return ONLY valid JSON array
- No explanations, no markdown

INPUT:

User message:
${message || ""}

AI response:
${aiResponse || ""}

OUTPUT FORMAT:
["fact 1", "fact 2", "fact 3"]
`;

    try {

      const res =
        await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are a precise memory extraction engine that outputs ONLY valid JSON arrays."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.1
        });

      const output =
        res?.choices?.[0]?.message?.content;

      return this.safeParse(output);

    } catch (err) {

      console.error(
        "❌ MEMORY_EXTRACTION_ERROR:",
        err.message
      );

      return [];
    }
  }

  /* =========================
     🔐 SAFE JSON PARSER (CRITICAL)
  ========================= */
  static safeParse(output) {

    if (!output || typeof output !== "string") {
      return [];
    }

    try {

      // clean unwanted formatting
      const cleaned =
        output
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

      const parsed =
        JSON.parse(cleaned);

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed
        .filter(Boolean)
        .map(item => String(item).trim());

    } catch (err) {

      console.error("❌ PARSE_ERROR:", err.message);

      return [];
    }
  }

}
