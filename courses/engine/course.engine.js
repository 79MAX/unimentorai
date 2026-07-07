import { generateCourse } from "./course.generator.js";
import { scaleCourse } from "./course.scaler.js";
import { trackProgress } from "./course.progress.js";

/* =========================
   🤖 COURSE ENGINE CORE
   UniMentorAI - Learning Engine
========================= */

export class CourseEngine {

  /* =========================
     📚 CREATE COURSE
  ========================= */
  static async create({
    topic,
    level = "BEGINNER",
    language = "fr",
    scalingOptions = {}
  }) {

    /* =========================
       🚨 VALIDATION
    ========================= */
    if (!topic || typeof topic !== "string") {
      throw new Error("INVALID_COURSE_TOPIC");
    }

    /* =========================
       🤖 GENERATE COURSE
    ========================= */
    const generatedCourse = await generateCourse({
      topic: topic.trim(),
      level,
      language
    });

    /* =========================
       ⚡ SCALE COURSE
    ========================= */
    const optimizedCourse = scaleCourse(
      generatedCourse,
      scalingOptions
    );

    /* =========================
       📦 FINAL RESPONSE
    ========================= */
    return {
      success: true,

      course: optimizedCourse,

      metadata: {
        generated: true,
        scalable: true,
        aiReady: true,
        generatedAt: new Date().toISOString()
      }
    };
  }

  /* =========================
     📊 TRACK PROGRESS
  ========================= */
  static async progress({
    userId,
    courseId,
    lessonId,
    status
  }) {

    /* =========================
       🚨 VALIDATION
    ========================= */
    if (!userId || !courseId) {
      throw new Error("INVALID_PROGRESS_DATA");
    }

    /* =========================
       📈 UPDATE PROGRESS
    ========================= */
    return trackProgress({
      userId,
      courseId,
      lessonId,
      status
    });
  }
}
