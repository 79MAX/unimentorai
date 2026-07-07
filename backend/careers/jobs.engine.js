/**
 * 💼 JOBS ENGINE — UNIMENTORAI (PRODUCTION GRADE)
 * AI Talent Matching System (LinkedIn / Indeed style)
 */

export class JobsEngine {

  /* =========================
     🚀 MAIN MATCH ENGINE
  ========================= */
  static match(user, jobs = []) {

    const userSkills = new Set(user.skills || []);
    const userLevel = user.level || "junior";

    return jobs.map(job => {

      const score = this.calculateScore({
        userSkills,
        job,
        userLevel
      });

      return {
        ...job,

        match: score.total,

        matchLevel: this.getMatchLevel(score.total),

        breakdown: score.breakdown
      };
    }).sort((a, b) => b.match - a.match);
  }

  /* =========================
     🧠 SMART SCORING ENGINE
  ========================= */
  static calculateScore({ userSkills, job, userLevel }) {

    const jobSkills = job.skills || [];

    let matchedSkills = 0;
    let weightedScore = 0;

    const breakdown = [];

    for (let i = 0; i < jobSkills.length; i++) {

      const skill = jobSkills[i];

      if (userSkills.has(skill)) {
        matchedSkills++;

        // 🎯 weight system (important skill boost)
        const weight = job.criticalSkills?.includes(skill) ? 2 : 1;

        weightedScore += weight;

        breakdown.push({ skill, matched: true, weight });
      } else {
        breakdown.push({ skill, matched: false, weight: 0 });
      }
    }

    const baseScore = jobSkills.length
      ? matchedSkills / jobSkills.length
      : 0;

    const weighted = jobSkills.length
      ? weightedScore / (jobSkills.length * 2)
      : 0;

    // 🧠 final hybrid score (simple ML-like blend)
    const total = Math.round((baseScore * 60) + (weighted * 40));

    return {
      total,
      breakdown,
      matchedSkills
    };
  }

  /* =========================
     📊 MATCH QUALITY LEVELS
  ========================= */
  static getMatchLevel(score) {

    if (score >= 85) return "PERFECT_MATCH";
    if (score >= 70) return "STRONG_MATCH";
    if (score >= 50) return "GOOD_MATCH";
    if (score >= 30) return "WEAK_MATCH";

    return "NO_MATCH";
  }

  /* =========================
     📈 ADVANCED FILTERING (OPTIONAL UPGRADE LAYER)
  ========================= */
  static filterByConstraints(user, jobs = []) {

    return jobs.filter(job => {

      // location filter
      if (job.location && user.location) {
        if (job.location !== user.location && !job.remote) {
          return false;
        }
      }

      // experience filter
      if (job.experienceLevel && user.level) {

        const levels = ["junior", "mid", "senior"];

        const userIndex = levels.indexOf(user.level);
        const jobIndex = levels.indexOf(job.experienceLevel);

        if (userIndex < jobIndex - 1) return false;
      }

      return true;
    });
  }
}

