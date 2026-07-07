export class JobsProfileEngine {

  /* =========================
     🚀 MAIN PROFILE BUILDER
  ========================= */
  static buildProfile(user = {}) {

    const skills = Array.isArray(user.skills)
      ? user.skills
      : [];

    const skillCount = skills.length;

    /* =========================
       🧠 CORE INTELLIGENCE
    ========================= */
    const seniority =
      this.detectSeniority(skillCount);

    const specialization =
      this.detectSpecialization(skills);

    const profileStrength =
      this.computeStrength(skillCount, specialization);

    const jobReadinessScore =
      this.computeJobReadiness(
        skillCount,
        seniority,
        specialization
      );

    const profileVectorStrength =
      this.computeVectorStrength(skillCount, profileStrength);

    return {
      /* =========================
         📊 CORE METRICS
      ========================= */
      skillCount,
      seniority,
      specialization,

      /* =========================
         🧠 AI SCORES
      ========================= */
      profileStrength,
      jobReadinessScore,
      profileVectorStrength,

      /* =========================
         📈 INSIGHTS
      ========================= */
      isJobReady: jobReadinessScore >= 60,
      isSenior: seniority === "EXPERT"
    };
  }

  /* =========================
     👨‍💼 SENIORITY ENGINE
  ========================= */
  static detectSeniority(skillCount = 0) {

    if (skillCount > 12) return "EXPERT";
    if (skillCount > 6) return "INTERMEDIATE";
    if (skillCount > 2) return "BEGINNER";

    return "JUNIOR";
  }

  /* =========================
     🎯 SPECIALIZATION ENGINE
  ========================= */
  static detectSpecialization(skills = []) {

    if (!skills.length) return "UNDEFINED";

    const normalized = skills.map(s =>
      String(s).toLowerCase()
    );

    const tech = [
      "js", "javascript", "react", "node",
      "python", "java", "typescript", "backend"
    ];

    const business = [
      "marketing", "sales", "seo",
      "growth", "branding", "management"
    ];

    let techScore = 0;
    let businessScore = 0;

    for (const skill of normalized) {

      if (tech.some(k => skill.includes(k))) {
        techScore++;
      }

      if (business.some(k => skill.includes(k))) {
        businessScore++;
      }
    }

    if (techScore > businessScore) return "TECH";
    if (businessScore > techScore) return "BUSINESS";

    return "GENERALIST";
  }

  /* =========================
     📈 PROFILE STRENGTH ENGINE
  ========================= */
  static computeStrength(skillCount = 0, specialization = "") {

    let score = skillCount * 6;

    const bonuses = {
      TECH: 15,
      BUSINESS: 10,
      GENERALIST: 8
    };

    score += bonuses[specialization] || 0;

    return Math.min(100, Math.round(score));
  }

  /* =========================
     🚀 JOB READINESS ENGINE
  ========================= */
  static computeJobReadiness(skillCount = 0, seniority = "", specialization = "") {

    let score = 40;

    // 📊 skills impact
    score += skillCount * 3;

    // 👨‍💼 seniority boost
    const seniorityBoost = {
      EXPERT: 25,
      INTERMEDIATE: 15,
      BEGINNER: 5,
      JUNIOR: 0
    };

    score += seniorityBoost[seniority] || 0;

    // 🎯 specialization bonus
    if (specialization !== "UNDEFINED") {
      score += 10;
    }

    return Math.min(100, Math.round(score));
  }

  /* =========================
     🧠 VECTOR STRENGTH ENGINE
  ========================= */
  static computeVectorStrength(skillCount = 0, profileStrength = 0) {

    return Math.min(
      100,
      skillCount * 10 + profileStrength * 0.5
    );
  }
}

