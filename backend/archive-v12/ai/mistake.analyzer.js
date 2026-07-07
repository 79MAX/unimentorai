
// =========================
// 🔍 AI MISTAKE ANALYZER ENGINE
// UNI MENTOR AI COGNITIVE ERROR BRAIN
// =========================

export const analyzeMistakes = async (answer, lesson) => {

  const expected = lesson.expectedAnswer || ""
  const topic = lesson.topic || "general"

  let score = 100
  let errorType = null
  let rootCause = null

  const feedback = []
  const hints = []

  // =========================
  // 1. EXACT MATCH CHECK
  // =========================

  if (
    normalize(answer) === normalize(expected)
  ) {
    return {
      score: 100,
      errorType: null,
      rootCause: null,
      feedback: ["Perfect answer 🎯"],
      hints: ["Try a more advanced variation of this question"]
    }
  }

  // =========================
  // 2. CONCEPT GAP DETECTION
  // =========================

  const expectedKeywords = extractKeywords(expected)
  const answerKeywords = extractKeywords(answer)

  const missingConcepts = expectedKeywords.filter(
    k => !answerKeywords.includes(k)
  )

  if (missingConcepts.length > 0) {
    errorType = "concept_gap"
    rootCause = "missing_core_concepts"

    score -= missingConcepts.length * 12

    feedback.push(
      `Missing key concepts: ${missingConcepts.slice(0, 3).join(", ")}`
    )

    hints.push("Review the fundamental definition of this topic")
  }

  // =========================
  // 3. LOGIC STRUCTURE ANALYSIS
  // =========================

  const hasLogicalFlow =
    answer.includes("because") ||
    answer.includes("therefore") ||
    answer.includes("step") ||
    answer.includes("first")

  if (!hasLogicalFlow) {
    errorType = errorType || "reasoning_error"
    rootCause = "weak_reasoning_structure"

    score -= 15

    feedback.push("Your reasoning is not structured")
    hints.push("Try explaining step-by-step logic")
  }

  // =========================
  // 4. MATHEMATICAL / DOMAIN ERROR
  // =========================

  if (lesson.type === "math") {

    const numAnswer = Number(answer)
    const numExpected = Number(expected)

    if (!isNaN(numExpected) && isNaN(numAnswer)) {
      errorType = "calculation_error"
      rootCause = "invalid_numeric_processing"

      score -= 20

      feedback.push("This appears to be a calculation issue")
      hints.push("Re-check your arithmetic steps")
    }
  }

  // =========================
  // 5. PARTIAL UNDERSTANDING DETECTION
  // =========================

  const partialMatchRatio =
    intersectionRatio(answerKeywords, expectedKeywords)

  if (partialMatchRatio > 0.5 && partialMatchRatio < 0.85) {
    errorType = errorType || "partial_understanding"
    rootCause = "incomplete_concept_mapping"

    feedback.push("You understand part of the concept")
    hints.push("Expand your explanation with missing parts")

    score -= 10
  }

  // =========================
  // 6. SCORE NORMALIZATION
  // =========================

  score = Math.max(0, Math.min(100, score))

  // =========================
  // 7. PEDAGOGICAL CLASSIFICATION
  // =========================

  const masterySignal =
    score > 85
      ? "strong"
      : score > 60
      ? "medium"
      : "weak"

  // =========================
  // 8. AI FEEDBACK ENGINE
  // =========================

  if (score < 50) {
    feedback.push("You should revisit the core lesson")
    hints.push("Break the concept into smaller parts")
  } else if (score < 80) {
    feedback.push("Good attempt — refine your understanding")
  } else {
    feedback.push("Strong understanding with minor gaps")
  }

  // =========================
  // 9. RETURN STRUCTURED ANALYSIS
  // =========================

  return {
    score,
    errorType,
    rootCause,

    masterySignal,

    feedback,
    hints,

    debug: {
      expectedKeywords,
      answerKeywords,
      missingConcepts
    }
  }
}

// =========================
// 🧠 HELPERS
// =========================

function normalize(text = "") {
  return text.toLowerCase().trim()
}

function extractKeywords(text = "") {
  return text
    .toLowerCase()
    .split(" ")
    .filter(w => w.length > 2)
}

function intersectionRatio(a = [], b = []) {
  const intersection = a.filter(x => b.includes(x)).length
  return intersection / Math.max(1, b.length)
}
