
import { getSession } from "FIX_REQUIRED_PATH"
import { calculateMastery } from "FIX_REQUIRED_PATH"

// =========================
// 👤 LEARNER PROFILE ENGINE
// UNI MENTOR AI COGNITIVE MODEL BRAIN
// =========================

export const buildLearnerProfile = async ({
  user,
  course,
  analytics = {},
  history = []
}) => {

  // =========================
  // 1. LOAD SESSION MEMORY
  // =========================

  const session = getSession(user.id)

  // =========================
  // 2. BASE PROFILE STRUCTURE
  // =========================

  const profile = {
    userId: user.id,

    identity: {
      name: user.name || "Learner",
      language: user.language || "en",
      level: "unknown"
    },

    cognitive: {
      speed: 0,
      accuracy: 0,
      consistency: 0,
      retention: 0
    },

    behavior: {
      fatigueLevel: 0,
      engagementLevel: 0,
      dropOffRisk: "low",
      learningStyle: "unknown"
    },

    skills: {},

    insights: []
  }

  // =========================
  // 3. ANALYZE PERFORMANCE HISTORY
  // =========================

  const scores = history.map(h => h.score || 0)

  const avgScore =
    scores.length > 0
      ? scores.reduce((a, b) => a + b, 0) / scores.length
      : analytics.avgScore || 0

  // =========================
  // 4. COGNITIVE METRICS
  // =========================

  profile.cognitive.accuracy = avgScore

  profile.cognitive.speed =
    analytics.avgTimeSpent < 60
      ? "fast"
      : analytics.avgTimeSpent < 180
      ? "medium"
      : "slow"

  profile.cognitive.consistency =
    session?.analytics?.streak > 3 ? "high" : "low"

  profile.cognitive.retention =
    avgScore > 70 ? "strong" : "weak"

  // =========================
  // 5. BEHAVIORAL MODELING
  // =========================

  const fatigue = session?.analytics?.fatigueLevel || 0
  const streak = session?.analytics?.streak || 0

  profile.behavior.fatigueLevel = fatigue
  profile.behavior.engagementLevel = streak

  profile.behavior.dropOffRisk =
    fatigue > 80
      ? "high"
      : avgScore < 40
      ? "medium"
      : "low"

  // =========================
  // 6. LEARNING STYLE DETECTION
  // =========================

  if (analytics.visualPreference > 70) {
    profile.behavior.learningStyle = "visual"
  } else if (analytics.speedPreference > 70) {
    profile.behavior.learningStyle = "fast-paced"
  } else {
    profile.behavior.learningStyle = "structured"
  }

  // =========================
  // 7. SKILL PROFILING (MULTI-DOMAIN)
  // =========================

  for (let item of history) {
    const mastery = await calculateMastery({
      user,
      lesson: item.lesson,
      analytics
    })

    const topic = item.lesson?.topic || "general"

    profile.skills[topic] = {
      masteryLevel: mastery.masteryLevel,
      state: mastery.masteryState
    }
  }

  // =========================
  // 8. GLOBAL USER LEVEL
  // =========================

  if (avgScore >= 80) profile.identity.level = "advanced"
  else if (avgScore >= 50) profile.identity.level = "intermediate"
  else profile.identity.level = "beginner"

  // =========================
  // 9. AI INSIGHTS ENGINE
  // =========================

  profile.insights = generateInsights(profile)

  // =========================
  // 10. RETURN PROFILE
  // =========================

  return profile
}

// =========================
// 🧠 INSIGHT GENERATOR
// =========================

function generateInsights(profile) {

  const insights = []

  if (profile.behavior.fatigueLevel > 70) {
    insights.push("User shows cognitive fatigue")
  }

  if (profile.cognitive.accuracy > 80) {
    insights.push("High academic performance detected")
  }

  if (profile.behavior.learningStyle === "visual") {
    insights.push("User prefers visual learning content")
  }

  if (profile.behavior.dropOffRisk === "high") {
    insights.push("High risk of dropout — adapt difficulty immediately")
  }

  if (profile.cognitive.speed === "slow") {
    insights.push("User benefits from step-by-step explanations")
  }

  return insights
}
