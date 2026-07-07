/* =========================
   🎓 COURSE CORE MODEL
   UniMentorAI - Learning Engine Base Schema
========================= */

export class CourseModel {

  /* =========================
     🧱 CREATE COURSE ENTITY
  ========================= */
  static create(course = {}) {

    const now = new Date();

    return {
      /* =========================
         🔐 IDENTIFIER (SAFE UNIQUE ID)
      ========================= */
      id: course.id || `COURSE-${now.getTime()}-${Math.floor(Math.random() * 10000)}`,

      /* =========================
         📚 CORE CONTENT
      ========================= */
      title: course.title?.trim() || "Untitled Course",
      description: course.description?.trim() || "No description provided",

      /* =========================
         🎯 CLASSIFICATION
      ========================= */
      level: course.level || "beginner",
      language: course.language || "en",
      category: course.category || "general",

      /* =========================
         🧠 AI ENRICHED METADATA
      ========================= */
      tags: course.tags || [],
      difficultyScore: course.difficultyScore || this._computeDifficulty(course.level),

      /* =========================
         📦 CONTENT STRUCTURE
      ========================= */
      modules: Array.isArray(course.modules) ? course.modules : [],

      /* =========================
         ⏱ COURSE DURATION
      ========================= */
      durationDays: course.durationDays || 30,
      estimatedHours: course.estimatedHours || null,

      /* =========================
         📊 LEARNING METRICS
      ========================= */
      enrollments: course.enrollments || 0,
      rating: course.rating || 0,
      completionRate: course.completionRate || 0,

      /* =========================
         💰 BUSINESS METADATA (FUTURE READY)
      ========================= */
      price: course.price || 0,
      currency: course.currency || "USD",
      isPremium: course.isPremium || false,

      /* =========================
         🤖 AI GENERATION INFO
      ========================= */
      generatedByAI: course.generatedByAI || false,
      aiModel: course.aiModel || null,

      /* =========================
         📅 TIMESTAMPS
      ========================= */
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };
  }

  /* =========================
     🧠 AI-BASED DIFFICULTY SCORING
  ========================= */
  static _computeDifficulty(level) {

    const map = {
      beginner: 1,
      intermediate: 2,
      advanced: 3,
      expert: 4
    };

    return map[level] || 1;
  }
}
