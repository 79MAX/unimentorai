/* =========================
   🧠 COURSE DEMAND ENGINE
   UniMentorAI - AI Auto Course Generator
========================= */

import { getEnrollmentCount } from "../enrollment/enrollment.tracker.js";
import { generateCourse } from "../generator/course.generator.js";

/* =========================
   🔐 MEMORY CACHE (ANTI MULTI-GENERATION)
========================= */
const generationCache = new Map();

/* =========================
   🚀 CHECK COURSE DEMAND
========================= */
export async function checkCourseDemand(courseId, topic) {

  if (!courseId || !topic) {
    throw new Error("INVALID_DEMAND_INPUT");
  }

  const count = getEnrollmentCount(courseId);

  /* =========================
     📦 CACHE KEY (PREVENT DUPLICATE GENERATION)
  ========================= */
  if (generationCache.get(courseId)) {

    return {
      status: "ALREADY_GENERATED",
      message: "Course already auto-generated",
      currentDemand: count
    };
  }

  /* =========================
     🔥 DYNAMIC THRESHOLD (SMART AI RULE)
  ========================= */
  const threshold = _getDynamicThreshold(count);

  if (count >= threshold) {

    console.log("[COURSE_AUTO_GENERATION_TRIGGERED]", {
      topic,
      count,
      threshold
    });

    /* =========================
       🧠 AI COURSE GENERATION
    ========================= */
    const newCourse = await generateCourse({
      topic,
      level: "auto",
      source: "AI_DEMAND_ENGINE",
      popularity: count
    });

    /* =========================
       🔐 MARK AS GENERATED
    ========================= */
    generationCache.set(courseId, {
      generatedAt: Date.now(),
      topic
    });

    return {
      status: "GENERATED",
      trigger: "DEMAND_ENGINE",
      course: newCourse,
      demand: count
    };
  }

  return {
    status: "WAITING",
    currentDemand: count,
    threshold,
    remaining: threshold - count
  };
}

/* =========================
   🧠 DYNAMIC THRESHOLD ENGINE
   (AI-READY SCALING LOGIC)
========================= */
function _getDynamicThreshold(currentDemand) {

  /* BASE RULE */
  let threshold = 5;

  /* SCALING RULES */
  if (currentDemand > 20) threshold = 10;
  if (currentDemand > 50) threshold = 20;

  return threshold;
}
