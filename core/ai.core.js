export class AICore {

  /* =========================
     🧠 SAFE NORMALIZER
  ========================= */
  static normalizeSkills(skills = []) {
    return skills
      .filter(Boolean)
      .map(s => String(s).toLowerCase().trim());
  }

  /* =========================
     🧠 CAREER ANALYSIS ENGINE (IMPROVED)
  ========================= */
  static analyzeCareer(user = {}, jobs = []) {

    const userSkills = this.normalizeSkills(user.skills);

    const experienceBonusMap = {
      senior: 10,
      mid: 5,
      junior: 0,
      default: 0
    };

    const bonus =
      experienceBonusMap[user.experienceLevel] ||
      experienceBonusMap.default;

    const results = jobs.map(job => {

      const jobSkills = this.normalizeSkills(job.skills);

      const matched = jobSkills.filter(skill =>
        userSkills.includes(skill)
      );

      const missing = jobSkills.filter(skill =>
        !userSkills.includes(skill)
      );

      const baseScore = jobSkills.length
        ? matched.length / jobSkills.length
        : 0;

      const finalScore = Math.min(
        100,
        Math.round((baseScore * 100) + bonus)
      );

      return {
        jobId: job.id,
        title: job.title,
        score: finalScore,
        matchLevel: this.getMatchLevel(finalScore),
        matchedSkills: matched,
        missingSkills: missing,
        completionRate: Math.round(baseScore * 100)
      };
    });

    return results.sort((a, b) => b.score - a.score);
  }

  /* =========================
     🎯 MATCH LEVEL ENGINE (CLEAN)
  ========================= */
  static getMatchLevel(score) {
    if (score >= 80) return "STRONG";
    if (score >= 50) return "MEDIUM";
    return "WEAK";
  }

  /* =========================
     💬 SMART AI CHAT ENGINE (IMPROVED)
  ========================= */
  static chat(message = "") {

    const msg = message.toLowerCase().trim();

    const intentMap = [
      {
        keywords: ["cv", "resume", "curriculum"],
        response: "Optimise ton CV avec des résultats mesurables + projets concrets."
      },
      {
        keywords: ["job", "emploi", "travail"],
        response: "Cible les offres qui matchent au moins 70% de tes compétences."
      },
      {
        keywords: ["salaire", "salary", "money"],
        response: "Augmente ta valeur marché avec des projets réels et visibles."
      },
      {
        keywords: ["entretien", "interview"],
        response: "Prépare-toi avec la méthode STAR + simulations d'entretien."
      }
    ];

    const match = intentMap.find(item =>
      item.keywords.some(k => msg.includes(k))
    );

    return match
      ? {
          type: "INTENT_RESPONSE",
          response: match.response
        }
      : {
          type: "GENERAL",
          response: "Peux-tu préciser ton objectif carrière pour que je t'aide mieux ?"
        };
  }
}
