export class MemoryRankService {

  /**
   * 🚀 HYBRID MEMORY RANKING ENGINE
   * - keyword scoring
   * - importance boost
   * - topic matching
   * - safe + scalable
   */
  static rank(memories = [], query = "") {

    if (!Array.isArray(memories) || memories.length === 0) return [];

    const q = (query || "").toLowerCase();

    return memories
      .map((m) => {

        let score = this.baseScore(m);

        const content = (m.content || "").toLowerCase();

        /* =========================
           🔍 KEYWORD MATCH BOOST
        ========================= */
        if (q && content.includes(q)) {
          score += 5;
        }

        /* =========================
           🧠 TOPIC MATCH BOOST
        ========================= */
        const topic = m?.metadata?.topic;

        if (topic && q.includes(topic.toLowerCase())) {
          score += 3;
        }

        /* =========================
           ⚡ EXACT MATCH BOOST
        ========================= */
        if (q && content.startsWith(q)) {
          score += 2;
        }

        return {
          ...m,
          score: Math.min(score, 100) // 🔥 cap for stability
        };
      })

      /* =========================
         📊 SORT BY RELEVANCE
      ========================= */
      .sort((a, b) => b.score - a.score);
  }

  /**
   * 🧠 BASE IMPORTANCE SCORE ENGINE
   */
  static baseScore(memory) {

    let score = memory?.importanceScore || 1;

    /* =========================
       🧠 ROLE BOOST (SYSTEM MEMORY)
    ========================= */
    if (memory?.role === "system") score += 1;

    /* =========================
       📅 RECENCY BOOST (if timestamps exist)
    ========================= */
    if (memory?.createdAt) {

      const ageDays =
        (Date.now() - new Date(memory.createdAt)) / 86400000;

      if (ageDays < 1) score += 2;
      else if (ageDays < 7) score += 1;
    }

    return score;
  }

}
