import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

/* =========================
   🧠 OPENAI CLIENT (PRODUCTION READY)
========================= */

/**
 * Singleton OpenAI Client
 * - évite recréation multiple
 * - prêt production SaaS
 * - sécurisé + extensible
 */
class OpenAIClient {

  constructor() {

    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is missing in environment variables");
    }

    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  /**
   * Get OpenAI instance
   */
  getInstance() {
    return this.client;
  }
}

/* =========================
   🚀 SINGLETON EXPORT
========================= */
const instance = new OpenAIClient();

export const openai = instance.getInstance();

