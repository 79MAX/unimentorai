import { getSession } from "../memory/session.memory.engine.js"

// =========================
// 📊 AI LEARNING ANALYTICS ENGINE
// UNI MENTOR AI CORE DATA BRAIN
// =========================

export const trackLearningEvent = async ({
  userId,
  lessonId,
  score,
  timeSpent,
  attempt,
  metadata = {}
}) => {

  const session = getSession(userId) || {}

  // =========================
  // 1. INIT ANALYTICS STRUCTURE
  // =========================

  if (!session.analytics) {
    session.analytics = {
      totalLessons: 0,
      totalScore: 0,
      avgScore: 0,
      totalTimeSpent: 0,
      errorPatterns: {},
      engagement: {
        streak: 0,
        fatigueLevel: 0,
        dropOffRisk: 0
      }
    }
  }

  const analytics = session.analytics

  // =========================
  // 2. UPDATE CORE METRICS
  // =========================

  analytics.totalLessons += 1
  analytics.totalScore += score
  analytics.totalTimeSpent += timeSpent
  analytics.avgScore =
    analytics.totalScore / analytics.totalLessons

  // =========================
  // 3. ERROR PATTERN DETECTION
  // =========================

  if (metadata.errorType) {
    analytics.errorPatterns[metadata.errorType] =
      (analytics.errorPatterns[metadata.errorType] || 0) + 1
  }

  // =========================
  // 4. ENGAGEMENT ENGINE
  // =========================

  // fatigue detection
  if (timeSpent > 600) {
    analytics.engagement.fatigueLevel += 10
  } else {
    analytics.engagement.fatigueLevel -= 5
  }

  // clamp fatigue
  analytics.engagement.fatigueLevel = Math.max(
    0,
    Math.min(100, analytics.engagement.fatigueLevel)
  )

  // streak logic
  if (score > 70) {
    analytics.engagement.streak += 1
  } else {
    analytics.engagement.streak = 0
  }

  // =========================
  // 5. DROP-OFF RISK ENGINE
  // =========================

  analytics.engagement.dropOffRisk =
    analytics.engagement.fatigueLevel > 70
      ? "HIGH"
      : analytics.avgScore < 50
      ? "MEDIUM"
      : "LOW"

  // =========================
  // 6. INSIGHTS GENERATION (AI LAYER)
  // =========================

  const insights = []

  if (analytics.avgScore > 80) {
    insights.push("High mastery level detected 🚀")
  }

  if (analytics.engagement.fatigueLevel > 70) {
    insights.push("User is fatigued — recommend break")
  }

  const topError = Object.entries(analytics.errorPatterns)
    .sort((a, b) => b[1] - a[1])[0]

  if (topError) {
    insights.push(`Most common error: ${topError[0]}`)
  }

  // =========================
  // 7. RETURN ANALYTICS SNAPSHOT
  // =========================

  return {
    userId,
    lessonId,
    snapshot: analytics,
    insights,
    status:
      analytics.avgScore > 80
        ? "advanced"
        : analytics.avgScore > 50
        ? "intermediate"
        : "beginner"
  }
}
