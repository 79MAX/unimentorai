import { CourseEngine } from "./course.engine.js";

/* =========================
   🧠 COURSE ORCHESTRATOR
   UniMentorAI - Central Learning Brain
========================= */

export class CourseOrchestrator {

  /* =========================
     🚀 LAUNCH LEARNING FLOW
  ========================= */
  static async launch({
    user,
    topic,
    scalingOptions = {}
  }) {

    /* =========================
       🚨 VALIDATION LAYER
    ========================= */
    if (!user?.id) {
      throw new Error("INVALID_USER");
    }

    if (!topic || typeof topic !== "string") {
      throw new Error("INVALID_TOPIC");
    }

    /* =========================
       🧠 USER LEARNING PROFILE
    ========================= */
    const learningProfile = {
      level: user.level || "BEGINNER",
      language: user.language || "fr",
      learningStyle: user.learningStyle || "STANDARD"
    };

    /* =========================
       📚 GENERATE COURSE
    ========================= */
    const generated = await CourseEngine.create({
      topic: topic.trim(),
      level: learningProfile.level,
      language: learningProfile.language,
      scalingOptions
    });

    /* =========================
       📊 ORCHESTRATION METADATA
    ========================= */
    const orchestration = {
      orchestrated: true,
      aiReady: true,
      launchedAt: new Date().toISOString()
    };

    /* =========================
       📦 FINAL RESPONSE
    ========================= */
    return {
      success: true,

      user: {
        id: user.id,
        level: learningProfile.level,
        language: learningProfile.language
      },

      course: generated.course,

      orchestration
    };
  }
}
