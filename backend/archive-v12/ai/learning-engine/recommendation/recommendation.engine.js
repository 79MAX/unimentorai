import { getSession } from "../memory/session.memory.engine.js"

// =========================
// 🧠 AI RECOMMENDATION ENGINE
// UNI MENTOR AI CORE BRAIN
// =========================

export const generateNextStep = async ({
  user,
  lesson,
  mastery,
  difficulty,
  history = []
}) => {

  const session = getSession(user.id)

  const recentPerformance = history.slice(-5)
  const avgScore =
    recentPerformance.length > 0
      ? recentPerformance.reduce((a, b) => a + (b.score || 0), 0) /
        recentPerformance.length
      : 50

  // =========================
  // 1. DETECT USER STATE
  // =========================

  const isStruggling = avgScore < 50
  const isStable = avgScore >= 50 && avgScore < 80
  const isAdvanced = avgScore >= 80

  // =========================
  // 2. AI DECISION ENGINE
  // =========================

  let nextStep = {}

  // ❌ STRUGGLING USER
  if (isStruggling) {
    nextStep = {
      type: "remediation",
      action: "review_previous_lesson",
      intensity: "low",
      message: "Let's reinforce fundamentals before moving forward"
    }
  }

  // ⚖️ STABLE USER
  else if (isStable) {
    nextStep = {
      type: "quiz",
      action: "apply_concepts",
      intensity: difficulty,
      message: "Let's test your understanding"
    }
  }

  // 🚀 ADVANCED USER
  else if (isAdvanced) {
    nextStep = {
      type: "challenge",
      action: "advanced_problem_solving",
      intensity: "hard",
      message: "Time for a real challenge"
    }
  }

  // =========================
  // 3. CONTEXTUAL ADAPTATION
  // =========================

  if (session?.streak > 3) {
    nextStep.motivation = "You're on fire 🔥 Keep going!"
  }

  if (session?.fatigueLevel > 70) {
    nextStep.type = "break"
    nextStep.message = "Take a short break to improve retention"
  }

  // =========================
  // 4. AI PERSONALIZATION LAYER
  // =========================

  nextStep.personalization = {
    preferredDifficulty: difficulty,
    masteryLevel: mastery?.masteryLevel || 0,
    learningPattern:
      isStruggling ? "repetition_based"
      : isAdvanced ? "challenge_based"
      : "balanced"
  }

  return nextStep
}
