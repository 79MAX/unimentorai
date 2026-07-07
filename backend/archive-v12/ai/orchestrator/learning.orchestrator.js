
// =========================
// 🧠 LEARNING ORCHESTRATOR V3
// UNI MENTOR AI COGNITIVE CONTROL TOWER
// =========================

import { getSession, updateSession } from "FIX_REQUIRED_PATH";
import { buildLearnerProfile } from "FIX_REQUIRED_PATH";
import { analyzeMistakes } from "FIX_REQUIRED_PATH";
import { calculateMastery } from "FIX_REQUIRED_PATH";
import { adjustDifficulty } from "FIX_REQUIRED_PATH";
import { generateAdaptivePath } from "FIX_REQUIRED_PATH";
import { generateQuestion } from "FIX_REQUIRED_PATH";

// =========================
// MAIN ORCHESTRATION ENGINE
// =========================

export async function learningOrchestrator({
  user,
  lesson,
  answer
}) {

  // =========================
  // 1. SESSION MEMORY LOAD
  // =========================

  const session = getSession(user.id)

  // =========================
  // 2. MISTAKE ANALYSIS (Cognitive Diagnosis)
  // =========================

  const mistakeAnalysis = await analyzeMistakes(answer, lesson)

  // =========================
  // 3. MASTERY CALCULATION
  // =========================

  const mastery = await calculateMastery({
    user,
    lesson,
    answer,
    analytics: session.analytics,
    mistakeAnalysis
  })

  // =========================
  // 4. SESSION UPDATE (REAL-TIME MEMORY)
  // =========================

  updateSession(user.id, {
    history: [
      {
        topic: lesson.topic,
        lessonId: lesson.id,
        answer,
        score: mastery.masteryLevel,
        errorType: mistakeAnalysis.errorType,
        timestamp: Date.now()
      }
    ],
    analytics: {
      avgScore: mastery.masteryLevel,
      fatigueLevel: session.analytics.fatigueLevel + (mistakeAnalysis.confusionLevel || 0) * 0.1,
      streak: session.analytics.streak + (mistakeAnalysis.isCorrect ? 1 : 0),
      timeSpent: session.analytics.timeSpent + (lesson.timeSpent || 0)
    }
  })

  // =========================
  // 5. LEARNER PROFILE BUILD
  // =========================

  const learnerProfile = await buildLearnerProfile({
    user,
    history: session.history,
    analytics: session.analytics,
    session
  })

  // =========================
  // 6. ADAPTIVE DIFFICULTY ENGINE
  // =========================

  const difficulty = await adjustDifficulty(
    mastery,
    session.analytics
  )

  // =========================
  // 7. ADAPTIVE PATH ENGINE
  // =========================

  const path = await generateAdaptivePath({
    user,
    course: lesson.course,
    analytics: session.analytics,
    history: session.history,
    mastery
  })

  // =========================
  // 8. NEXT QUESTION GENERATION
  // =========================

  const nextQuestion = await generateQuestion({
    user,
    lesson,
    difficulty: difficulty.difficulty,
    learnerProfile,
    previousQuestions: session.history
  })

  // =========================
  // 9. LEARNING STATE ENGINE (GLOBAL CONTEXT)
  // =========================

  const learningState = computeLearningState({
    mastery,
    difficulty,
    session
  })

  // =========================
  // 10. COGNITIVE HEALTH CHECK
  // =========================

  const cognitiveHealth = computeCognitiveHealth({
    session,
    mastery,
    mistakeAnalysis
  })

  // =========================
  // 11. FEEDBACK GENERATION (REAL TIME TUTORING)
  // =========================

  const feedback = generateFeedback({
    mistakeAnalysis,
    mastery,
    learningState
  })

  // =========================
  // 12. RETURN FULL AI DECISION PACKET
  // =========================

  return {
    userId: user.id,

    lesson: lesson.id,

    learnerProfile,

    mastery,

    difficulty,

    path,

    nextQuestion,

    feedback,

    learningState,

    cognitiveHealth,

    signals: {
      shouldIncreaseDifficulty: mastery.masteryLevel > 75,
      shouldDecreaseDifficulty: mastery.masteryLevel < 40,
      isUserStruggling: cognitiveHealth.struggling,
      isUserInFlow: learningState === "flow",
      needsRecovery: cognitiveHealth.fatigue > 80
    }
  }
}

// =========================
// 🧠 LEARNING STATE ENGINE
// =========================

function computeLearningState({ mastery, difficulty, session }) {

  const fatigue = session.analytics.fatigueLevel
  const score = mastery.masteryLevel

  if (fatigue > 80) return "recovery"
  if (score > 80 && fatigue < 50) return "flow"
  if (score < 40) return "foundation"
  if (score > 70) return "challenge"

  return "balanced"
}

// =========================
// 🧠 COGNITIVE HEALTH ENGINE
// =========================

function computeCognitiveHealth({ session, mastery, mistakeAnalysis }) {

  const fatigue = session.analytics.fatigueLevel

  return {
    fatigue,
    confusion: mistakeAnalysis.confusionLevel,
    struggling: fatigue > 70 || mastery.masteryLevel < 40,
    stable: fatigue < 50 && mastery.masteryLevel > 60
  }
}

// =========================
// 🧠 FEEDBACK ENGINE
// =========================

function generateFeedback({ mistakeAnalysis, mastery, learningState }) {

  if (!mistakeAnalysis.isCorrect) {

    if (mistakeAnalysis.errorType === "concept_gap") {
      return "You need to revisit the core concept before continuing."
    }

    if (mistakeAnalysis.errorType === "reasoning_error") {
      return "Try breaking the problem into smaller logical steps."
    }
  }

  if (learningState === "flow") {
    return "Great progress — increasing difficulty."
  }

  if (learningState === "recovery") {
    return "We will slow down and reinforce basics."
  }

  return "Keep going, you're progressing well."
}
