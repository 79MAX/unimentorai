export class ContextBuilder {

  /* =========================
     🧠 BUILD CONTEXT FOR AI MENTOR
  ========================= */
  static build(user = {}, course = {}, history = []) {

    /* =========================
       📚 COURSE CONTEXT
    ========================= */
    const courseContext = {
      id: course?._id || null,
      title: course?.title || "Unknown Course",
      level: course?.level || "BEGINNER",
      progress: typeof course?.progress === "number" ? course.progress : 0
    };

    /* =========================
       👤 USER PERSONALIZATION
    ========================= */
    const personalization = {
      weakAreas: Array.isArray(user?.weakAreas) ? user.weakAreas : [],
      strongAreas: Array.isArray(user?.strongAreas) ? user.strongAreas : [],
      goals: Array.isArray(user?.goals) ? user.goals : [],
      level: user?.level || "BEGINNER"
    };

    /* =========================
       🧾 CLEAN HISTORY (AI OPTIMIZED)
    ========================= */
    const cleanHistory = (history || [])
      .slice(-10)
      .map((h) => ({
        role: h.role || "user",
        message: h.message || "",
        timestamp: h.timestamp || null
      }));

    /* =========================
       📦 FINAL CONTEXT PACKAGE
    ========================= */
    return {
      course: courseContext,

      user: {
        id: user?.id || null,
        level: personalization.level
      },

      personalization,

      history: cleanHistory,

      meta: {
        generatedAt: new Date().toISOString(),
        historySize: cleanHistory.length
      }
    };
  }
}
