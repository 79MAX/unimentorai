/**
 * 📈 PROGRESS MODEL — UNIMENTORAI (PRODUCTION READY)
 */

export const ProgressModel = {

  collection: "progress",

  // 🚀 PROGRESS SCHEMA
  schema: (data = {}) => {

    const now = Date.now();

    return {

      // 🔗 RELATIONS
      userId:
        data.userId || null,

      courseId:
        data.courseId || null,

      organizationId:
        data.organizationId || null,

      // 📚 LESSON TRACKING
      completedLessons:
        Array.isArray(data.completedLessons)
          ? data.completedLessons
          : [],

      lastLesson:
        data.lastLesson || null,

      currentLesson:
        data.currentLesson || null,

      // 📊 PROGRESS
      progressPercent:
        validateProgress(data.progressPercent),

      completionStatus:
        data.completionStatus || "IN_PROGRESS",
      // IN_PROGRESS | COMPLETED | DROPPED

      // 🧪 QUIZ SYSTEM
      quizzes: {
        attempted:
          data.quizzes?.attempted || 0,

        passed:
          data.quizzes?.passed || 0,

        averageScore:
          data.quizzes?.averageScore || 0
      },

      // 🧠 AI LEARNING ANALYTICS
      learningStats: {
        totalTimeSpent:
          data.learningStats?.totalTimeSpent || 0,

        aiHelpRequests:
          data.learningStats?.aiHelpRequests || 0,

        streakDays:
          data.learningStats?.streakDays || 0
      },

      // 🌍 AFRICA OFFLINE ENGINE
      offlineSyncPending:
        data.offlineSyncPending || false,

      lastOfflineUpdate:
        data.lastOfflineUpdate || null,

      // 🏆 CERTIFICATION
      certification: {
        eligible:
          data.certification?.eligible || false,

        issued:
          data.certification?.issued || false,

        issuedAt:
          data.certification?.issuedAt || null
      },

      // ⚠️ ENGAGEMENT DETECTION
      engagement: {
        riskLevel:
          data.engagement?.riskLevel || "LOW",
        // LOW | MEDIUM | HIGH

        lastActivity:
          data.engagement?.lastActivity || now
      },

      // 🕒 TIMESTAMPS
      startedAt:
        data.startedAt || now,

      updatedAt: now,

      completedAt:
        data.completedAt || null
    };
  }
};

---

# 🔐 HELPERS

function validateProgress(value) {

  const progress = Number(value);

  if (isNaN(progress)) return 0;

  if (progress < 0) return 0;

  if (progress > 100) return 100;

  return progress;
}

