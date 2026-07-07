import Memory from "./memory.model.js";
import { EmbeddingService } from "./embedding.service.js";

/* =========================
   🧠 UNIMENTOR AI VECTOR MEMORY ENGINE
   WORLD CLASS SEMANTIC MEMORY SYSTEM
========================= */

export class MemoryVectorService {

  /* =========================
     💾 SAVE MEMORY WITH VECTOR
  ========================= */
  static async saveMemory({
    userId,
    content,
    metadata = {},
    importanceScore = 1
  }) {

    if (!userId || !content) return null;

    const vector =
      await EmbeddingService.embed(content);

    return await Memory.create({
      userId,
      content,
      metadata,
      embedding: vector,
      importanceScore
    });
  }

  /* =========================
     🔍 SEMANTIC SEARCH ENGINE
     (HYBRID VECTOR + METADATA)
  ========================= */
  static async search(userId, query, limit = 8) {

    if (!userId || !query) return [];

    const queryVector =
      await EmbeddingService.embed(query);

    if (!queryVector) return [];

    /* =========================
       ⚡ FETCH ONLY USER MEMORY
    ========================= */
    const memories =
      await Memory.find({ userId })
        .select("content embedding metadata importanceScore role createdAt")
        .lean();

    if (!memories.length) return [];

    /* =========================
       🧠 HYBRID SCORING SYSTEM
       VECTOR + IMPORTANCE + RECENCY
    ========================= */
    const ranked = memories
      .map(memory => {

        const vectorScore =
          this.cosineSimilarity(
            queryVector,
            memory.embedding || []
          );

        const importance =
          memory.importanceScore || 1;

        const recencyBoost =
          this.getRecencyBoost(memory.createdAt);

        const finalScore =
          (vectorScore * 0.7) +
          (importance * 0.2) +
          (recencyBoost * 0.1);

        return {
          ...memory,
          score: finalScore
        };
      })

      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return ranked;
  }

  /* =========================
     📊 COSINE SIMILARITY ENGINE
     (OPTIMIZED + SAFE)
  ========================= */
  static cosineSimilarity(a, b) {

    if (!a || !b) return 0;
    if (a.length !== b.length) return 0;

    let dot = 0;
    let magA = 0;
    let magB = 0;

    for (let i = 0; i < a.length; i++) {

      const x = a[i];
      const y = b[i];

      dot += x * y;
      magA += x * x;
      magB += y * y;
    }

    const denom =
      Math.sqrt(magA) * Math.sqrt(magB);

    return denom === 0 ? 0 : dot / denom;
  }

  /* =========================
     ⏱️ RECENCY BOOST SYSTEM
     (IMPORTANT FOR AI MEMORY)
  ========================= */
  static getRecencyBoost(date) {

    if (!date) return 0;

    const diff =
      Date.now() - new Date(date).getTime();

    const days = diff / (1000 * 60 * 60 * 24);

    if (days < 1) return 1;
    if (days < 7) return 0.8;
    if (days < 30) return 0.5;

    return 0.2;
  }

}
