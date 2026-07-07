
// =========================
// 🧠 ADAPTIVE DIFFICULTY ENGINE V2
// UNI MENTOR AI COGNITIVE LOAD BALANCER
// =========================

export const adjustDifficulty = async (mastery, analytics = {}) => {

  const masteryLevel = mastery?.masteryLevel ?? 50
  const errorType = mastery?.breakdown?.errorType

  const avgScore = analytics.avgScore ?? masteryLevel
  const fatigue = analytics.fatigueLevel ?? 0
  const streak = analytics.streak ?? 0
  const timeSpent = analytics.timeSpent ?? 0
  const stability = analytics.stabilityIndex ?? 50

  // =========================
  // 1. BASE DIFFICULTY ENGINE
  // =========================

  let difficultyScore = masteryLevel

  // =========================
  // 2. PERFORMANCE ADJUSTMENT
  // =========================

  if (avgScore > 80) difficultyScore += 15
  if (avgScore < 40) difficultyScore -= 20

  // =========================
  // 3. ERROR-DRIVEN ADAPTATION
  // =========================

  const errorPenalty = {
    concept_gap: -30,
    reasoning_error: -18,
    calculation_error: -10,
    memory_lapse: -15
  }

  if (errorType && errorPenalty[errorType]) {
    difficultyScore += errorPenalty[errorType]
  }

  // =========================
  // 4. FATIGUE MODEL (CRITICAL FOR UX)
  // =========================

  if (fatigue > 80) difficultyScore -= 35
  else if (fatigue > 60) difficultyScore -= 20
  else if (fatigue > 40) difficultyScore -= 10

  // =========================
  // 5. STREAK MOMENTUM BOOST
  // =========================

  if (streak >= 3) difficultyScore += 5
  if (streak >= 7) difficultyScore += 10
  if (streak >= 14) difficultyScore += 15

  // =========================
  // 6. COGNITIVE STABILITY CONTROL
  // =========================

  if (stability < 40) {
    difficultyScore -= 25
  }

  if (stability > 80) {
    difficultyScore += 10
  }

  // =========================
  // 7. TIME PRESSURE INTELLIGENCE
  // =========================

  if (timeSpent < 45 && masteryLevel > 70) {
    difficultyScore += 10
  }

  if (timeSpent > 180 && masteryLevel < 50) {
    difficultyScore -= 15
  }

  // =========================
  // 8. FLOW STATE DETECTION ENGINE
  // =========================

  const flowScore =
    (avgScore + masteryLevel + streak * 2) - fatigue

  let learningState = "balanced"

  if (flowScore > 85 && fatigue < 50) {
    learningState = "flow_state"
  } else if (fatigue > 70) {
    learningState = "recovery_state"
  } else if (masteryLevel < 40) {
    learningState = "foundation_state"
  } else if (masteryLevel > 80) {
    learningState = "challenge_state"
  }

  // =========================
  // 9. FINAL DIFFICULTY CLASSIFICATION
  // =========================

  let difficulty = "medium"

  if (difficultyScore >= 75) difficulty = "hard"
  else if (difficultyScore >= 45) difficulty = "medium"
  else difficulty = "easy"

  // =========================
  // 10. COGNITIVE LOAD INDEX
  // =========================

  const cognitiveLoad =
    (fatigue * 0.4) +
    ((100 - masteryLevel) * 0.3) +
    ((timeSpent > 120 ? 20 : 0))

  // =========================
  // 11. LEARNING STRATEGY ENGINE
  // =========================

  let learningStrategy = "progression"

  if (learningState === "recovery_state") {
    learningStrategy = "reduce_load"
  }

  if (learningState === "flow_state") {
    learningStrategy = "accelerate_learning"
  }

  if (learningState === "foundation_state") {
    learningStrategy = "reinforce_basics"
  }

  if (learningState === "challenge_state") {
    learningStrategy = "push_limits"
  }

  // =========================
  // 12. SAFETY LOCK SYSTEM (ANTI FRUSTRATION)
  // =========================

  const safetyLock =
    fatigue > 85 || cognitiveLoad > 80

  if (safetyLock) {
    difficulty = "easy"
    learningStrategy = "recovery_mode"
  }

  // =========================
  // 13. FINAL OUTPUT
  // =========================

  return {
    difficulty,
    learningState,
    learningStrategy,

    flowScore,
    cognitiveLoad,

    signals: {
      flowState: learningState === "flow_state",
      recoveryMode: learningState === "recovery_state",
      challengeMode: learningState === "challenge_state",
      foundationMode: learningState === "foundation_state"
    },

    metrics: {
      masteryLevel,
      avgScore,
      fatigue,
      streak,
      stability,
      timeSpent
    }
  }
}
