
// =========================
// 🧠 MASTERY SCORING ENGINE V2
// UNI MENTOR AI COGNITIVE PROFICIENCY CORE
// =========================

export const calculateMastery = async ({
  user,
  lesson,
  answer,
  analytics = {},
  mistakeAnalysis = {}
}) => {

  const topic = lesson.topic || "general"

  const correctness = mistakeAnalysis.score ?? 0
  const errorType = mistakeAnalysis.errorType

  const historyScore = analytics.avgScore ?? correctness
  const streak = analytics.streak ?? 0
  const fatigue = analytics.fatigueLevel ?? 0
  const timeSpent = analytics.timeSpent ?? 0
  const lastActive = analytics.lastActive ?? Date.now()

  // =========================
  // 1. BASE MASTERY SCORE
  // =========================

  let mastery = (
    correctness * 0.5 +
    historyScore * 0.3
  )

  // =========================
  // 2. SPEED INTELLIGENCE FACTOR
  // =========================

  const speedScore =
    timeSpent < 45
      ? 15
      : timeSpent < 90
      ? 8
      : -10

  mastery += speedScore

  // =========================
  // 3. ERROR PENALTY SYSTEM (Cognitive Diagnosis)
  // =========================

  const penaltyMap = {
    concept_gap: -30,
    reasoning_error: -18,
    calculation_error: -10,
    memory_lapse: -12
  }

  if (errorType && penaltyMap[errorType]) {
    mastery += penaltyMap[errorType]
  }

  // =========================
  // 4. LEARNING CONSISTENCY BOOST
  // =========================

  if (streak >= 3) mastery += 10
  if (streak >= 7) mastery += 5
  if (streak >= 14) mastery += 5

  // =========================
  // 5. FATIGUE MODEL (COGNITIVE LOAD)
  // =========================

  if (fatigue > 80) mastery -= 25
  else if (fatigue > 60) mastery -= 15
  else if (fatigue > 40) mastery -= 5

  // =========================
  // 6. MEMORY DECAY MODEL (VERY IMPORTANT)
  // =========================

  const daysInactive =
    (Date.now() - lastActive) / (1000 * 60 * 60 * 24)

  if (daysInactive > 7) mastery -= 10
  if (daysInactive > 14) mastery -= 20
  if (daysInactive > 30) mastery -= 35

  // =========================
  // 7. REINFORCEMENT LEARNING SIGNAL
  // =========================

  const reinforcementSignal =
    correctness > 80 && streak > 5
      ? "strong_reinforcement"
      : correctness < 40
      ? "weak_understanding"
      : "stable_progress"

  // =========================
  // 8. COGNITIVE PROFILE DETECTION
  // =========================

  const cognitiveProfile = {
    deepUnderstanding:
      correctness > 85 && errorType === null,

    fragileKnowledge:
      correctness < 50 || errorType === "concept_gap",

    fastLearner:
      timeSpent < 60 && correctness > 70,

    struggling:
      correctness < 40 && fatigue > 60,

    masteryPlateau:
      historyScore > 75 && correctness < 70
  }

  // =========================
  // 9. CONFIDENCE INDEX (STABILITY OF SCORE)
  // =========================

  const confidence =
    Math.min(
      100,
      (correctness * 0.6) +
      (historyScore * 0.3) +
      (streak * 2)
    )

  // =========================
  // 10. NORMALIZATION
  // =========================

  mastery = Math.max(0, Math.min(100, mastery))

  // =========================
  // 11. FINAL MASTERY STATE CLASSIFICATION
  // =========================

  let state = "beginner"

  if (mastery >= 85) state = "expert"
  else if (mastery >= 65) state = "proficient"
  else if (mastery >= 40) state = "developing"

  // =========================
  // 12. LEARNING SIGNALS (FOR ORCHESTRATOR)
  // =========================

  const signals = {
    needsReview: mastery < 50,
    readyForNextLevel: mastery > 80,
    unstableKnowledge: fatigue > 70,
    strongRetention: confidence > 80
  }

  // =========================
  // 13. FINAL OUTPUT
  // =========================

  return {
    topic,

    masteryLevel: mastery,
    masteryState: state,

    confidence,

    reinforcementSignal,

    cognitiveProfile,

    signals,

    breakdown: {
      correctness,
      historyScore,
      streak,
      fatigue,
      timeSpent,
      errorType,
      daysInactive
    }
  }
}
