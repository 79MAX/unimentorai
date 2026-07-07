/* =========================
   📈 COURSE ENROLLMENT TRACKER
   UniMentorAI - Scalable Learning Engine
========================= */

/* =========================
   🧠 MEMORY STORE (IN-MEMORY MVP)
========================= */
const enrollmentDB = new Map();

/* =========================
   🚀 ENROLL USER IN COURSE
========================= */
export function enrollUser(courseId, userId) {

  if (!courseId || !userId) {
    throw new Error("INVALID_ENROLLMENT_DATA");
  }

  /* =========================
     📦 INIT COURSE SET
  ========================= */
  if (!enrollmentDB.has(courseId)) {
    enrollmentDB.set(courseId, new Set());
  }

  const users = enrollmentDB.get(courseId);

  /* =========================
     🔐 IDENTITY PROTECTION (NO DUPLICATE ENROLLMENT)
  ========================= */
  const beforeSize = users.size;

  users.add(userId);

  const afterSize = users.size;

  return {
    courseId,
    userId,
    enrolled: afterSize > beforeSize,
    total: afterSize
  };
}

/* =========================
   📊 GET ENROLLMENT COUNT
========================= */
export function getEnrollmentCount(courseId) {

  return enrollmentDB.get(courseId)?.size || 0;
}

/* =========================
   📚 GET COURSE ENROLLED USERS
========================= */
export function getCourseUsers(courseId) {

  return Array.from(enrollmentDB.get(courseId) || []);
}

/* =========================
   📈 GLOBAL ENROLLMENT STATS
========================= */
export function getEnrollmentStats() {

  let totalCourses = enrollmentDB.size;
  let totalUsers = 0;

  for (const users of enrollmentDB.values()) {
    totalUsers += users.size;
  }

  return {
    totalCourses,
    totalEnrollments: totalUsers,
    timestamp: new Date().toISOString()
  };
}

/* =========================
   🧹 REMOVE USER FROM COURSE
========================= */
export function unenrollUser(courseId, userId) {

  const users = enrollmentDB.get(courseId);

  if (!users) return false;

  const removed = users.delete(userId);

  return {
    courseId,
    userId,
    removed,
    total: users.size
  };
}

/* =========================
   🧠 COURSE POPULARITY SCORE (AI READY)
========================= */
export function getCoursePopularity(courseId) {

  const count = getEnrollmentCount(courseId);

  return {
    courseId,
    popularityScore: Math.min(count / 10, 1), // normalized 0–1
    totalEnrollments: count
  };
}
