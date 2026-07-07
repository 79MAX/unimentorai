import Memory from "./memory.model.js";

/* =========================
   🔍 UNIMENTOR AI MEMORY RETRIEVAL ENGINE
   WORLD CLASS CONTEXT SEARCH SYSTEM
========================= */

export class MemoryRetrieval {

  /* =========================
     🚀 MAIN RETRIEVAL FUNCTION
     SMART + RANKED + FALLBACK READY
  ========================= */
  static async getRelevantMemory(
    userId,
    query,
    limit = 8
  ) {

    if (!userId) return [];

    try {

      const keywords = this.extractKeywords(query);

      /* =========================
         🔍 SMART SEARCH (KEYWORD + SEMANTIC READY)
      ========================= */
      const memories = await Memory.find({
        userId,
        archived: false,
        $or: [
          { content: { $regex: keywords, $options: "i" } },
          { "metadata.topic": { $regex: keywords, $options: "i" } }
        ]
      })
      .sort({
        importanceScore: -1,
        createdAt: -1
      })
      .limit(limit * 2) // oversample for re-ranking
      .lean();

      /* =========================
         🧠 RE-RANK MEMORY (INTELLIGENT SCORING)
      ========================= */
      const ranked = this.rankMemories(memories, query);

      return ranked.slice(0, limit);

    } catch (err) {

      console.error(
        "❌ MEMORY_RETRIEVAL_ERROR:",
        err.message
      );

      return [];
    }
  }

  /* =========================
     🔑 KEYWORD EXTRACTION ENGINE
  ========================= */
  static extractKeywords(query = "") {

    return query
      .toLowerCase()
      .split(" ")
      .filter(word => word.length > 2)
      .slice(0, 5)
      .join("|");
  }

  /* =========================
     🧠 INTELLIGENT MEMORY RANKING
     (SIMULATES SEMANTIC RELEVANCE)
  ========================= */
  static rankMemories(memories, query) {

    const q = query.toLowerCase();

    return memories
      .map(memory => {

        let score = memory.importanceScore || 1;

        const content = (memory.content || "").toLowerCase();

        /* =========================
           🎯 RELEVANCE BOOSTING RULES
        ========================= */
        if (content.includes(q)) score += 5;

        if (this.hasKeywordMatch(content, q)) score += 3;

        if (memory.metadata?.topic &&
            q.includes(memory.metadata.topic)) {
          score += 2;
        }

        if (memory.role === "system") score += 1;

        return {
          ...memory,
          _score: score
        };

      })
      .sort((a, b) => b._score - a._score);
  }

  /* =========================
     🔍 KEYWORD MATCH CHECKER
  ========================= */
  static hasKeywordMatch(content, query) {

    const words = query.split(" ");

    return words.some(word =>
      content.includes(word)
    );
  }

}
