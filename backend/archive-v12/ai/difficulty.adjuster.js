
// =========================
// 🎯 ADAPTIVE DIFFICULTY ENGINE
// UNI MENTOR AI COGNITIVE LOAD BALANCER
// =========================

export const adjustDifficulty = async (mastery, analytics = {}) => {

  const masteryLevel = mastery?.masteryLevel || 50
  const errorType = mastery?.breakdown?.errorType

  const avgScore = analytics.avgScore || masteryLevel
  const fatigue = analytics.fatigueLevel || 0
  const streak = analytics.streak || 0
  const timeSpent = analytics.timeSpent || 0

  let difficulty = "medium"
  let learningMode = "progression"
  let confidence = 0
  let signals = []

  // =========================
  // 1. MASTERY-BASED ADAPTATION
  // =========================

  if (masteryLevel >= 85) {
    difficulty = "hard"
    learningMode = "challenge"
    confidence += 40
    signals.push("high_mastery_detected")
  }

  if (masteryLevel >= 60 && masteryLevel < 85) {
    difficulty = "medium"
    learningMode = "progression"
    confidence += 30
  }

  if (masteryLevel < 60) {
    difficulty = "easy"
    learningMode = "foundation"
    confidence += 40
  }

  // =========================
  // 2. ERROR-AWARE ADAPTATION
  // =========================

  if (errorType === "concept_gap") {
    difficulty = "easy"
    learningMode = "reinforcement"
    signals.push("concept_gap_detected")
  }

  if (errorType === "reasoning_error") {
    difficulty = "medium"
    signals.push("reasoning_instability")
  }

  // =========================
  // 3. FATIGUE MANAGEMENT SYSTEM
  // =========================

  if (fatigue > 80) {
    difficulty = "easy"
    learningMode = "recovery"
    signals.push("high_fatigue")
  }

  if (fatigue > 60 && fatigue <= 80) {
    difficulty = "medium"
    signals.push("moderate_fatigue")
  }

  // =========================
  // 4. ENGAGEMENT OPTIMIZATION (FLOW STATE)
  // =========================

  const flowScore =
    (avgScore + masteryLevel) / 2

  if (flowScore > 75 && fatigue < 50) {
    difficulty = "hard"
    signals.push("flow_state_detected")
  }

  // =========================
  // 5. STREAK BOOST SYSTEM
  // =========================

  if (streak >= 3 && difficulty !== "hard") {
    difficulty = "medium"
    signals.push("streak_boost")
  }

  if (streak >= 7) {
    difficulty = "hard"
    signals.push("high_streak_mastery_push")
  }

  // =========================
  // 6. STABILITY CONTROL (ANTI FLUCTUATION)
  // =========================

  const stabilityIndex =
    (masteryLevel + avgScore) / 2

  if (stabilityIndex < 40) {
    difficulty = "easy"
    learningMode = "stabilization"
    signals.push("low_stability_lock_easy_mode")
  }

  // =========================
  // 7. TIME PRESSURE ADJUSTMENT
  // =========================

  if (timeSpent > 180 && masteryLevel < 60) {
    difficulty = "easy"
    signals.push("slow_processing_detected")
  }

  // =========================
  // 8. CONFIDENCE ENGINE
  // =========================

  confidence = Math.max(
    0,
    Math.min(100,
      confidence +
      (flowScore > 70 ? 10 : 0) -
      (fatigue > 70 ? 10 : 0)
    )
  )

  // =========================
  // 9. FINAL OUTPUT STRUCTURE
  // =========================

  return {
    difficulty,
    learningMode,
    confidence,

    signals,

    metrics: {
      masteryLevel,
      avgScore,
      fatigue,
      streak,
      flowScore
    },

    recommendation:
      learningMode === "recovery"
        ? "Reduce cognitive load and reinforce basics"
        : learningMode === "challenge"
        ? "Increase difficulty and push advanced tasks"
        : "Maintain progressive learning flow"
  }
}
