
// =========================
// 🤖 AI QUESTION GENERATOR ENGINE
// UNI MENTOR AI COGNITIVE QUESTION BRAIN
// =========================

export const generateQuestion = async ({
  user,
  lesson,
  difficulty = "medium",
  previousQuestions = [],
  learnerProfile = {}
}) => {

  const topic = lesson.topic || "general"
  const lessonType = lesson.type || "theory"

  const usedQuestions = new Set(
    previousQuestions.map(q => q.question)
  )

  // =========================
  // 1. ADAPTIVE QUESTION TYPES
  // =========================

  const questionPool = {
    easy: [
      "mcq",
      "true_false",
      "fill_blank"
    ],
    medium: [
      "short_answer",
      "concept_explanation",
      "example_identification"
    ],
    hard: [
      "problem_solving",
      "case_analysis",
      "reasoning_chain"
    ]
  }

  let selectedTypes = questionPool[difficulty] || questionPool.medium

  // =========================
  // 2. LEARNER PERSONALIZATION LAYER
  // =========================

  const learningStyle = learnerProfile?.behavior?.learningStyle || "structured"
  const fatigue = learnerProfile?.behavior?.fatigueLevel || 0

  if (learningStyle === "visual") {
    selectedTypes.push("visual_reasoning")
  }

  if (fatigue > 70) {
    selectedTypes = ["mcq", "true_false"] // reduce cognitive load
  }

  // =========================
  // 3. SELECT QUESTION TYPE
  // =========================

  const type =
    selectedTypes[Math.floor(Math.random() * selectedTypes.length)]

  // =========================
  // 4. AI QUESTION GENERATION CORE
  // =========================

  let questionObject = generateByType(type, topic, lesson)

  // =========================
  // 5. ANTI-DUPLICATION SYSTEM
  // =========================

  if (usedQuestions.has(questionObject.question)) {
    return generateQuestion({
      user,
      lesson,
      difficulty,
      previousQuestions,
      learnerProfile
    })
  }

  // =========================
  // 6. DIFFICULTY-BASED HINT ENGINE
  // =========================

  const hint =
    difficulty === "easy"
      ? "Focus on basic understanding"
      : difficulty === "medium"
      ? "Apply the concept step by step"
      : "Think critically and justify your reasoning"

  // =========================
  // 7. PEDAGOGICAL CONTEXT TAGGING
  // =========================

  const tags = [
    topic,
    difficulty,
    lessonType,
    type
  ]

  // =========================
  // 8. RETURN QUESTION OBJECT
  // =========================

  return {
    question: questionObject.question,
    options: questionObject.options || null,
    answer: questionObject.answer || null,

    type,
    topic,
    difficulty,

    hint,
    tags,

    metadata: {
      generatedAt: Date.now(),
      aiGenerated: true
    }
  }
}

// =========================
// 🧠 QUESTION TYPE ENGINE
// =========================

function generateByType(type, topic, lesson) {

  // =========================
  // MCQ
  // =========================

  if (type === "mcq") {
    return {
      question: `Which statement best describes ${topic}?`,
      options: [
        "Correct understanding",
        "Partially correct idea",
        "Incorrect interpretation",
        "Unrelated concept"
      ],
      answer: "Correct understanding"
    }
  }

  // =========================
  // TRUE / FALSE
  // =========================

  if (type === "true_false") {
    return {
      question: `${topic} is an essential concept in this lesson.`,
      answer: true
    }
  }

  // =========================
  // FILL IN THE BLANK
  // =========================

  if (type === "fill_blank") {
    return {
      question: `The key principle of ${topic} is ________.`,
      answer: "core concept"
    }
  }

  // =========================
  // SHORT ANSWER
  // =========================

  if (type === "short_answer") {
    return {
      question: `Explain in your own words: what is ${topic}?`,
      answer: "conceptual understanding"
    }
  }

  // =========================
  // PROBLEM SOLVING
  // =========================

  if (type === "problem_solving") {
    return {
      question: `Solve a real-world problem involving ${topic} and explain your reasoning.`,
      answer: "step-by-step reasoning required"
    }
  }

  // =========================
  // REASONING CHAIN (ADVANCED AI LEVEL)
  // =========================

  if (type === "reasoning_chain") {
    return {
      question: `Break down the concept of ${topic} into logical steps and justify each one.`,
      answer: "multi-step reasoning"
    }
  }

  // fallback
  return {
    question: `What do you understand about ${topic}?`,
    answer: "open response"
  }
}
