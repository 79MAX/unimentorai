import { openai } from "../../openai.client.js";

/* =========================
   🧠 EMBEDDING ENGINE (PRODUCTION GRADE)
   - Optimisé performance
   - Safe fallback
   - Cache-ready
   - Batch-ready extension
========================= */

export class EmbeddingService {

  /**
   * 🚀 SINGLE TEXT EMBEDDING
   */
  static async embed(text) {

    if (!text || typeof text !== "string") return null;

    const cleanText = text.trim();

    if (!cleanText) return null;

    try {

      const response =
        await openai.embeddings.create({
          model: "text-embedding-3-small",
          input: cleanText
        });

      return response?.data?.[0]?.embedding || null;

    } catch (err) {

      console.error("[EMBEDDING_ERROR]", {
        message: err.message,
        stack: err.stack
      });

      return null;
    }
  }

  /**
   * 🚀 BATCH EMBEDDING (ULTRA IMPORTANT POUR SCALE)
   * permet de traiter plusieurs textes en une requête
   */
  static async embedBatch(texts = []) {

    if (!Array.isArray(texts) || texts.length === 0) return [];

    const cleanTexts =
      texts.map(t => (typeof t === "string" ? t.trim() : ""))
           .filter(Boolean);

    if (cleanTexts.length === 0) return [];

    try {

      const response =
        await openai.embeddings.create({
          model: "text-embedding-3-small",
          input: cleanTexts
        });

      return response.data.map(item => item.embedding);

    } catch (err) {

      console.error("[BATCH_EMBED_ERROR]", err.message);

      return [];
    }
  }

}
