
import { calculateMastery } from "./mastery.scoring.engine.js"

// =========================
// 🧭 ADAPTIVE PATH ENGINE
// UNI MENTOR AI LEARNING GPS BRAIN
// =========================

export const generateAdaptivePath = async ({
  user,
  course,
  analytics,
  history = [],
  goals = {}
}) => {

  // =========================
  // 1. INITIALIZE PATH STRUCTURE
  // =========================

  const lessons = course.lessons || []

  let path = []
  let skipped = []
  let reinforced = []

  // =========================
  // 2. ANALYZE USER PROFILE
  // =========================

  const avgScore = analytics?.avgScore || 50
  const fatigue = analytics?.engagement?.fatigueLevel || 0
  const streak = analytics?.engagement?.streak || 0

  const userLevel =
    avgScore > 80
      ? "advanced"
      : avgScore > 50
      ? "intermediate"
      : "beginner"

  // =========================
  // 3. PATH GENERATION LOOP
  // =========================

  for (let lesson of lessons) {

    const mastery = await calculateMastery({
      user,
      lesson,
      analytics
    })

    // =========================
    // 3.1 SKIP LOGIC (MASTERED CONTENT)
    // =========================

    if (mastery.masteryLevel >= 85) {
      skipped.push({
        lessonId: lesson.id,
        reason: "Already mastered"
      })
      continue
    }

    // =========================
    // 3.2 REINFORCEMENT LOGIC
    // =========================

    if (mastery.masteryLevel < 40) {
      reinforced.push({
        lessonId: lesson.id,
        reason: "Weak understanding"
      })

      path.push({
        lesson,
        type: "reinforcement",
        difficulty: "easy"
      })

      continue
    }

    // =========================
    // 3.3 FATIGUE ADAPTATION
    // =========================

    if (fatigue > 70) {
      path.push({
        lesson,
        type: "light_learning",
        difficulty: "easy"
      })
      continue
    }

    // =========================
    // 3.4 NORMAL PATH FLOW
    // =========================

    path.push({
      lesson,
      type: "standard",
      difficulty:
        userLevel === "advanced"
          ? "hard"
          : userLevel === "intermediate"
          ? "medium"
          : "easy"
    })
  }

  // =========================
  // 4. GOAL OPTIMIZATION LAYER
  // =========================

  if (goals?.examPreparation) {
    path = path.filter(p => p.type !== "reinforcement")
  }

  if (goals?.fastLearning) {
    path = path.slice(0, Math.ceil(path.length * 0.7))
  }

  if (goals?.masteryMode) {
    path = [...reinforced, ...path]
  }

  // =========================
  // 5. LEARNING PATH OPTIMIZATION SCORE
  // =========================

  const efficiencyScore =
    (path.length / (lessons.length || 1)) * 100

  // =========================
  // 6. RETURN ADAPTIVE PATH
  // =========================

  return {
    userId: user.id,

    path,

    skipped,
    reinforced,

    meta: {
      userLevel,
      efficiencyScore,
      fatigue,
      streak,
      totalLessons: lessons.length,
      plannedLessons: path.length
    },

    strategy:
      fatigue > 70
        ? "recovery_path"
        : avgScore > 80
        ? "challenge_path"
        : "balanced_path"
  }
}
