
// =========================
// 💾 AI SESSION MEMORY ENGINE
// UNI MENTOR AI PERSISTENT BRAIN
// =========================

const sessions = new Map()

// =========================
// 1. INIT SESSION
// =========================

export const initSession = (userId) => {
  if (!sessions.has(userId)) {
    sessions.set(userId, {
      userId,

      history: [],

      analytics: {
        streak: 0,
        fatigueLevel: 0,
        totalTimeSpent: 0,
        lastActive: Date.now()
      },

      context: {
        currentLesson: null,
        currentCourse: null,
        difficulty: "medium"
      }
    })
  }

  return sessions.get(userId)
}

// =========================
// 2. GET SESSION
// =========================

export const getSession = (userId) => {
  return sessions.get(userId) || initSession(userId)
}

// =========================
// 3. UPDATE SESSION MEMORY
// =========================

export const updateSession = (userId, data = {}) => {
  const session = getSession(userId)

  session.history = [
    ...(session.history || []),
    ...(data.history || [])
  ]

  // =========================
  // UPDATE ANALYTICS
  // =========================

  if (data.score !== undefined) {
    if (data.score > 70) {
      session.analytics.streak += 1
    } else {
      session.analytics.streak = 0
    }
  }

  if (data.timeSpent) {
    session.analytics.totalTimeSpent += data.timeSpent
  }

  // fatigue logic
  if (data.timeSpent > 600) {
    session.analytics.fatigueLevel += 10
  } else {
    session.analytics.fatigueLevel -= 5
  }

  // clamp fatigue (0–100)
  session.analytics.fatigueLevel = Math.max(
    0,
    Math.min(100, session.analytics.fatigueLevel)
  )

  session.analytics.lastActive = Date.now()

  // =========================
  // UPDATE CONTEXT
  // =========================

  if (data.currentLesson) {
    session.context.currentLesson = data.currentLesson
  }

  if (data.difficulty) {
    session.context.difficulty = data.difficulty
  }

  return session
}

// =========================
// 4. CLEAR SESSION (RESET)
// =========================

export const clearSession = (userId) => {
  sessions.delete(userId)
}

// =========================
// 5. SESSION INSIGHTS ENGINE
// =========================

export const getSessionInsights = (userId) => {
  const session = getSession(userId)

  const avgPerformance =
    session.history.length > 0
      ? session.history.reduce((a, b) => a + (b.score || 0), 0) /
        session.history.length
      : 0

  return {
    streak: session.analytics.streak,
    fatigueLevel: session.analytics.fatigueLevel,
    totalTimeSpent: session.analytics.totalTimeSpent,
    avgPerformance,

    status:
      avgPerformance > 80
        ? "excellent"
        : avgPerformance > 50
        ? "good"
        : "needs_improvement",

    recommendation:
      session.analytics.fatigueLevel > 70
        ? "Take a break"
        : avgPerformance < 50
        ? "Review fundamentals"
        : "Continue learning"
  }
}
