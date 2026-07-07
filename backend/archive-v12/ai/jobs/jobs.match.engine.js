import { JobsVectorEngine } from "./jobs.vector.engine.js";

export class JobsMatchEngine {

  /* =========================
     ⚡ CONFIG WEIGHTS
  ========================= */
  static WEIGHTS = {
    semantic: 0.7,
    skill: 0.3
  };

  /* =========================
     🚀 MAIN MATCH ENGINE
  ========================= */
  static match(user = {}, jobs = []) {

    if (!Array.isArray(jobs) || jobs.length === 0) {
      return [];
    }

    const userSkills = Array.isArray(user.skills)
      ? user.skills.map(s => String(s).toLowerCase())
      : [];

    const userSet = new Set(userSkills);

    const userVector =
      JobsVectorEngine.embed(userSkills.join(" "));

    const { semantic, skill } = this.WEIGHTS;

    const results = new Array(jobs.length);

    /* =========================
       🔁 FAST LOOP (OPTIMIZED)
    ========================= */
    for (let i = 0; i < jobs.length; i++) {

      const job = jobs[i] || {};

      const jobSkills = Array.isArray(job.skills)
        ? job.skills.map(s => String(s).toLowerCase())
        : [];

      /* =========================
         🧠 SEMANTIC SCORE
      ========================= */
      const jobVector =
        JobsVectorEngine.embed(jobSkills.join(" "));

      const semanticScore =
        JobsVectorEngine.cosine(userVector, jobVector);

      /* =========================
         ⚡ SKILL SCORE (FAST SET LOOKUP)
      ========================= */
      let matchCount = 0;

      for (let j = 0; j < jobSkills.length; j++) {
        if (userSet.has(jobSkills[j])) {
          matchCount++;
        }
      }

      const skillScore =
        jobSkills.length
          ? matchCount / jobSkills.length
          : 0;

      /* =========================
         🚀 FINAL HYBRID SCORE
      ========================= */
      const score =
        (semanticScore * semantic * 100) +
        (skillScore * skill * 100);

      const finalScore = Math.round(score);

      results[i] = {
        ...job,

        /* 🎯 SCORES */
        score: finalScore,
        semanticScore: Math.round(semanticScore * 100),
        skillScore: Math.round(skillScore * 100),

        /* 🧠 MATCH LEVEL */
        level: this.getLevel(finalScore)
      };
    }

    /* =========================
       📈 SORT RESULTS
    ========================= */
    return results.sort((a, b) => b.score - a.score);
  }

  /* =========================
     🧠 LEVEL ENGINE
  ========================= */
  static getLevel(score = 0) {

    if (score >= 85) return "PERFECT_MATCH";
    if (score >= 70) return "STRONG_MATCH";
    if (score >= 50) return "GOOD_MATCH";
    if (score >= 30) return "WEAK_MATCH";

    return "NO_MATCH";
  }
}

