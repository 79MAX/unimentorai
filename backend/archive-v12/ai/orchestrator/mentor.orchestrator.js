
// =========================
// 🧠 MENTOR ORCHESTRATOR V3
// UNI MENTOR AI PEDAGOGICAL PERSONALITY ENGINE
// =========================

import { learningOrchestrator } from "./learning.orchestrator.js"

// =========================
// MAIN MENTOR ENGINE
// =========================

export async function mentorOrchestrator({
  user,
  lesson,
  answer
}) {

  // =========================
  // 1. CALL CORE LEARNING BRAIN
  // =========================

  const learningData = await learningOrchestrator({
    user,
    lesson,
    answer
  })

  // =========================
  // 2. STUDENT STATE EXTRACTION
  // =========================

  const state = learningData.learningState
  const mastery = learningData.mastery.masteryLevel
  const confusion = learningData.cognitiveHealth.confusion
  const fatigue = learningData.cognitiveHealth.fatigue

  // =========================
  // 3. MENTOR PERSONALITY ENGINE
  // =========================

  const mentorPersona = buildMentorPersona({
    mastery,
    state,
    fatigue
  })

  // =========================
  // 4. PEDAGOGICAL STRATEGY ENGINE
  // =========================

  const teachingStrategy = selectTeachingStrategy({
    state,
    mastery,
    confusion
  })

  // =========================
  // 5. RESPONSE GENERATION ENGINE
  // =========================

  const response = generateMentorResponse({
    learningData,
    mentorPersona,
    teachingStrategy
  })

  // =========================
  // 6. ADAPTIVE EXPLANATION ENGINE
  // =========================

  const explanation = generateExplanation({
    lesson,
    mastery,
    teachingStrategy
  })

  // =========================
  // 7. MOTIVATION ENGINE
  // =========================

  const motivation = generateMotivation({
    state,
    mastery,
    fatigue
  })

  // =========================
  // 8. FINAL TUTOR OUTPUT
  // =========================

  return {
    userId: user.id,

    learningData,

    mentor: {
      persona: mentorPersona,
      strategy: teachingStrategy,
      explanation,
      motivation,
      response
    },

    nextStep: learningData.nextQuestion,

    signals: {
      shouldEncourage: fatigue > 60,
      shouldSimplify: mastery < 40,
      shouldChallenge: mastery > 75,
      shouldSlowDown: confusion > 60,
      shouldSpeedUp: state === "flow"
    }
  }
}

// =========================
// 🧠 MENTOR PERSONA ENGINE
// =========================

function buildMentorPersona({ mastery, state, fatigue }) {

  if (fatigue > 70) {
    return {
      tone: "calm",
      style: "supportive",
      intensity: "low",
      personality: "patient_mentor"
    }
  }

  if (mastery > 80 && state === "flow") {
    return {
      tone: "energetic",
      style: "challenging",
      intensity: "high",
      personality: "elite_coach"
    }
  }

  if (mastery < 40) {
    return {
      tone: "simple",
      style: "step_by_step",
      intensity: "low",
      personality: "beginner_teacher"
    }
  }

  return {
    tone: "neutral",
    style: "structured",
    intensity: "medium",
    personality: "standard_mentor"
  }
}

// =========================
// 🧠 TEACHING STRATEGY ENGINE
// =========================

function selectTeachingStrategy({ state, mastery, confusion }) {

  if (state === "recovery") {
    return "re_teach_basics"
  }

  if (confusion > 70) {
    return "guided_step_by_step"
  }

  if (state === "flow") {
    return "accelerated_learning"
  }

  if (mastery > 75) {
    return "challenge_mode"
  }

  return "standard_teaching"
}

// =========================
// 🧠 RESPONSE GENERATION ENGINE
// =========================

function generateMentorResponse({
  learningData,
  mentorPersona,
  teachingStrategy
}) {

  const base = learningData.feedback || "Let's continue learning."

  if (mentorPersona.personality === "patient_mentor") {
    return `Take your time. ${base}`
  }

  if (mentorPersona.personality === "elite_coach") {
    return `Excellent progress. Now let's push further. ${base}`
  }

  if (mentorPersona.personality === "beginner_teacher") {
    return `Let's go step by step. ${base}`
  }

  return base
}

// =========================
// 🧠 EXPLANATION ENGINE
// =========================

function generateExplanation({ lesson, mastery, teachingStrategy }) {

  if (teachingStrategy === "re_teach_basics") {
    return `We will revisit the fundamentals of ${lesson.topic}.`
  }

  if (teachingStrategy === "guided_step_by_step") {
    return `Let's break ${lesson.topic} into small steps.`
  }

  if (teachingStrategy === "challenge_mode") {
    return `Try solving a more advanced version of ${lesson.topic}.`
  }

  return `Here is how ${lesson.topic} works.`
}

// =========================
// 🧠 MOTIVATION ENGINE
// =========================

function generateMotivation({ state, mastery, fatigue }) {

  if (fatigue > 70) {
    return "You are doing well. Let's slow down a bit."
  }

  if (mastery > 85) {
    return "You are mastering this topic at an advanced level!"
  }

  if (state === "flow") {
    return "You are in a great learning rhythm!"
  }

  return "Keep going, you're improving step by step."
}
