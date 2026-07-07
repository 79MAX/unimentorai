import Memory from "../core/memory.model.js";

/* =========================
   🧠 VECTOR DATABASE ENGINE (PRODUCTION GRADE)
   - Fast ranking
   - Safe guards
   - Scalable design ready
   - Optimized cosine similarity
========================= */

export class MemoryVectorDB {

  /* =========================
     💾 INSERT VECTOR MEMORY
  ========================= */
  static async insert(data) {

    if (!data?.userId || !data?.embedding?.length) return null;

    try {

      return await Memory.create({
        ...data,
        createdAt: new Date()
      });

    } catch (err) {

      console.error("[VECTOR_INSERT_ERROR]", err.message);
      return null;
    }
  }

  /* =========================
     🔍 SEMANTIC SEARCH ENGINE
  ========================= */
  static async search(userId, queryVector, limit = 10) {

    if (!userId || !Array.isArray(queryVector)) return [];

    const memories =
      await Memory.find({ userId }).lean();

    if (!memories.length) return [];

    const ranked = [];

    for (const m of memories) {

      const embedding = m.embedding;

      if (!embedding || embedding.length === 0) continue;

      const score =
        this.cosineSimilarity(queryVector, embedding);

      ranked.push({
        ...m,
        score
      });
    }

    return ranked
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /* =========================
     📊 COSINE SIMILARITY (OPTIMIZED)
     - faster loops
     - reduced memory overhead
  ========================= */
  static cosineSimilarity(a, b) {

    if (!a || !b || a.length !== b.length) return 0;

    let dot = 0;
    let magA = 0;
    let magB = 0;

    const len = a.length;

    for (let i = 0; i < len; i++) {

      const x = a[i];
      const y = b[i];

      dot += x * y;
      magA += x * x;
      magB += y * y;
    }

    const denominator =
      Math.sqrt(magA) * Math.sqrt(magB);

    if (!denominator) return 0;

    return dot / denominator;
  }

}
