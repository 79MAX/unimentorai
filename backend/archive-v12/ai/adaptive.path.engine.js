
// =========================
// 🧭 ADAPTIVE PATH ENGINE
// UNI MENTOR AI LEARNING GPS CORE BRAIN
// =========================

import { calculateMastery } from "./mastery.scoring.engine.js"

// =========================
// MAIN ENGINE
// =========================

export const generateAdaptivePath = async ({
  user,
  course,
  analytics = {},
  history = [],
  goals = {}
}) => {

  const lessons = course.lessons || []

  let path = []
  let reviewQueue = []
  let skipped = []

  // =========================
  // 1. USER LEARNING PROFILE ANALYSIS
  // =========================

  const avgScore = analytics.avgScore || 50
  const fatigue = analytics.fatigueLevel || 0
  const streak = analytics.streak || 0

  const userLevel =
    avgScore > 80
      ? "advanced"
      : avgScore > 50
      ? "intermediate"
      : "beginner"

  // =========================
  // 2. CORE PATH BUILDING LOOP
  // =========================

  for (let lesson of lessons) {

    const mastery = await calculateMastery({
      user,
      lesson,
      analytics
    })

    // =========================
    // 2.1 SKIP RULE (MASTERED CONTENT)
    // =========================

    if (mastery.masteryLevel >= 90) {
      skipped.push({
        lessonId: lesson.id,
        reason: "fully_mastered"
      })
      continue
    }

    // =========================
    // 2.2 REVIEW SYSTEM (WEAK KNOWLEDGE)
    // =========================

    if (mastery.masteryLevel < 45) {
      reviewQueue.push({
        lessonId: lesson.id,
        reason: "weak_understanding"
      })

      path.push({
        lesson,
        type: "review",
        difficulty: "easy"
      })

      continue
    }

    // =========================
    // 2.3 FATIGUE ADAPTATION (Cognitive Load Control)
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
    // 2.4 NORMAL PROGRESSION FLOW
    // =========================

    path.push({
      lesson,
      type: "progression",
      difficulty:
        userLevel === "advanced"
          ? "hard"
          : userLevel === "intermediate"
          ? "medium"
          : "easy"
    })
  }

  // =========================
  // 3. GOAL-BASED OPTIMIZATION LAYER
  // =========================

  if (goals.examPrep) {
    path = path.filter(p => p.type !== "review")
  }

  if (goals.fastTrack) {
    path = path.slice(0, Math.floor(path.length * 0.7))
  }

  if (goals.masteryMode) {
    path = [...reviewQueue.map(r => ({ lessonId: r.lessonId, type: "review" })), ...path]
  }

  // =========================
  // 4. FLOW STATE OPTIMIZATION ENGINE
  // =========================

  const flowScore = (avgScore + streak * 5) - fatigue

  let strategy = "balanced_path"

  if (fatigue > 70) {
    strategy = "recovery_path"
  } else if (flowScore > 80) {
    strategy = "challenge_path"
  } else if (avgScore < 40) {
    strategy = "reinforcement_path"
  }

  // =========================
  // 5. LEARNING EFFICIENCY SCORE
  // =========================

  const efficiencyScore =
    lessons.length > 0
      ? ((path.length / lessons.length) * 100).toFixed(2)
      : 0

  // =========================
  // 6. FINAL OUTPUT
  // =========================

  return {
    userId: user.id,

    path,

    skipped,
    reviewQueue,

    meta: {
      userLevel,
      fatigue,
      streak,
      avgScore,
      efficiencyScore,
      totalLessons: lessons.length,
      plannedLessons: path.length
    },

    strategy,

    insights: generateInsights({
      fatigue,
      avgScore,
      streak,
      flowScore
    })
  }
}

// =========================
// 🧠 INSIGHTS ENGINE
// =========================

function generateInsights({
  fatigue,
  avgScore,
  streak,
  flowScore
}) {

  const insights = []

  if (avgScore < 40) {
    insights.push("User needs foundational reinforcement")
  }

  if (fatigue > 70) {
    insights.push("High cognitive fatigue detected")
  }

  if (streak > 5) {
    insights.push("Strong learning consistency")
  }

  if (flowScore > 80) {
    insights.push("User in optimal learning flow state")
  }

  return insights
}
