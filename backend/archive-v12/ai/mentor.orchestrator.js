import { LearningEngineBridge } from "./learning.engine.bridge.js"
import { getSession } from "./learning-engine/memory/session.memory.engine.js"

// =========================
// 🧠 MENTOR ORCHESTRATOR AI
// UNI MENTOR AI GLOBAL BRAIN
// =========================

export const MentorOrchestrator = async ({
  user,
  lesson,
  answer,
  language = "en",
  mode = "learning", // learning | quiz | exam | chat
  dbUpdateFn
}) => {

  try {

    // =========================
    // 1. LOAD USER CONTEXT
    // =========================

    const session = getSession(user.id)

    const userLevel =
      session?.analytics?.avgScore > 80
        ? "advanced"
        : session?.analytics?.avgScore > 50
        ? "intermediate"
        : "beginner"

    const fatigue = session?.analytics?.engagement?.fatigueLevel || 0

    // =========================
    // 2. ADAPTIVE MENTOR PERSONALITY
    // =========================

    const mentorPersona = {
      beginner: {
        tone: "simple",
        explanationDepth: "high",
        patience: "very_high"
      },
      intermediate: {
        tone: "structured",
        explanationDepth: "medium",
        patience: "medium"
      },
      advanced: {
        tone: "concise",
        explanationDepth: "low",
        patience: "low"
      }
    }[userLevel]

    // =========================
    // 3. LANGUAGE ADAPTATION
    // =========================

    const localizedSystemPrompt = {
      en: "You are an AI mentor helping a student learn step by step.",
      fr: "Tu es un mentor IA qui aide un étudiant à apprendre progressivement.",
      es: "Eres un mentor IA que ayuda a un estudiante a aprender paso a paso.",
      pt: "Você é um mentor de IA ajudando um estudante a aprender passo a passo."
    }

    const systemMessage =
      localizedSystemPrompt[language] ||
      localizedSystemPrompt.en

    // =========================
    // 4. CALL LEARNING ENGINE (CORE BRAIN)
    // =========================

    const learningResult = await LearningEngineBridge({
      user,
      lesson,
      answer,
      dbUpdateFn
    })

    // =========================
    // 5. MENTOR RESPONSE GENERATION
    // =========================

    const response = generateMentorResponse({
      systemMessage,
      mentorPersona,
      learningResult,
      fatigue,
      mode
    })

    // =========================
    // 6. RETURN FINAL ORCHESTRATED OUTPUT
    // =========================

    return {
      success: true,

      user: {
        id: user.id,
        level: userLevel,
        language
      },

      mentor: {
        persona: mentorPersona,
        message: response
      },

      learning: learningResult,

      mode,

      nextAction: learningResult.nextStep
    }

  } catch (error) {

    console.error("❌ Mentor Orchestrator Error:", error)

    return {
      success: false,
      fallback: {
        message:
          "I encountered an issue, but let's continue learning together.",
        nextAction: {
          type: "retry"
        }
      }
    }
  }
}

// =========================
// 🧠 RESPONSE GENERATOR (MENTOR STYLE ENGINE)
// =========================

function generateMentorResponse({
  systemMessage,
  mentorPersona,
  learningResult,
  fatigue,
  mode
}) {

  let baseMessage = systemMessage + "\n\n"

  // fatigue handling
  if (fatigue > 70) {
    return baseMessage +
      "You seem tired. Let's take a short break or review gently."
  }

  // mode adaptation
  if (mode === "exam") {
    return baseMessage +
      "Focus mode activated. Answer precisely and carefully."
  }

  if (mode === "quiz") {
    return baseMessage +
      "Let's test your understanding with a quick question."
  }

  // personality adaptation
  if (mentorPersona.tone === "simple") {
    return baseMessage +
      "I'll explain this step by step in a very simple way."
  }

  if (mentorPersona.tone === "structured") {
    return baseMessage +
      "Let's break this down into clear steps."
  }

  return baseMessage +
    "Let's go deeper into this concept efficiently."
}
