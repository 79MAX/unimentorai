
import { calculateMastery } from "FIX_REQUIRED_PATH"
import { analyzeMistakes } from "FIX_REQUIRED_PATH"
import { adjustDifficulty } from "FIX_REQUIRED_PATH"
import { generateAdaptivePath } from "FIX_REQUIRED_PATH"

// =========================
// 🧠 LEARNING ORCHESTRATOR ENGINE
// UNI MENTOR AI CORE PEDAGOGICAL BRAIN
// =========================

export const LearningOrchestrator = async ({
  user,
  lesson,
  answer,
  history = [],
  analytics = {}
}) => {

  // =========================
  // 1. MISTAKE ANALYSIS LAYER
  // =========================

  const mistakeAnalysis = await analyzeMistakes(answer, lesson)

  // =========================
  // 2. MASTERY SCORING LAYER
  // =========================

  const mastery = await calculateMastery({
    user,
    lesson,
    answer,
    analytics,
    mistakeAnalysis
  })

  // =========================
  // 3. DIFFICULTY ADAPTATION LAYER
  // =========================

  const difficulty = await adjustDifficulty(
    mastery,
    analytics
  )

  // =========================
  // 4. LEARNING PATH GENERATION (LIGHT VERSION)
  // =========================

  const pathSignal = await generateAdaptivePath({
    user,
    course: { lessons: [lesson] },
    analytics,
    history
  })

  // =========================
  // 5. PEDAGOGICAL DECISION ENGINE
  // =========================

  const feedback = generateFeedback({
    mistakeAnalysis,
    mastery,
    difficulty
  })

  // =========================
  // 6. LEARNING STATE SYNTHESIS
  // =========================

  const learningState = {
    mastery,
    difficulty: difficulty.difficulty,
    learningMode: difficulty.learningMode,
    mistakeAnalysis,
    pathSignal
  }

  // =========================
  // 7. FINAL ORCHESTRATION OUTPUT
  // =========================

  return {
    mastery,

    difficulty: difficulty.difficulty,

    feedback,

    learningState,

    recommendation: generateRecommendation({
      mastery,
      difficulty,
      mistakeAnalysis
    }),

    nextAction: {
      type:
        mastery.masteryLevel > 80
          ? "advance"
          : mastery.masteryLevel < 40
          ? "review"
          : "continue",

      confidence: difficulty.confidence
    }
  }
}

// =========================
// 🧠 FEEDBACK ENGINE
// =========================

function generateFeedback({
  mistakeAnalysis,
  mastery,
  difficulty
}) {

  const feedback = []

  // error-based feedback
  feedback.push(...(mistakeAnalysis.feedback || []))

  // mastery-based feedback
  if (mastery.masteryLevel > 80) {
    feedback.push("Excellent understanding 🚀")
  } else if (mastery.masteryLevel < 50) {
    feedback.push("You need more practice on this concept")
  }

  // difficulty-based feedback
  if (difficulty.learningMode === "recovery") {
    feedback.push("We are reviewing fundamentals")
  }

  return feedback
}

// =========================
// 🧠 RECOMMENDATION ENGINE
// =========================

function generateRecommendation({
  mastery,
  difficulty,
  mistakeAnalysis
}) {

  if (mistakeAnalysis.errorType === "concept_gap") {
    return "Revisit theory before practice"
  }

  if (mastery.masteryLevel > 85) {
    return "Move to advanced exercises"
  }

  if (difficulty.learningMode === "recovery") {
    return "Switch to easier review content"
  }

  return "Continue current learning path"
}
