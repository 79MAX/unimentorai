
// =========================
// 🧠 SESSION MEMORY ENGINE
// UNI MENTOR AI WORKING MEMORY BRAIN
// =========================

const sessionStore = new Map()

// =========================
// GET SESSION
// =========================

export const getSession = (userId) => {

  if (!sessionStore.has(userId)) {
    sessionStore.set(userId, createEmptySession(userId))
  }

  return sessionStore.get(userId)
}

// =========================
// UPDATE SESSION
// =========================

export const updateSession = (userId, data = {}) => {

  const session = getSession(userId)

  session.history = mergeHistory(session.history, data.history)
  session.analytics = mergeAnalytics(session.analytics, data.analytics)
  session.lastUpdated = Date.now()

  sessionStore.set(userId, session)

  return session
}

// =========================
// CREATE SESSION
// =========================

function createEmptySession(userId) {

  return {
    userId,

    // 🧠 SHORT TERM MEMORY (recent actions)
    history: [],

    // 📊 REAL-TIME ANALYTICS
    analytics: {
      avgScore: 0,
      streak: 0,
      fatigueLevel: 0,
      timeSpent: 0,
      lastActive: Date.now()
    },

    // ⚡ CONTEXT WINDOW
    context: {
      currentLesson: null,
      currentTopic: null,
      lastQuestion: null,
      lastAnswer: null
    },

    // 🔁 BEHAVIOR TRACKING
    behavior: {
      sessionStart: Date.now(),
      actionsCount: 0,
      errorCount: 0
    },

    // 🧠 MEMORY FLAGS
    flags: {
      needsReview: false,
      isConfused: false,
      isStuck: false
    }
  }
}

// =========================
// HISTORY MERGING (SMART MEMORY)
// =========================

function mergeHistory(existing = [], incoming = []) {

  const combined = [...existing, ...(incoming || [])]

  // keep last 50 interactions only (working memory limit)
  return combined.slice(-50)
}

// =========================
// ANALYTICS MERGING
// =========================

function mergeAnalytics(oldAnalytics = {}, newAnalytics = {}) {

  return {
    avgScore:
      (oldAnalytics.avgScore || 0 + newAnalytics.avgScore || 0) / 2,

    streak:
      Math.max(oldAnalytics.streak || 0, newAnalytics.streak || 0),

    fatigueLevel:
      newAnalytics.fatigueLevel ?? oldAnalytics.fatigueLevel ?? 0,

    timeSpent:
      (oldAnalytics.timeSpent || 0) + (newAnalytics.timeSpent || 0),

    lastActive: Date.now()
  }
}

// =========================
// CONTEXT UPDATER (REAL-TIME AI FEED)
// =========================

export const updateContext = (userId, contextData = {}) => {

  const session = getSession(userId)

  session.context = {
    ...session.context,
    ...contextData
  }

  session.behavior.actionsCount += 1

  sessionStore.set(userId, session)

  return session.context
}

// =========================
// MEMORY INSIGHT ENGINE
// =========================

export const getSessionInsights = (userId) => {

  const session = getSession(userId)

  const { history, analytics } = session

  return {
    isActive: Date.now() - analytics.lastActive < 1000 * 60 * 10,

    engagementLevel:
      session.behavior.actionsCount > 10
        ? "high"
        : "low",

    confusionRisk:
      session.behavior.errorCount > 3
        ? "high"
        : "low",

    learningContinuity:
      history.length > 5 ? "stable" : "early_stage"
  }
}

// =========================
// SESSION RESET (OPTIONAL)
// =========================

export const resetSession = (userId) => {
  sessionStore.set(userId, createEmptySession(userId))
}
