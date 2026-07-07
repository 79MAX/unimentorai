
// =========================
// 🧠 MASTERY SCORING ENGINE
// UNI MENTOR AI COGNITIVE PROFICIENCY BRAIN
// =========================

export const calculateMastery = async ({
  user,
  lesson,
  answer,
  analytics = {},
  mistakeAnalysis = {}
}) => {

  const topic = lesson.topic || "general"

  const correctness = mistakeAnalysis.score || 0
  const errorType = mistakeAnalysis.errorType

  const avgScore = analytics.avgScore || correctness
  const timeSpent = analytics.timeSpent || 0
  const streak = analytics.streak || 0
  const fatigue = analytics.fatigueLevel || 0

  // =========================
  // 1. BASE MASTERY INITIALIZATION
  // =========================

  let masteryLevel = 0

  masteryLevel += correctness * 0.5
  masteryLevel += avgScore * 0.3

  // =========================
  // 2. COGNITIVE SPEED FACTOR
  // =========================

  const speedFactor =
    timeSpent < 45
      ? 10
      : timeSpent < 120
      ? 5
      : -10

  masteryLevel += speedFactor

  // =========================
  // 3. ERROR PENALTY SYSTEM
  // =========================

  const penalties = {
    concept_gap: -25,
    reasoning_error: -15,
    calculation_error: -10,
    partial_understanding: -8
  }

  if (errorType && penalties[errorType]) {
    masteryLevel += penalties[errorType]
  }

  // =========================
  // 4. LEARNING CONSISTENCY BONUS
  // =========================

  if (streak >= 3) {
    masteryLevel += 12
  }

  if (streak >= 7) {
    masteryLevel += 5 // bonus mastery reinforcement
  }

  // =========================
  // 5. FATIGUE IMPACT MODEL
  // =========================

  if (fatigue > 80) {
    masteryLevel -= 20
  } else if (fatigue > 60) {
    masteryLevel -= 10
  }

  // =========================
  // 6. TEMPORAL LEARNING DECAY MODEL
  // =========================

  const lastActive = analytics.lastActive || Date.now()

  const daysInactive =
    (Date.now() - lastActive) / (1000 * 60 * 60 * 24)

  if (daysInactive > 7) {
    masteryLevel -= 10
  }

  if (daysInactive > 14) {
    masteryLevel -= 20
  }

  // =========================
  // 7. NORMALIZATION (0 - 100)
  // =========================

  masteryLevel = Math.max(0, Math.min(100, masteryLevel))

  // =========================
  // 8. MASTERY CLASSIFICATION
  // =========================

  let masteryState = ""

  if (masteryLevel >= 85) {
    masteryState = "expert"
  } else if (masteryLevel >= 65) {
    masteryState = "proficient"
  } else if (masteryLevel >= 40) {
    masteryState = "developing"
  } else {
    masteryState = "beginner"
  }

  // =========================
  // 9. COGNITIVE PROFILE SIGNALS
  // =========================

  const cognitiveProfile = {
    deepUnderstanding:
      correctness > 80 && errorType === null,

    fragileKnowledge:
      correctness < 50,

    fastLearner:
      timeSpent < 60 && correctness > 70,

    struggling:
      correctness < 40 && fatigue > 60
  }

  // =========================
  // 10. SKILL CONFIDENCE INDEX
  // =========================

  const confidenceIndex =
    (correctness * 0.6) +
    (avgScore * 0.3) +
    (streak * 2)

  // =========================
  // 11. FINAL RETURN OBJECT
  // =========================

  return {
    topic,

    masteryLevel,
    masteryState,

    confidence: Math.min(100, confidenceIndex),

    cognitiveProfile,

    breakdown: {
      correctness,
      avgScore,
      timeSpent,
      streak,
      fatigue,
      errorType
    },

    learningSignals: {
      strongMastery: masteryLevel > 85,
      needsPractice: masteryLevel < 50,
      unstableKnowledge: fatigue > 70
    }
  }
}
