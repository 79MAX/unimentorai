
// =========================
// 👤 LEARNER PROFILE ENGINE
// UNI MENTOR AI COGNITIVE TWIN BRAIN
// =========================

import { calculateMastery } from "./mastery.scoring.engine.js"
import { analyzeMistakes } from "./mistake.analyzer.js"

// =========================
// MAIN PROFILE BUILDER
// =========================

export const buildLearnerProfile = async ({
  user,
  history = [],
  analytics = {},
  session = {}
}) => {

  const profile = {
    userId: user.id,

    identity: {
      name: user.name || "Learner",
      language: user.language || "en",
      level: "beginner"
    },

    cognition: {
      speed: 0,
      accuracy: 0,
      consistency: 0,
      retention: 0,
      reasoningStrength: 0
    },

    behavior: {
      fatigueLevel: 0,
      engagement: 0,
      dropoutRisk: "low",
      learningStyle: "unknown",
      attentionSpan: 0
    },

    skills: {},

    insights: []
  }

  // =========================
  // 1. PERFORMANCE ANALYSIS
  // =========================

  const scores = history.map(h => h.score || 0)

  const avgScore =
    scores.length > 0
      ? scores.reduce((a, b) => a + b, 0) / scores.length
      : analytics.avgScore || 0

  profile.cognition.accuracy = avgScore

  // =========================
  // 2. SPEED ANALYSIS
  // =========================

  const avgTime = analytics.avgTimeSpent || 120

  profile.cognition.speed =
    avgTime < 60
      ? "fast"
      : avgTime < 180
      ? "medium"
      : "slow"

  // =========================
  // 3. CONSISTENCY MODEL
  // =========================

  const streak = session?.streak || analytics.streak || 0

  profile.cognition.consistency =
    streak > 5 ? "high" : streak > 2 ? "medium" : "low"

  // =========================
  // 4. RETENTION MODEL (memory strength)
  // =========================

  const mistakes = history.filter(h => h.score < 60).length

  profile.cognition.retention =
    mistakes < 2 ? "strong" : mistakes < 5 ? "medium" : "weak"

  // =========================
  // 5. BEHAVIOR MODELING
  // =========================

  const fatigue = analytics.fatigueLevel || 0

  profile.behavior.fatigueLevel = fatigue
  profile.behavior.engagement = streak

  profile.behavior.dropoutRisk =
    fatigue > 80 || avgScore < 40
      ? "high"
      : fatigue > 60
      ? "medium"
      : "low"

  // =========================
  // 6. LEARNING STYLE DETECTION
  // =========================

  if (analytics.visualPreference > 70) {
    profile.behavior.learningStyle = "visual"
  } else if (analytics.speedPreference > 70) {
    profile.behavior.learningStyle = "fast-paced"
  } else if (avgScore < 50) {
    profile.behavior.learningStyle = "guided-step-by-step"
  } else {
    profile.behavior.learningStyle = "structured"
  }

  // =========================
  // 7. SKILL MAPPING (DYNAMIC KNOWLEDGE GRAPH)
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
  // 8. REASONING POWER ESTIMATION
  // =========================

  profile.cognition.reasoningStrength =
    avgScore > 80 && profile.cognition.consistency === "high"
      ? "strong"
      : avgScore > 50
      ? "moderate"
      : "weak"

  // =========================
  // 9. ATTENTION SPAN MODEL
  // =========================

  profile.behavior.attentionSpan =
    avgTime < 60
      ? "short"
      : avgTime < 180
      ? "medium"
      : "long"

  // =========================
  // 10. GLOBAL LEVEL CLASSIFICATION
  // =========================

  if (avgScore >= 80) profile.identity.level = "advanced"
  else if (avgScore >= 50) profile.identity.level = "intermediate"
  else profile.identity.level = "beginner"

  // =========================
  // 11. INSIGHT ENGINE
  // =========================

  profile.insights = generateInsights(profile)

  // =========================
  // 12. RETURN COGNITIVE TWIN
  // =========================

  return profile
}

// =========================
// 🧠 INSIGHT GENERATOR
// =========================

function generateInsights(profile) {

  const insights = []

  if (profile.behavior.dropoutRisk === "high") {
    insights.push("High risk of disengagement — simplify learning path")
  }

  if (profile.behavior.learningStyle === "visual") {
    insights.push("User benefits from visual explanations")
  }

  if (profile.cognition.retention === "weak") {
    insights.push("Needs spaced repetition reinforcement")
  }

  if (profile.cognition.consistency === "low") {
    insights.push("Irregular learning behavior detected")
  }

  if (profile.cognition.reasoningStrength === "weak") {
    insights.push("User struggles with multi-step reasoning tasks")
  }

  return insights
}
