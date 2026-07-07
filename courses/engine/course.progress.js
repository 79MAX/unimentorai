const progressDB = new Map();

/* =========================
   📊 PROGRESS TRACKING ENGINE
   UniMentorAI - Learning Analytics Core
========================= */

export function trackProgress({
  userId,
  courseId,
  lessonId,
  status = "IN_PROGRESS"
}) {

  /* =========================
     🔐 KEY GENERATION
  ========================= */
  const key = `${userId}:${courseId}`;

  /* =========================
     📦 FETCH EXISTING DATA
  ========================= */
  const existing = progressDB.get(key) || {
    userId,
    courseId,
    completedLessons: new Set(),
    status: "NOT_STARTED",
    progressPercent: 0
  };

  /* =========================
     📚 UPDATE LESSONS
  ========================= */
  existing.completedLessons.add(lessonId);

  /* =========================
     📊 PROGRESS CALCULATION
  ========================= */
  const totalLessons = 10; // (placeholder scalable logic)
  const completedCount = existing.completedLessons.size;

  const progressPercent = Math.min(
    Math.round((completedCount / totalLessons) * 100),
    100
  );

  /* =========================
     🔄 UPDATE STATE
  ========================= */
  const updated = {
    ...existing,
    status,
    progressPercent,
    updatedAt: new Date().toISOString(),
    completedLessons: Array.from(existing.completedLessons)
  };

  /* =========================
     💾 SAVE TO DB
  ========================= */
  progressDB.set(key, updated);

  /* =========================
     📤 RESPONSE
  ========================= */
  return {
    success: true,
    progress: updated
  };
}
