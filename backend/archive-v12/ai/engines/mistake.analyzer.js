
// =========================
// 🧠 MISTAKE ANALYZER ENGINE V2
// UNI MENTOR AI COGNITIVE ERROR DIAGNOSTIC CORE
// =========================

export const analyzeMistakes = async (answer, lesson) => {

  const correctAnswer = lesson.correctAnswer || null
  const topic = lesson.topic || "general"

  // =========================
  // 1. BASIC CORRECTNESS SCORE
  // =========================

  const isCorrect =
    normalize(answer) === normalize(correctAnswer)

  const score = isCorrect ? 100 : 0

  // =========================
  // 2. ERROR CLASSIFICATION ENGINE
  // =========================

  let errorType = null
  let errorSeverity = "none"

  if (!isCorrect) {

    const analysis = deepErrorDetection(answer, correctAnswer)

    errorType = analysis.type
    errorSeverity = analysis.severity
  }

  // =========================
  // 3. ERROR TAXONOMY (COGNITIVE DIAGNOSIS)
  // =========================

  const errorMap = {

    concept_gap: {
      description: "User does not understand the core concept",
      severity: "high"
    },

    reasoning_error: {
      description: "Logical step is incorrect",
      severity: "high"
    },

    calculation_error: {
      description: "Mathematical mistake in computation",
      severity: "medium"
    },

    misunderstanding_question: {
      description: "User misunderstood what was asked",
      severity: "medium"
    },

    memory_lapse: {
      description: "Forgot previously learned information",
      severity: "low"
    }
  }

  // =========================
  // 4. PATTERN DETECTION ENGINE
  // =========================

  const patterns = detectPatterns(answer)

  // =========================
  // 5. CONFUSION LEVEL ESTIMATION
  // =========================

  let confusionLevel = 0

  if (errorType === "concept_gap") confusionLevel += 40
  if (errorType === "reasoning_error") confusionLevel += 30
  if (patterns.repeatedMistakes) confusionLevel += 20

  confusionLevel = Math.min(100, confusionLevel)

  // =========================
  // 6. LEARNING GAP IDENTIFICATION
  // =========================

  const learningGap = identifyLearningGap(errorType, topic)

  // =========================
  // 7. RECOVERY SUGGESTION ENGINE
  // =========================

  const recoveryStrategy = generateRecoveryStrategy(errorType, confusionLevel)

  // =========================
  // 8. CONFIDENCE IN ANSWER
  // =========================

  const confidence =
    isCorrect
      ? 100
      : Math.max(0, 100 - confusionLevel)

  // =========================
  // 9. ERROR IMPACT ON MASTERy
  // =========================

  const masteryImpact =
    isCorrect
      ? +10
      : errorSeverity === "high"
      ? -25
      : errorSeverity === "medium"
      ? -15
      : -5

  // =========================
  // 10. FINAL DIAGNOSTIC OUTPUT
  // =========================

  return {

    score,

    isCorrect,

    errorType,

    errorSeverity,

    confusionLevel,

    confidence,

    learningGap,

    masteryImpact,

    recoveryStrategy,

    patterns,

    feedback: generateFeedback(errorType, topic)
  }
}

// =========================
// 🧠 CORE ERROR DETECTOR
// =========================

function deepErrorDetection(answer, correctAnswer) {

  if (!answer) {
    return { type: "no_answer", severity: "high" }
  }

  if (typeof answer === "string" && answer.length < 3) {
    return { type: "memory_lapse", severity: "low" }
  }

  if (answer.includes("I don't know")) {
    return { type: "concept_gap", severity: "high" }
  }

  return { type: "reasoning_error", severity: "medium" }
}

// =========================
// 🔍 PATTERN DETECTOR
// =========================

function detectPatterns(answer) {

  return {
    repeatedMistakes: false,
    hesitation: answer.includes("maybe") || answer.includes("not sure"),
    partialKnowledge: answer.length > 0 && answer.length < 10
  }
}

// =========================
// 🧠 GAP IDENTIFIER
// =========================

function identifyLearningGap(errorType, topic) {

  const map = {

    concept_gap: `Core understanding of ${topic} is missing`,

    reasoning_error: `Logical structure in ${topic} needs reinforcement`,

    calculation_error: `Execution skills in ${topic} need practice`,

    memory_lapse: `Review previous ${topic} lessons`
  }

  return map[errorType] || "General misunderstanding detected"
}

// =========================
// 🔁 RECOVERY STRATEGY ENGINE
// =========================

function generateRecoveryStrategy(errorType, confusionLevel) {

  if (confusionLevel > 70) {
    return "restart_with_fundamentals"
  }

  if (errorType === "concept_gap") {
    return "re_teach_core_concept"
  }

  if (errorType === "reasoning_error") {
    return "step_by_step_guided_practice"
  }

  if (errorType === "calculation_error") {
    return "drill_practice_mode"
  }

  return "standard_review"
}

// =========================
// 🧾 FEEDBACK GENERATOR
// =========================

function generateFeedback(errorType, topic) {

  const feedbackMap = {

    concept_gap: `You need to review the fundamentals of ${topic}.`,

    reasoning_error: `Try breaking the ${topic} problem into smaller steps.`,

    calculation_error: `Focus on accuracy in ${topic} calculations.`,

    memory_lapse: `Revise previous ${topic} lessons before continuing.`
  }

  return feedbackMap[errorType] || `Keep practicing ${topic}.`
}

// =========================
// 🧼 NORMALIZER
// =========================

function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
}
