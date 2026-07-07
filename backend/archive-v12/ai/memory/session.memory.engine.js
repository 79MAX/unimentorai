
// =========================
// 🧠 SESSION MEMORY ENGINE V3
// UNI MENTOR AI WORKING MEMORY + LEARNING CONTEXT BRAIN
// =========================

const sessionStore = new Map()

// =========================
// GET OR CREATE SESSION
// =========================

export const getSession = (userId) => {

  if (!sessionStore.has(userId)) {
    sessionStore.set(userId, createSession(userId))
  }

  return sessionStore.get(userId)
}

// =========================
// UPDATE SESSION (CORE MEMORY LOOP)
// =========================

export const updateSession = (userId, payload = {}) => {

  const session = getSession(userId)

  // =========================
  // 1. HISTORY MEMORY (LIMITED WORKING MEMORY)
  // =========================

  if (payload.history) {
    session.memory.history = mergeHistory(
      session.memory.history,
      payload.history
    )
  }

  // =========================
  // 2. REAL-TIME CONTEXT UPDATE
  // =========================

  session.context = {
    ...session.context,
    ...payload.context
  }

  // =========================
  // 3. ANALYTICS UPDATE
  // =========================

  session.analytics = mergeAnalytics(
    session.analytics,
    payload.analytics
  )

  // =========================
  // 4. COGNITIVE STATE UPDATE
  // =========================

  session.cognitive = updateCognitiveState(
    session.cognitive,
    payload
  )

  // =========================
  // 5. MEMORY COMPRESSION (VERY IMPORTANT)
  // =========================

  session.memory.summary = generateMemorySummary(session)

  session.updatedAt = Date.now()

  sessionStore.set(userId, session)

  return session
}

// =========================
// SESSION CREATION
// =========================

function createSession(userId) {

  return {
    userId,

    // 🧠 WORKING MEMORY (short-term)
    memory: {
      history: [],
      summary: [],
      compressedInsights: []
    },

    // 📊 REAL-TIME CONTEXT
    context: {
      currentLesson: null,
      currentTopic: null,
      lastQuestion: null,
      lastAnswer: null
    },

    // 📈 ANALYTICS LAYER
    analytics: {
      avgScore: 0,
      streak: 0,
      fatigueLevel: 0,
      timeSpent: 0,
      lastActive: Date.now()
    },

    // 🧠 COGNITIVE STATE ENGINE
    cognitive: {
      masteryTrend: [],
      confusionTrend: [],
      engagementTrend: [],
      difficultyTrend: [],
      stabilityIndex: 50
    },

    // ⚠️ BEHAVIOR FLAGS
    flags: {
      isConfused: false,
      isStuck: false,
      needsReview: false,
      isInFlow: false
    },

    createdAt: Date.now(),
    updatedAt: Date.now()
  }
}

// =========================
// HISTORY MERGING (MEMORY WINDOW CONTROL)
// =========================

function mergeHistory(existing = [], incoming = []) {

  const merged = [...existing, ...incoming]

  // keep last 50 interactions (working memory limit)
  return merged.slice(-50)
}

// =========================
// ANALYTICS MERGING
// =========================

function mergeAnalytics(oldA = {}, newA = {}) {

  return {
    avgScore:
      (oldA.avgScore + newA.avgScore) / 2 || newA.avgScore || oldA.avgScore || 0,

    streak:
      Math.max(oldA.streak || 0, newA.streak || 0),

    fatigueLevel:
      clamp((oldA.fatigueLevel || 0) + (newA.fatigueLevel || 0), 0, 100),

    timeSpent:
      (oldA.timeSpent || 0) + (newA.timeSpent || 0),

    lastActive: Date.now()
  }
}

// =========================
// 🧠 COGNITIVE STATE UPDATE ENGINE
// =========================

function updateCognitiveState(cognitive = {}, payload = {}) {

  const history = payload.history?.[0]

  if (!history) return cognitive

  const mastery = history.score || 0
  const error = history.errorType || null

  return {
    masteryTrend: pushLimited(cognitive.masteryTrend, mastery),
    confusionTrend: pushLimited(
      cognitive.confusionTrend,
      error ? 1 : 0
    ),
    engagementTrend: pushLimited(
      cognitive.engagementTrend,
      payload.analytics?.timeSpent || 0
    ),
    difficultyTrend: pushLimited(
      cognitive.difficultyTrend,
      payload.analytics?.difficulty || 50
    ),

    stabilityIndex: computeStabilityIndex(cognitive)
  }
}

// =========================
// 🧠 MEMORY SUMMARY ENGINE (COMPRESSION LAYER)
// =========================

function generateMemorySummary(session) {

  const { history, summary } = session.memory

  const recent = history.slice(-10)

  const concepts = [...new Set(recent.map(h => h.topic))]

  const avgScore =
    recent.reduce((acc, h) => acc + (h.score || 0), 0) /
    (recent.length || 1)

  const confusionCount =
    recent.filter(h => h.errorType).length

  return [
    ...summary.slice(-20),
    {
      timestamp: Date.now(),
      concepts,
      avgScore,
      confusionCount
    }
  ]
}

// =========================
// 🧠 STABILITY INDEX ENGINE
// =========================

function computeStabilityIndex(cognitive) {

  const trend = cognitive.masteryTrend || []

  if (trend.length < 3) return 50

  const variance =
    Math.abs(trend[trend.length - 1] - trend[0])

  return Math.max(0, 100 - variance)
}

// =========================
// 🧰 UTILITIES
// =========================

function pushLimited(arr = [], value, limit = 20) {
  const updated = [...arr, value]
  return updated.slice(-limit)
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val))
}

// =========================
// 📊 SESSION INSIGHTS API
// =========================

export const getSessionInsights = (userId) => {

  const session = getSession(userId)

  return {
    isActive:
      Date.now() - session.analytics.lastActive < 1000 * 60 * 10,

    masteryTrend: session.cognitive.masteryTrend,

    confusionLevel:
      session.cognitive.confusionTrend.slice(-5),

    engagementLevel:
      session.analytics.streak > 5 ? "high" : "medium",

    learningState:
      session.flags.isInFlow
        ? "flow"
        : session.analytics.fatigueLevel > 70
        ? "recovery"
        : "normal"
  }
}
