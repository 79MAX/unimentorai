export class JobsRecommendationEngine {

  /* =========================
     🚀 TOP N RANKING ENGINE
  ========================= */
  static top(jobs = [], limit = 5) {

    if (!Array.isArray(jobs) || jobs.length === 0) {
      return [];
    }

    return jobs
      .slice()
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, limit);
  }

  /* =========================
     🎯 DIVERSIFICATION ENGINE (OPTIMIZED)
  ========================= */
  static diversify(jobs = [], limit = 10) {

    if (!Array.isArray(jobs) || jobs.length === 0) {
      return [];
    }

    const result = [];
    const seenCategories = new Set();

    /* =========================
       🧠 PASS 1 — CATEGORY BALANCING
    ========================= */
    for (let i = 0; i < jobs.length; i++) {

      const job = jobs[i];
      if (!job) continue;

      const category = job.category || "uncategorized";

      if (!seenCategories.has(category)) {
        seenCategories.add(category);
        result.push(job);

        if (result.length >= limit) {
          return result;
        }
      }
    }

    /* =========================
       🔁 PASS 2 — FILL WITH BEST REMAINING
    ========================= */
    if (result.length < limit) {

      const remaining = jobs
        .filter(job => job && !result.includes(job))
        .sort((a, b) =>
          (b.score || 0) - (a.score || 0)
        );

      for (let i = 0; i < remaining.length; i++) {

        result.push(remaining[i]);

        if (result.length >= limit) break;
      }
    }

    return result;
  }

  /* =========================
     🚀 HYBRID ENGINE (BEST QUALITY FEED)
  ========================= */
  static hybrid(jobs = [], limit = 10) {

    if (!Array.isArray(jobs) || jobs.length === 0) {
      return [];
    }

    // 1. Pre-rank (fast shortlist)
    const topPool = this.top(jobs, limit * 3);

    // 2. Diversify for feed quality
    return this.diversify(topPool, limit);
  }

  /* =========================
     📊 FAST SCORING HELPER (OPTIONAL EXTENSION HOOK)
  ========================= */
  static score(job = {}) {
    return job?.score || 0;
  }
}

