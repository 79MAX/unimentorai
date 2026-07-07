export class JobsExplanationEngine {

  /* =========================
     🚀 MAIN ENGINE (SAFE + FAST)
  ========================= */
  static explain(user = {}, job = {}) {

    const userSkills = this.normalizeSkills(user.skills);
    const jobSkills = this.normalizeSkills(job.skills);

    if (!jobSkills.length) {
      return this.emptyResponse(job);
    }

    /* =========================
       🧠 SKILL ANALYSIS (FAST SET OPS)
    ========================= */
    const userSet = new Set(userSkills);

    const matchedSkills = [];
    const missingSkills = [];

    for (let i = 0; i < jobSkills.length; i++) {

      const skill = jobSkills[i];

      if (userSet.has(skill)) {
        matchedSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    }

    const matchRate = Math.round(
      (matchedSkills.length / jobSkills.length) * 100
    );

    /* =========================
       🎯 SMART DIFFICULTY (IMPROVED MODEL)
    ========================= */
    const difficulty = this.computeDifficulty({
      jobSkillCount: jobSkills.length,
      matchRate
    });

    /* =========================
       🧠 AI INSIGHT ENGINE
    ========================= */
    const insight = this.generateInsight({
      matchRate,
      missingSkills,
      job,
      user
    });

    /* =========================
       🚀 FINAL RESPONSE (CLEAN + SaaS READY)
    ========================= */
    return {
      jobTitle: job.title || "Unknown",
      category: job.category || "general",

      /* 📊 CORE AI METRICS */
      matchRate,
      difficulty,

      /* 🧠 SKILL INTELLIGENCE */
      matchedSkills,
      missingSkills,

      missingCount: missingSkills.length,
      matchedCount: matchedSkills.length,

      /* 💡 AI EXPLANATION LAYER */
      explanation: insight.explanation,
      whyThisJobFitsYou: insight.why,
      howToImprove: insight.improve,

      /* 🚀 CAREER SIGNAL */
      careerSignal: this.getCareerSignal(matchRate),

      /* 📌 META */
      score: job.score || 0,
      timestamp: Date.now()
    };
  }

  /* =========================
     🧼 SAFE NORMALIZATION
  ========================= */
  static normalizeSkills(skills) {

    if (!Array.isArray(skills)) return [];

    return skills
      .filter(Boolean)
      .map(s => String(s).toLowerCase().trim())
      .filter(s => s.length > 0);
  }

  /* =========================
     🎯 IMPROVED DIFFICULTY ENGINE
  ========================= */
  static computeDifficulty({ jobSkillCount, matchRate }) {

    // 🔥 smarter hybrid logic
    const complexityScore = jobSkillCount + (100 - matchRate) / 10;

    if (complexityScore >= 12) return "SENIOR";
    if (complexityScore >= 7) return "INTERMEDIATE";
    if (complexityScore >= 4) return "JUNIOR";

    return "ENTRY_LEVEL";
  }

  /* =========================
     🧠 INSIGHT ENGINE (MORE HUMAN + AI STYLE)
  ========================= */
  static generateInsight({ matchRate, missingSkills, job }) {

    const topMissing = missingSkills.slice(0, 3).join(", ");

    let explanation = "";
    let why = "";
    let improve = "";

    /* =========================
       🟢 HIGH MATCH
    ========================= */
    if (matchRate >= 80) {

      explanation =
        `Excellent match (${matchRate}%) — ce poste correspond fortement à ton profil.`;

      why =
        `Tu maîtrises déjà les compétences clés attendues pour ${job.title}.`;

      improve =
        `Optimise ton profil et construis des projets avancés pour te démarquer.`;
    }

    /* =========================
       🟡 MEDIUM MATCH
    ========================= */
    else if (matchRate >= 50) {

      explanation =
        `Bon potentiel (${matchRate}%) — ce job est accessible avec un effort ciblé.`;

      why =
        `Tu as les bases nécessaires mais certaines compétences doivent être renforcées.`;

      improve =
        topMissing
          ? `Apprends prioritairement : ${topMissing}`
          : `Renforce ton niveau général sur ce domaine.`;
    }

    /* =========================
       🔴 LOW MATCH
    ========================= */
    else {

      explanation =
        `Faible correspondance (${matchRate}%) — ce poste nécessite une montée en compétence.`;

      why =
        `Les compétences actuelles ne couvrent pas encore les exigences du poste.`;

      improve =
        topMissing
          ? `Commence par apprendre : ${topMissing}`
          : `Construis les bases du domaine progressivement.`;
    }

    return { explanation, why, improve };
  }

  /* =========================
     🚀 CAREER SIGNAL ENGINE (NEW)
  ========================= */
  static getCareerSignal(matchRate) {

    if (matchRate >= 80) return "READY_TO_APPLY";
    if (matchRate >= 60) return "NEAR_READY";
    if (matchRate >= 40) return "NEEDS_PREPARATION";

    return "EARLY_STAGE";
  }

  /* =========================
     🚨 EMPTY RESPONSE HANDLER
  ========================= */
  static emptyResponse(job) {

    return {
      jobTitle: job?.title || "Unknown",
      category: job?.category || "general",

      matchRate: 0,
      difficulty: "UNKNOWN",

      matchedSkills: [],
      missingSkills: job?.skills || [],

      explanation: "Aucune donnée suffisante pour analyser ce poste.",
      whyThisJobFitsYou: "Profil utilisateur incomplet.",
      howToImprove: "Ajoute tes compétences pour obtenir une analyse précise.",

      careerSignal: "INSUFFICIENT_DATA",

      score: job?.score || 0,
      timestamp: Date.now()
    };
  }
}

