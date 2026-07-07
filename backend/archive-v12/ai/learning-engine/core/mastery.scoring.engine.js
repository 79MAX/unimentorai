
// =========================
// 🧠 MASTERY SCORING ENGINE
// UNI MENTOR AI CORE EVALUATION BRAIN
// =========================

export const calculateMastery = async ({
  user,
  lesson,
  answer,
  analytics = {},
  mistakeAnalysis = {}
}) => {

  // =========================
  // 1. BASE SIGNALS
  // =========================

  const correctnessScore = mistakeAnalysis.score || 0
  const avgScore = analytics.avgScore || 0
  const timeSpent = analytics.totalTimeSpent || 0
  const errorType = mistakeAnalysis.errorType

  // =========================
  // 2. INITIAL MASTERY SCORE
  // =========================

  let masteryLevel = 0

  masteryLevel += correctnessScore * 0.6
  masteryLevel += avgScore * 0.3

  // =========================
  // 3. TIME EFFICIENCY FACTOR
  // =========================

  if (timeSpent < 30) {
    masteryLevel += 10 // fast understanding
  }

  if (timeSpent > 300) {
    masteryLevel -= 10 // slow processing
  }

  // =========================
  // 4. ERROR PENALTY SYSTEM
  // =========================

  const errorPenalties = {
    concept_gap: -20,
    calculation_error: -10,
    incomplete_answer: -15,
    poor_reasoning: -25,
    language_error: -5
  }

  if (errorType && errorPenalties[errorType]) {
    masteryLevel += errorPenalties[errorType]
  }

  // =========================
  // 5. LEARNING CONSISTENCY BONUS
  // =========================

  if (analytics.streak >= 3) {
    masteryLevel += 10
  }

  if (analytics.fatigueLevel > 70) {
    masteryLevel -= 10
  }

  // =========================
  // 6. NORMALIZATION (0 - 100)
  // =========================

  masteryLevel = Math.max(0, Math.min(100, masteryLevel))

  // =========================
  // 7. MASTERY CLASSIFICATION
  // =========================

  let masteryState = ""

  if (masteryLevel >= 80) {
    masteryState = "expert"
  } else if (masteryLevel >= 60) {
    masteryState = "proficient"
  } else if (masteryLevel >= 40) {
    masteryState = "developing"
  } else {
    masteryState = "beginner"
  }

  // =========================
  // 8. LEARNING INSIGHTS ENGINE
  // =========================

  const insights = []

  if (masteryLevel < 40) {
    insights.push("Strong need for reinforcement")
  }

  if (errorType === "concept_gap") {
    insights.push("User lacks conceptual understanding")
  }

  if (correctnessScore > 85) {
    insights.push("High accuracy detected")
  }

  if (analytics.streak > 3) {
    insights.push("Good learning consistency")
  }

  // =========================
  // 9. RETURN MASTERY PROFILE
  // =========================

  return {
    masteryLevel,
    masteryState,
    confidence: correctnessScore,

    breakdown: {
      correctnessScore,
      avgScore,
      timeSpent,
      errorType
    },

    insights,

    learningSignal:
      masteryLevel > 80
        ? "strong_mastery"
        : masteryLevel > 50
        ? "moderate_mastery"
        : "weak_mastery"
  }
}
