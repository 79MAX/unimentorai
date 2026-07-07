
// =========================
// 🧠 LEARNING ORCHESTRATOR (CORE BRAIN)
// UNI MENTOR AI PEDAGOGICAL ENGINE
// =========================

import { analyzeMistakes } from "./mistake.analyzer.js"
import { calculateMastery } from "./mastery.scoring.engine.js"
import { adjustDifficulty } from "./difficulty.adjuster.js"
import { generateAdaptivePath } from "./adaptive.path.engine.js"

// =========================
// MAIN ORCHESTRATION ENGINE
// =========================

export const LearningOrchestrator = async ({
  user,
  lesson,
  answer,
  history = [],
  analytics = {}
}) => {

  try {

    // =========================
    // 1. ERROR UNDERSTANDING LAYER
    // =========================

    const mistakeAnalysis = await analyzeMistakes(answer, lesson)

    // =========================
    // 2. MASTERY COMPUTATION LAYER
    // =========================

    const mastery = await calculateMastery({
      user,
      lesson,
      answer,
      analytics,
      mistakeAnalysis
    })

    // =========================
    // 3. CONTEXTUAL DIFFICULTY ENGINE
    // =========================

    const difficulty = await adjustDifficulty(
      mastery,
      analytics
    )

    // =========================
    // 4. ADAPTIVE PATH SIGNAL
    // =========================

    const path = await generateAdaptivePath({
      user,
      course: { lessons: [lesson] },
      analytics,
      history
    })

    // =========================
    // 5. PEDAGOGICAL DECISION ENGINE
    // =========================

    const decision = generateDecision({
      mastery,
      mistakeAnalysis,
      difficulty
    })

    // =========================
    // 6. LEARNING STATE FUSION
    // =========================

    const learningState = {
      mastery,
      mistakeAnalysis,
      difficulty: difficulty.difficulty,
      learningMode: difficulty.learningMode,
      pathSignal: path.strategy
    }

    // =========================
    // 7. NEXT ACTION ENGINE
    // =========================

    const nextAction = determineNextAction({
      mastery,
      difficulty,
      mistakeAnalysis
    })

    // =========================
    // 8. FINAL OUTPUT (AI BRAIN RESULT)
    // =========================

    return {
      success: true,

      mastery,

      mistakeAnalysis,

      difficulty: difficulty.difficulty,

      learningState,

      decision,

      nextAction,

      recommendation: decision.recommendation,

      path: path.path
    }

  } catch (error) {

    console.error("❌ Learning Orchestrator Error:", error)

    return {
      success: false,
      fallback: {
        message: "Learning system temporarily unavailable",
        nextAction: { type: "retry" }
      }
    }
  }
}

// =========================
// 🧠 DECISION ENGINE (CORE PEDAGOGY)
// =========================

function generateDecision({
  mastery,
  mistakeAnalysis,
  difficulty
}) {

  let recommendation = ""

  // concept failure
  if (mistakeAnalysis.errorType === "concept_gap") {
    recommendation = "Reinforce fundamental concept before advancing"
  }

  // high mastery
  else if (mastery.masteryLevel > 85) {
    recommendation = "Advance to next difficulty level"
  }

  // low mastery
  else if (mastery.masteryLevel < 40) {
    recommendation = "Repeat lesson with simplified explanation"
  }

  // fatigue condition
  else if (difficulty.learningMode === "recovery") {
    recommendation = "Switch to light review mode"
  }

  else {
    recommendation = "Continue structured progression"
  }

  return {
    recommendation,
    confidence: mastery.confidence || 70
  }
}

// =========================
// 🧭 NEXT ACTION ENGINE
// =========================

function determineNextAction({
  mastery,
  difficulty,
  mistakeAnalysis
}) {

  if (mastery.masteryLevel >= 85) {
    return {
      type: "advance",
      reason: "High mastery achieved"
    }
  }

  if (mistakeAnalysis.errorType === "concept_gap") {
    return {
      type: "remedial",
      reason: "Conceptual misunderstanding detected"
    }
  }

  if (difficulty.learningMode === "recovery") {
    return {
      type: "restudy",
      reason: "User fatigue detected"
    }
  }

  return {
    type: "continue",
    reason: "Normal progression"
  }
}
