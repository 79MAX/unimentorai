import Memory from "./memory.model.js";
import { openai } from "../openai.client.js";

/* =========================
   🧠 UNIMENTOR AI MEMORY COMPRESSION ENGINE
   WORLD CLASS USER MEMORY SUMMARIZATION SYSTEM
========================= */

export class MemoryCompression {

  /* =========================
     🚀 MAIN COMPRESSION PIPELINE
  ========================= */
  static async compress(userId) {

    if (!userId) return null;

    try {

      const memories =
        await Memory.find({ userId }).lean();

      if (!memories.length) {
        return this.emptyProfile();
      }

      /* =========================
         ⚡ MEMORY PREPROCESSING
      ========================= */
      const text =
        this.prepareText(memories);

      /* =========================
         🧠 AI COMPRESSION ENGINE
      ========================= */
      const res =
        await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `
You are a WORLD CLASS AI MEMORY COMPRESSION ENGINE.

TASK:
Convert raw user memory into a structured user profile.

RULES:
- Be concise but meaningful
- Group information into categories
- Remove duplicates
- Infer patterns about the user
- Output ONLY valid JSON

OUTPUT FORMAT:
{
  "summary": "...",
  "preferences": [],
  "goals": [],
  "skills": [],
  "interests": [],
  "behavior_patterns": []
}
              `.trim()
            },
            {
              role: "user",
              content: text
            }
          ],
          temperature: 0.2
        });

      const output =
        res?.choices?.[0]?.message?.content;

      return this.safeParse(output);

    } catch (err) {

      console.error("❌ MEMORY_COMPRESSION_ERROR:", err.message);

      return this.emptyProfile();
    }
  }

  /* =========================
     ⚡ MEMORY PREPROCESSING
  ========================= */
  static prepareText(memories) {

    return memories
      .slice(-200) // prevent huge context overload
      .map(m => `- ${m.content}`)
      .join("\n");
  }

  /* =========================
     🔐 SAFE JSON PARSER
  ========================= */
  static safeParse(output) {

    if (!output || typeof output !== "string") {
      return this.emptyProfile();
    }

    try {

      const cleaned =
        output
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

      return JSON.parse(cleaned);

    } catch (err) {

      console.error("❌ COMPRESSION_PARSE_ERROR:", err.message);

      return this.emptyProfile();
    }
  }

  /* =========================
     🧠 DEFAULT SAFE PROFILE
  ========================= */
  static emptyProfile() {

    return {
      summary: "New user with no memory yet",
      preferences: [],
      goals: [],
      skills: [],
      interests: [],
      behavior_patterns: []
    };
  }

}
