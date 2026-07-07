export class EducationCore {

  /* =========================
     🧠 SAFE UTIL
  ========================= */
  static ensureArray(data) {
    return Array.isArray(data) ? data : [];
  }

  /* =========================
     📚 COURSE ENGINE (SCALABLE)
  ========================= */
  static generateCourses(level = "beginner") {

    const courseMap = {
      beginner: [
        { id: "c1", title: "Introduction carrière" },
        { id: "c2", title: "CV efficace" },
        { id: "c3", title: "Recherche d'emploi" }
      ],

      intermediate: [
        { id: "c4", title: "LinkedIn optimisation" },
        { id: "c5", title: "Interview mastery" },
        { id: "c6", title: "Career strategy avancée" }
      ],

      advanced: [
        { id: "c7", title: "Leadership" },
        { id: "c8", title: "Negotiation" },
        { id: "c9", title: "Expert positioning" }
      ]
    };

    return courseMap[level] || courseMap.beginner;
  }

  /* =========================
     🧠 QUIZ ENGINE (IMPROVED)
  ========================= */
  static generateQuiz(topic = "cv") {

    const quizBank = {
      cv: [
        {
          id: "q1",
          question: "Que doit contenir un bon CV ?",
          options: ["Expérience uniquement", "Résultats + compétences", "Photo professionnelle"],
          answer: 1
        }
      ],

      interview: [
        {
          id: "q2",
          question: "La méthode STAR sert à ?",
          options: ["Structurer une réponse", "Coder", "Designer CV"],
          answer: 0
        }
      ]
    };

    return quizBank[topic] || quizBank.cv;
  }

  /* =========================
     📊 PROGRESS TRACKING ENGINE (REALISTIC)
  ========================= */
  static trackProgress(userProgress = [], totalCourses = 10) {

    const completed = this.ensureArray(userProgress).length;

    const percent = totalCourses > 0
      ? Math.round((completed / totalCourses) * 100)
      : 0;

    return {
      completed,
      totalCourses,
      progress: `${percent}%`,
      percentage: percent,
      status: percent >= 100 ? "CERTIFIED" : "IN_PROGRESS",
      level:
        percent >= 80 ? "ADVANCED" :
        percent >= 50 ? "INTERMEDIATE" : "BEGINNER"
    };
  }

  /* =========================
     🎓 CERTIFICATE SYSTEM (PRO)
  ========================= */
  static generateCertificate(user = {}, course = "UniMentorAI Program") {

    const id = `CERT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    return {
      certificateId: id,
      name: user.name || "Student",
      email: user.email || null,
      course,
      level: user.level || "beginner",
      issuedAt: new Date().toISOString(),
      verified: true,
      issuer: "UniMentorAI",
      country: user.country || "Global"
    };
  }
}
