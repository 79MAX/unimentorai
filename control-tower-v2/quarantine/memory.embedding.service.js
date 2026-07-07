import { openai } from "../openai.client.js";

/* =========================
   🧠 UNIMENTOR AI EMBEDDING ENGINE
   WORLD CLASS VECTOR GENERATION LAYER
========================= */

export class EmbeddingService {

  /* =========================
     🚀 MAIN EMBEDDING FUNCTION
     (ROBUST + SAFE + SCALABLE)
  ========================= */
  static async embed(text, options = {}) {

    if (!text || typeof text !== "string") {
      return null;
    }

    const cleanedText = text.trim();

    if (!cleanedText.length) return null;

    const {
      model = "text-embedding-3-small",
      retries = 2
    } = options;

    try {

      const response =
        await openai.embeddings.create({
          model,
          input: cleanedText
        });

      const vector =
        response?.data?.[0]?.embedding;

      if (!vector) {
        throw new Error("EMPTY_EMBEDDING");
      }

      return vector;

    } catch (err) {

      console.error(
        "❌ EMBEDDING_ERROR:",
        err.message
      );

      /* =========================
         🔁 SIMPLE RETRY LOGIC
      ========================= */
      if (retries > 0) {

        return await this.embed(
          text,
          {
            model,
            retries: retries - 1
          }
        );
      }

      return null;
    }
  }

  /* =========================
     🚀 BATCH EMBEDDING (SCALABLE)
  ========================= */
  static async embedBatch(texts = []) {

    if (!Array.isArray(texts)) return [];

    const cleanTexts =
      texts
        .filter(Boolean)
        .map(t => t.trim())
        .filter(t => t.length > 0);

    if (!cleanTexts.length) return [];

    try {

      const response =
        await openai.embeddings.create({
          model: "text-embedding-3-small",
          input: cleanTexts
        });

      return response.data.map(
        item => item.embedding
      );

    } catch (err) {

      console.error(
        "❌ BATCH_EMBEDDING_ERROR:",
        err.message
      );

      return [];
    }
  }

}
