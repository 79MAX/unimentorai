// ==============================
// 🧠 LEARNING ANALYTICS ENGINE V3
// UniMentorAI
// ==============================

const DEFAULT_METRICS = {
  totalSessions: 0,
  totalLessons: 0,
  totalQuestions: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  totalTimeSpent: 0,

  averageScore: 0,

  masteryTrend: [],

  engagementTrend: [],

  retentionTrend: [],

  difficultyTrend: [],

  fatigueTrend: [],

  learningVelocity: 0,

  completionRate: 0,

  consistencyScore: 0,

  lastUpdated: null
}

// =====================================
// MAIN ANALYTICS PROCESSOR
// =====================================

export async function processLearningAnalytics({
  analytics = DEFAULT_METRICS,
  event
}) {

  const updated = structuredClone(analytics)

  updated.lastUpdated = Date.now()

  processEvent(updated, event)

  calculateCoreMetrics(updated)

  calculateAdvancedMetrics(updated)

  calculatePredictions(updated)

  generateInsights(updated)

  return updated
}

// =====================================
// EVENT PROCESSOR
// =====================================

function processEvent(analytics, event) {

  switch (event.type) {

    case "SESSION_STARTED":
      analytics.totalSessions++
      break

    case "LESSON_COMPLETED":
      analytics.totalLessons++
      break

    case "QUESTION_ANSWERED":

      analytics.totalQuestions++

      if (event.correct) {
        analytics.correctAnswers++
      } else {
        analytics.wrongAnswers++
      }

      analytics.masteryTrend.push(
        event.score || 0
      )

      analytics.engagementTrend.push(
        event.engagement || 50
      )

      analytics.retentionTrend.push(
        event.retention || 50
      )

      analytics.difficultyTrend.push(
        event.difficulty || 50
      )

      analytics.fatigueTrend.push(
        event.fatigue || 0
      )

      break

    case "TIME_SPENT":

      analytics.totalTimeSpent +=
        event.seconds || 0

      break
  }
}

// =====================================
// CORE METRICS
// =====================================

function calculateCoreMetrics(analytics) {

  analytics.averageScore = calculateAverage(
    analytics.masteryTrend
  )

  analytics.accuracyRate =
    analytics.totalQuestions === 0
      ? 0
      : (
          analytics.correctAnswers /
          analytics.totalQuestions
        ) * 100
}

// =====================================
// ADVANCED METRICS
// =====================================

function calculateAdvancedMetrics(analytics) {

  analytics.learningVelocity =
    calculateLearningVelocity(
      analytics.masteryTrend
    )

  analytics.consistencyScore =
    calculateConsistency(
      analytics.masteryTrend
    )

  analytics.retentionScore =
    calculateAverage(
      analytics.retentionTrend
    )

  analytics.engagementScore =
    calculateAverage(
      analytics.engagementTrend
    )

  analytics.fatigueScore =
    calculateAverage(
      analytics.fatigueTrend
    )

  analytics.completionRate =
    calculateCompletionRate(
      analytics.totalLessons,
      analytics.totalSessions
    )
}

// =====================================
// PREDICTIONS
// =====================================

function calculatePredictions(analytics) {

  analytics.predictions = {

    riskOfDropout:
      predictDropoutRisk(analytics),

    burnoutRisk:
      predictBurnoutRisk(analytics),

    masteryForecast:
      predictMastery(analytics),

    completionForecast:
      predictCompletion(analytics)
  }
}

// =====================================
// INSIGHTS
// =====================================

function generateInsights(analytics) {

  const insights = []

  if (analytics.fatigueScore > 75) {
    insights.push(
      "High cognitive fatigue detected."
    )
  }

  if (analytics.learningVelocity > 20) {
    insights.push(
      "Rapid learning progression detected."
    )
  }

  if (analytics.consistencyScore < 40) {
    insights.push(
      "Learning consistency is unstable."
    )
  }

  if (analytics.engagementScore > 80) {
    insights.push(
      "Excellent learner engagement."
    )
  }

  analytics.insights = insights
}

// =====================================
// DROPOUT RISK
// =====================================

function predictDropoutRisk(analytics) {

  let risk = 0

  if (analytics.engagementScore < 40)
    risk += 30

  if (analytics.consistencyScore < 40)
    risk += 30

  if (analytics.fatigueScore > 70)
    risk += 20

  return Math.min(risk, 100)
}

// =====================================
// BURNOUT RISK
// =====================================

function predictBurnoutRisk(analytics) {

  return Math.min(
    analytics.fatigueScore +
    analytics.learningVelocity,
    100
  )
}

// =====================================
// MASTERY FORECAST
// =====================================

function predictMastery(analytics) {

  const trend =
    analytics.masteryTrend

  if (trend.length < 2) {
    return analytics.averageScore
  }

  const growth =
    trend[trend.length - 1] -
    trend[0]

  return Math.min(
    analytics.averageScore +
    growth,
    100
  )
}

// =====================================
// COMPLETION FORECAST
// =====================================

function predictCompletion(analytics) {

  return Math.min(
    analytics.completionRate +
    analytics.engagementScore * 0.2,
    100
  )
}

// =====================================
// LEARNING VELOCITY
// =====================================

function calculateLearningVelocity(
  trend = []
) {

  if (trend.length < 2) return 0

  return (
    trend[trend.length - 1] -
    trend[0]
  )
}

// =====================================
// CONSISTENCY
// =====================================

function calculateConsistency(
  trend = []
) {

  if (trend.length < 2)
    return 100

  const variance =
    calculateVariance(trend)

  return Math.max(
    0,
    100 - variance
  )
}

// =====================================
// COMPLETION RATE
// =====================================

function calculateCompletionRate(
  lessons,
  sessions
) {

  if (!sessions) return 0

  return (
    lessons /
    sessions
  ) * 100
}

// =====================================
// HELPERS
// =====================================

function calculateAverage(arr = []) {

  if (!arr.length) return 0

  return (
    arr.reduce((a, b) => a + b, 0)
    / arr.length
  )
}

function calculateVariance(arr = []) {

  if (!arr.length) return 0

  const avg =
    calculateAverage(arr)

  return calculateAverage(
    arr.map(v => (v - avg) ** 2)
  )
}
