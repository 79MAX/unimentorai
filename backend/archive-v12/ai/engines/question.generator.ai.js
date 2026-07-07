
// =========================
// 🧠 AI QUESTION GENERATOR ENGINE V2
// UNI MENTOR AI PEDAGOGICAL BRAIN
// =========================

export const generateQuestion = async ({
  user,
  lesson,
  difficulty = "medium",
  learnerProfile = {},
  previousQuestions = []
}) => {

  const topic = lesson.topic || "general"
  const level = learnerProfile.identity?.level || "beginner"
  const learningStyle = learnerProfile.behavior?.learningStyle || "structured"

  const mastery = learnerProfile.cognition?.accuracy || 50
  const reasoning = learnerProfile.cognition?.reasoningStrength || "moderate"

  // =========================
  // 1. QUESTION TYPE SELECTION ENGINE
  // =========================

  let questionType = "conceptual"

  if (mastery < 40) {
    questionType = "basic_recall"
  } else if (mastery < 70) {
    questionType = "application"
  } else {
    questionType = "problem_solving"
  }

  // =========================
  // 2. COGNITIVE LEVEL ADAPTATION (BLOOM STYLE)
  // =========================

  let cognitiveLevel = "understand"

  if (difficulty === "easy") cognitiveLevel = "remember"
  if (difficulty === "medium") cognitiveLevel = "apply"
  if (difficulty === "hard") cognitiveLevel = "analyze"

  if (reasoning === "weak") cognitiveLevel = "remember"
  if (reasoning === "strong") cognitiveLevel = "analyze"

  // =========================
  // 3. LEARNING STYLE ADAPTATION
  // =========================

  let presentationStyle = "text"

  if (learningStyle === "visual") {
    presentationStyle = "scenario_based"
  }

  if (learningStyle === "fast-paced") {
    presentationStyle = "direct_question"
  }

  if (learningStyle === "guided-step-by-step") {
    presentationStyle = "hint_guided"
  }

  // =========================
  // 4. QUESTION VARIATION ENGINE (ANTI REPETITION)
  // =========================

  const usedTopics = previousQuestions.map(q => q.topic)

  const variationBoost = usedTopics.includes(topic)
    ? "new_angle"
    : "standard"

  // =========================
  // 5. FATIGUE-BASED SIMPLIFICATION
  // =========================

  const fatigue = learnerProfile.behavior?.fatigueLevel || 0

  if (fatigue > 75) {
    questionType = "very_easy"
    cognitiveLevel = "remember"
  }

  // =========================
  // 6. QUESTION TEMPLATES ENGINE
  // =========================

  const templates = {

    basic_recall: [
      `What is the definition of ${topic}?`,
      `Explain the concept of ${topic} in simple terms.`,
      `What do you remember about ${topic}?`
    ],

    application: [
      `How would you apply ${topic} in a real-world scenario?`,
      `Solve a problem using ${topic}.`,
      `Give an example where ${topic} is used.`
    ],

    problem_solving: [
      `Analyze this situation using ${topic}.`,
      `What steps would you take to solve a ${topic} problem?`,
      `Break down this complex ${topic} scenario.`
    ],

    very_easy: [
      `What is ${topic}?`,
      `Choose the correct statement about ${topic}.`,
      `Identify ${topic} from the options.`
    ]
  }

  const pool = templates[questionType] || templates.basic_recall

  // =========================
  // 7. DYNAMIC QUESTION SELECTION
  // =========================

  const baseQuestion =
    pool[Math.floor(Math.random() * pool.length)]

  // =========================
  // 8. PERSONALIZATION LAYER
  // =========================

  let personalizedQuestion = baseQuestion

  if (presentationStyle === "scenario_based") {
    personalizedQuestion =
      `Imagine a real-world situation: ${baseQuestion}`
  }

  if (presentationStyle === "hint_guided") {
    personalizedQuestion =
      `${baseQuestion} (Hint: think step by step)`
  }

  if (variationBoost === "new_angle") {
    personalizedQuestion =
      `${baseQuestion} Try a different approach than before.`
  }

  // =========================
  // 9. DIFFICULTY TAGGING SYSTEM
  // =========================

  const difficultyMap = {
    easy: 30,
    medium: 60,
    hard: 85
  }

  // =========================
  // 10. PEDAGOGICAL INTENT ENGINE
  // =========================

  const intent = {
    concept: topic,
    cognitiveLevel,
    questionType,
    difficultyScore: difficultyMap[difficulty] || 50,
    learningStyle
  }

  // =========================
  // 11. FINAL OUTPUT
  // =========================

  return {
    question: personalizedQuestion,

    meta: {
      topic,
      difficulty,
      questionType,
      cognitiveLevel,
      presentationStyle,
      variationBoost
    },

    intent,

    hints: generateHints(cognitiveLevel, topic)
  }
}

// =========================
// 🧠 HINT ENGINE
// =========================

function generateHints(level, topic) {

  if (level === "remember") {
    return [`Recall the definition of ${topic}`]
  }

  if (level === "apply") {
    return [`Think about how ${topic} is used in real life`]
  }

  if (level === "analyze") {
    return [`Break ${topic} into smaller components`]
  }

  return []
}
