import { openai } from "./openai.client.js";
import { systemPrompt } from "./prompts/system.prompt.js";

/* =========================
   🧠 UNIMENTOR AI CORE ENGINE
   WORLD CLASS INTELLIGENT SERVICE LAYER
========================= */

export class AIService {

  /* =========================
     🚀 GENERATE AI RESPONSE (ROBUST + SAFE)
  ========================= */
  static async generateResponse(
    message,
    level = "BEGINNER",
    options = {}
  ) {

    if (!message?.trim()) {
      throw new Error("MESSAGE_REQUIRED");
    }

    const {
      temperature = 0.7,
      maxTokens = 1200,
      language = "fr"
    } = options;

    try {

      const completion =
        await openai.chat.completions.create({

          model: "gpt-4o-mini",

          messages: [

            /* =========================
               🧠 GLOBAL SYSTEM CONTEXT
            ========================= */
            {
              role: "system",
              content: systemPrompt
            },

            /* =========================
               🎯 LEVEL ADAPTATION LAYER
            ========================= */
            {
              role: "system",
              content: this.buildLevelPrompt(level)
            },

            /* =========================
               🌍 LANGUAGE CONTEXT
            ========================= */
            {
              role: "system",
              content: `Respond in language: ${language}`
            },

            /* =========================
               👤 USER INPUT
            ========================= */
            {
              role: "user",
              content: message.trim()
            }

          ],

          temperature,
          max_tokens: maxTokens,

          presence_penalty: 0.3,
          frequency_penalty: 0.2

        });

      const response =
        completion?.choices?.[0]?.message?.content;

      if (!response?.trim()) {
        throw new Error("EMPTY_AI_RESPONSE");
      }

      return {
        success: true,
        data: response
      };

    } catch (err) {

      console.error(
        "🔥 AI_SERVICE_ERROR:",
        {
          message: err.message,
          stack: err.stack
        }
      );

      return {
        success: false,
        error: "AI_UNAVAILABLE",
        message:
          "AI temporarily unavailable. Please retry."
      };
    }
  }

  /* =========================
     🧠 LEVEL INTELLIGENCE ENGINE
  ========================= */
  static buildLevelPrompt(level) {

    const LEVEL_MAP = {
      BEGINNER: {
        instruction:
          "Explain in very simple terms. Use analogies and step-by-step breakdown.",
        style: "simple"
      },

      INTERMEDIATE: {
        instruction:
          "Provide structured explanations with real-world examples and clarity.",
        style: "structured"
      },

      ADVANCED: {
        instruction:
          "Focus on deep insights, optimization, architecture, and expert-level reasoning.",
        style: "expert"
      }
    };

    const config =
      LEVEL_MAP[level] || LEVEL_MAP.BEGINNER;

    return `
LEVEL: ${level}
STYLE: ${config.style}
INSTRUCTIONS: ${config.instruction}

IMPORTANT:
- Be precise
- Be practical
- Avoid unnecessary complexity
- Focus on learning outcomes
    `.trim();
  }

  /* =========================
     🚀 RESPONSE VALIDATION UTILITY
  ========================= */
  static validateResponse(response) {

    return (
      typeof response === "string" &&
      response.trim().length > 0
    );

  }

}

