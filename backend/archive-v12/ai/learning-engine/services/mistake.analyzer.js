
// =========================
// 🔍 AI MISTAKE ANALYZER ENGINE
// UNI MENTOR AI CORE TEACHER BRAIN
// =========================

export const analyzeMistakes = async (answer, lesson) => {

  const expected = lesson.expectedAnswer
  const explanation = lesson.explanation || ""

  let score = 0
  let errorType = null
  let feedback = []

  // =========================
  // 1. EXACT MATCH CHECK
  // =========================

  if (answer.trim().toLowerCase() === expected.trim().toLowerCase()) {
    return {
      score: 100,
      errorType: null,
      feedback: ["Perfect answer 🎯", "You fully understood the concept"],
      masterySignal: "strong"
    }
  }

  // =========================
  // 2. LENGTH ANALYSIS
  // =========================

  if (answer.length < expected.length * 0.5) {
    errorType = "incomplete_answer"
    feedback.push("Your answer is too short")
    feedback.push("You may be missing key concepts")
    score -= 20
  }

  if (answer.length > expected.length * 2) {
    errorType = "over_explained"
    feedback.push("Your answer is too verbose")
    feedback.push("Try to be more concise")
    score -= 10
  }

  // =========================
  // 3. KEYWORD ANALYSIS
  // =========================

  const expectedWords = expected.split(" ")
  const answerWords = answer.split(" ")

  const missingKeywords = expectedWords.filter(
    word => !answerWords.includes(word)
  )

  if (missingKeywords.length > 0) {
    errorType = "concept_gap"
    feedback.push(
      `Missing key concepts: ${missingKeywords.slice(0, 3).join(", ")}`
    )
    score -= missingKeywords.length * 5
  }

  // =========================
  // 4. LOGICAL STRUCTURE CHECK
  // =========================

  const hasStructure =
    answer.includes("because") ||
    answer.includes("therefore") ||
    answer.includes("step") ||
    answer.includes("first")

  if (!hasStructure) {
    errorType = errorType || "poor_reasoning"
    feedback.push("Try to structure your reasoning step-by-step")
    score -= 10
  }

  // =========================
  // 5. DOMAIN ERROR CLASSIFICATION
  // =========================

  if (lesson.type === "math") {
    if (isNaN(Number(answer)) && !isNaN(Number(expected))) {
      errorType = "calculation_error"
      feedback.push("This looks like a calculation mistake")
    }
  }

  if (lesson.type === "language") {
    if (answer.includes("grammer") || answer.includes("speling")) {
      errorType = "language_error"
      feedback.push("Spelling or grammar issue detected")
    }
  }

  // =========================
  // 6. FINAL SCORE NORMALIZATION
  // =========================

  score = Math.max(0, Math.min(100, 100 + score))

  // =========================
  // 7. AI PEDAGOGICAL FEEDBACK ENGINE
  // =========================

  if (score < 50) {
    feedback.push("Let's revisit the fundamentals of this topic")
  } else if (score < 80) {
    feedback.push("Good attempt — refine your understanding")
  } else {
    feedback.push("Strong understanding with minor gaps")
  }

  // =========================
  // 8. RETURN ANALYSIS OBJECT
  // =========================

  return {
    score,
    errorType,
    feedback,
    masterySignal:
      score > 80
        ? "strong"
        : score > 50
        ? "medium"
        : "weak",

    hints: generateHints(errorType, lesson)
  }
}

// =========================
// 🧠 HINT GENERATOR (AI TEACHER LAYER)
// =========================

function generateHints(errorType, lesson) {

  switch (errorType) {

    case "concept_gap":
      return [
        "Review key definitions",
        "Break the concept into smaller parts"
      ]

    case "calculation_error":
      return [
        "Re-check your steps",
        "Slow down calculations"
      ]

    case "incomplete_answer":
      return [
        "Expand your explanation",
        "Add supporting ideas"
      ]

    case "poor_reasoning":
      return [
        "Use step-by-step thinking",
        "Explain your logic clearly"
      ]

    default:
      return [
        "Try again with more clarity",
        "Review lesson material"
      ]
  }
}
