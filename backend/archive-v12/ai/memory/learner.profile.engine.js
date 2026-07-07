
// =========================
// 🧠 LEARNER PROFILE ENGINE V3
// UNI MENTOR AI COGNITIVE IDENTITY SYSTEM
// =========================

export const buildLearnerProfile = async ({
  user,
  history = [],
  analytics = {},
  session = {}
}) => {

  // =========================
  // 1. BASE IDENTITY LAYER
  // =========================

  const identity = {
    userId: user.id,
    name: user.name || "learner",
    level: detectLevel(history, analytics),
    language: user.language || "en",
    timezone: user.timezone || "UTC"
  }

  // =========================
  // 2. COGNITIVE PROFILE ENGINE
  // =========================

  const cognition = {
    accuracy: computeAccuracy(history),
    reasoningStrength: computeReasoning(history),
    memoryRetention: computeRetention(history),
    speedOfLearning: computeSpeed(history, analytics),
    errorPattern: detectErrorPattern(history)
  }

  // =========================
  // 3. BEHAVIORAL PROFILE ENGINE
  // =========================

  const behavior = {
    learningStyle: detectLearningStyle(history),
    engagementLevel: computeEngagement(session),
    fatigueLevel: analytics.fatigueLevel || 0,
    consistency: computeConsistency(history),
    sessionDepth: session.memory?.history?.length || 0
  }

  // =========================
  // 4. PSYCHOLOGICAL LEARNING STATE
  // =========================

  const psychology = {
    confidence: computeConfidence(history),
    frustrationLevel: computeFrustration(history, analytics),
    motivationLevel: computeMotivation(history, session),
    stressLevel: analytics.fatigueLevel || 0
  }

  // =========================
  // 5. LEARNING SEGMENTATION ENGINE
  // =========================

  const segment = classifyLearner({
    cognition,
    behavior,
    psychology
  })

  // =========================
  // 6. ADAPTIVE CAPABILITY SCORE
  // =========================

  const adaptability = computeAdaptability({
    cognition,
    behavior,
    psychology
  })

  // =========================
  // 7. PROFILE EVOLUTION TRACKING
  // =========================

  const evolution = {
    trend: extractTrend(history),
    improvementRate: computeImprovement(history),
    stability: computeStability(history),
    recentChange: detectRecentChange(history)
  }

  // =========================
  // 8. FINAL LEARNER PROFILE
  // =========================

  return {
    identity,

    cognition,

    behavior,

    psychology,

    segment,

    adaptability,

    evolution,

    signals: {
      isStruggling: cognition.accuracy < 40,
      isAdvanced: cognition.accuracy > 80,
      isInFlow: behavior.engagementLevel > 75,
      needsSupport: psychology.frustrationLevel > 60,
      readyForChallenge: cognition.accuracy > 75
    }
  }
}

// =========================
// 🧠 ACCURACY ENGINE
// =========================

function computeAccuracy(history = []) {

  if (history.length === 0) return 50

  const correct = history.filter(h => h.score > 70).length

  return (correct / history.length) * 100
}

// =========================
// 🧠 REASONING ENGINE
// =========================

function computeReasoning(history = []) {

  const reasoningScores = history.map(h => {

    if (h.errorType === "reasoning_error") return 30
    if (h.errorType === "concept_gap") return 20
    return 70
  })

  return avg(reasoningScores)
}

// =========================
// 🧠 MEMORY RETENTION ENGINE
// =========================

function computeRetention(history = []) {

  const recent = history.slice(-10)

  const retention =
    recent.filter(h => h.score > 60).length /
    (recent.length || 1)

  return retention * 100
}

// =========================
// ⚡ SPEED OF LEARNING
// =========================

function computeSpeed(history = [], analytics = {}) {

  const avgTime = analytics.timeSpent || 60

  if (avgTime < 45) return 90
  if (avgTime < 90) return 70
  if (avgTime < 150) return 50

  return 30
}

// =========================
// 🔍 ERROR PATTERN DETECTOR
// =========================

function detectErrorPattern(history = []) {

  const errors = history.map(h => h.errorType).filter(Boolean)

  const freq = countFrequency(errors)

  return Object.keys(freq).sort((a, b) => freq[b] - freq[a])[0] || null
}

// =========================
// 🎯 LEARNING STYLE DETECTION
// =========================

function detectLearningStyle(history = []) {

  const fastAnswers = history.filter(h => h.timeSpent < 40).length
  const slowAnswers = history.filter(h => h.timeSpent > 90).length

  if (fastAnswers > slowAnswers) return "fast-paced"
  if (slowAnswers > fastAnswers) return "guided-step-by-step"

  return "balanced"
}

// =========================
// 📊 ENGAGEMENT ENGINE
// =========================

function computeEngagement(session = {}) {

  const streak = session.analytics?.streak || 0

  return Math.min(100, streak * 10)
}

// =========================
// 🔥 CONFIDENCE ENGINE
// =========================

function computeConfidence(history = []) {

  const avgScore = avg(history.map(h => h.score || 0))

  return avgScore
}

// =========================
// 😤 FRUSTRATION ENGINE
// =========================

function computeFrustration(history = [], analytics = {}) {

  const failed = history.filter(h => h.score < 50).length

  const fatigue = analytics.fatigueLevel || 0

  return Math.min(100, failed * 10 + fatigue)
}

// =========================
// 🚀 MOTIVATION ENGINE
// =========================

function computeMotivation(history = [], session = {}) {

  const streak = session.analytics?.streak || 0

  return Math.min(100, streak * 8)
}

// =========================
// 🧠 LEARNER CLASSIFICATION ENGINE
// =========================

function classifyLearner({ cognition, behavior, psychology }) {

  if (cognition.accuracy > 80 && behavior.engagementLevel > 70) {
    return "advanced_learner"
  }

  if (psychology.frustrationLevel > 60) {
    return "struggling_learner"
  }

  if (behavior.learningStyle === "fast-paced") {
    return "rapid_learner"
  }

  return "standard_learner"
}

// =========================
// ⚡ ADAPTABILITY ENGINE
// =========================

function computeAdaptability({ cognition, behavior, psychology }) {

  return (
    cognition.accuracy * 0.4 +
    behavior.consistency * 0.3 +
    (100 - psychology.frustrationLevel) * 0.3
  )
}

// =========================
// 📈 TREND ENGINE
// =========================

function extractTrend(history = []) {

  return history.slice(-10).map(h => h.score || 0)
}

function computeImprovement(history = []) {

  if (history.length < 2) return 0

  return (history.at(-1).score || 0) - (history[0].score || 0)
}

function computeStability(history = []) {

  const scores = history.map(h => h.score || 0)

  return 100 - variance(scores)
}

function detectRecentChange(history = []) {

  if (history.length < 2) return "stable"

  const diff =
    (history.at(-1).score || 0) -
    (history.at(-2).score || 0)

  if (diff > 20) return "rapid_improvement"
  if (diff < -20) return "decline"

  return "stable"
}

// =========================
// 🧮 UTILITIES
// =========================

function avg(arr = []) {
  return arr.reduce((a, b) => a + b, 0) / (arr.length || 1)
}

function variance(arr = []) {
  const mean = avg(arr)
  return avg(arr.map(x => (x - mean) ** 2))
}

function countFrequency(arr = []) {
  return arr.reduce((acc, v) => {
    acc[v] = (acc[v] || 0) + 1
    return acc
  }, {})
}
