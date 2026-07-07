
// =========================
// 🎯 AI DIFFICULTY ADJUSTER ENGINE
// UNI MENTOR AI ADAPTIVE BRAIN
// =========================

export const adjustDifficulty = async (mastery, analytics = null) => {

  const masteryLevel = mastery?.masteryLevel || 50

  const avgScore = analytics?.avgScore || masteryLevel
  const fatigue = analytics?.engagement?.fatigueLevel || 0
  const streak = analytics?.engagement?.streak || 0

  let difficulty = "medium"
  let confidence = 0
  let reasoning = []

  // =========================
  // 1. BASE MASTERY ANALYSIS
  // =========================

  if (masteryLevel >= 80) {
    difficulty = "hard"
    confidence += 40
    reasoning.push("High mastery detected")
  }

  if (masteryLevel >= 50 && masteryLevel < 80) {
    difficulty = "medium"
    confidence += 30
    reasoning.push("Stable intermediate level")
  }

  if (masteryLevel < 50) {
    difficulty = "easy"
    confidence += 40
    reasoning.push("Low mastery detected")
  }

  // =========================
  // 2. PERFORMANCE ADAPTATION
  // =========================

  if (avgScore > 85) {
    difficulty = "hard"
    confidence += 20
    reasoning.push("High recent performance")
  }

  if (avgScore < 50) {
    difficulty = "easy"
    confidence += 20
    reasoning.push("Low recent performance")
  }

  // =========================
  // 3. FATIGUE CONTROL SYSTEM
  // =========================

  if (fatigue > 70) {
    difficulty = "easy"
    reasoning.push("User fatigue detected → reducing difficulty")
  }

  if (fatigue > 85) {
    difficulty = "review"
    reasoning.push("High fatigue → switching to revision mode")
  }

  // =========================
  // 4. STREAK BOOST LOGIC (ENGAGEMENT ENGINE)
  // =========================

  if (streak >= 3 && difficulty === "medium") {
    difficulty = "hard"
    reasoning.push("Streak bonus → increasing challenge")
  }

  // =========================
  // 5. STABILITY CLAMP (ANTI-FLUCTUATION)
  // =========================

  const stabilityScore =
    (masteryLevel + avgScore) / 2

  if (stabilityScore > 75 && fatigue < 50) {
    confidence += 10
  }

  if (stabilityScore < 40) {
    confidence -= 10
  }

  // clamp confidence
  confidence = Math.max(0, Math.min(100, confidence))

  // =========================
  // 6. FINAL DECISION ENGINE
  // =========================

  let finalDifficulty = difficulty

  if (confidence < 30) {
    finalDifficulty = "medium"
    reasoning.push("Low confidence → fallback to safe mode")
  }

  // =========================
  // 7. ADAPTIVE LEARNING MODE DETECTION
  // =========================

  const learningMode =
    fatigue > 80
      ? "recovery"
      : masteryLevel > 80
      ? "challenge"
      : masteryLevel < 40
      ? "foundation"
      : "progression"

  // =========================
  // 8. RETURN ENGINE OUTPUT
  // =========================

  return {
    difficulty: finalDifficulty,
    confidence,
    learningMode,
    signals: {
      masteryLevel,
      avgScore,
      fatigue,
      streak
    },
    reasoning
  }
}
