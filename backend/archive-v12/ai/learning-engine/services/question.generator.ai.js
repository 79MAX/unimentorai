
// =========================
// 🤖 AI QUESTION GENERATOR ENGINE
// UNI MENTOR AI PEDAGOGICAL BRAIN
// =========================

export const generateQuestion = async ({
  user,
  lesson,
  difficulty = "medium",
  previousQuestions = []
}) => {

  // =========================
  // 1. DETECT CONTEXT
  // =========================

  const topic = lesson.topic || "general"
  const type = lesson.type || "theory"

  const usedQuestions = new Set(
    previousQuestions.map(q => q.question)
  )

  // =========================
  // 2. QUESTION BANK STRATEGY
  // =========================

  const questionTypes = {
    easy: [
      "multiple_choice",
      "true_false"
    ],
    medium: [
      "short_answer",
      "fill_blank"
    ],
    hard: [
      "problem_solving",
      "case_study"
    ]
  }

  const selectedTypes = questionTypes[difficulty] || questionTypes.medium

  const selectedType =
    selectedTypes[Math.floor(Math.random() * selectedTypes.length)]

  // =========================
  // 3. AI QUESTION GENERATION CORE
  // =========================

  let question = ""

  if (selectedType === "multiple_choice") {
    question = generateMultipleChoice(topic, lesson)
  }

  if (selectedType === "true_false") {
    question = generateTrueFalse(topic, lesson)
  }

  if (selectedType === "short_answer") {
    question = generateShortAnswer(topic, lesson)
  }

  if (selectedType === "problem_solving") {
    question = generateProblemSolving(topic, lesson)
  }

  // =========================
  // 4. ANTI-REPETITION SYSTEM
  // =========================

  if (usedQuestions.has(question)) {
    return generateQuestion({
      user,
      lesson,
      difficulty,
      previousQuestions
    })
  }

  // =========================
  // 5. DIFFICULTY ADAPTATION LOGIC
  // =========================

  const adaptiveHint =
    difficulty === "easy"
      ? "Focus on basic understanding"
      : difficulty === "medium"
      ? "Apply the concept"
      : "Think critically and solve step by step"

  // =========================
  // 6. RETURN QUESTION OBJECT
  // =========================

  return {
    question,
    type: selectedType,
    topic,
    difficulty,
    hint: adaptiveHint,
    metadata: {
      generatedAt: Date.now(),
      aiGenerated: true
    }
  }
}

// =========================
// 🧠 QUESTION GENERATORS
// =========================

function generateMultipleChoice(topic, lesson) {
  return `Which of the following best describes ${topic}?`
}

function generateTrueFalse(topic) {
  return `True or False: ${topic} is an essential concept in this lesson.`
}

function generateShortAnswer(topic) {
  return `Explain in your own words: What is ${topic}?`
}

function generateProblemSolving(topic) {
  return `Solve this real-world problem related to ${topic}. Show your steps.`
}
