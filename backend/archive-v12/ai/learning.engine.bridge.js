import { LearningOrchestrator } from "./learning.orchestrator.js"
import { trackLearningEvent } from "./analytics/learning.analytics.js"
import { generateNextStep } from "./recommendation/recommendation.engine.js"
import { getSession } from "./memory/session.memory.engine.js"

// =========================
// 🔗 AI LEARNING ENGINE BRIDGE
// UNI MENTOR AI CORE CONNECTOR
// =========================

export const LearningEngineBridge = async ({
  user,
  lesson,
  answer,
  dbUpdateFn // MongoDB hook injection
}) => {

  try {

    // =========================
    // 1. LOAD SESSION MEMORY
    // =========================

    const session = getSession(user.id)

    // =========================
    // 2. RUN ORCHESTRATOR (CORE BRAIN)
    // =========================

    const orchestration = await LearningOrchestrator({
      user,
      lesson,
      answer,
      history: session?.history || []
    })

    // =========================
    // 3. TRACK ANALYTICS
    // =========================

    const analytics = await trackLearningEvent({
      userId: user.id,
      lessonId: lesson.id,
      score: orchestration.mastery.masteryLevel,
      timeSpent: session?.timeSpent || 0,
      attempt: session?.attempt || 1,
      metadata: {
        difficulty: orchestration.difficulty,
        errorType: orchestration.feedback?.errorType
      }
    })

    // =========================
    // 4. GET NEXT STEP (ADAPTIVE AI)
    // =========================

    const nextStep = await generateNextStep({
      user,
      lesson,
      mastery: orchestration.mastery,
      difficulty: orchestration.difficulty,
      history: session?.history || []
    })

    // =========================
    // 5. UPDATE DATABASE (PERSISTENCE LAYER)
    // =========================

    if (dbUpdateFn) {
      await dbUpdateFn(user.id, {
        mastery: orchestration.mastery,
        analytics: analytics.snapshot,
        lastLesson: lesson.id,
        nextStep,
        updatedAt: new Date()
      })
    }

    // =========================
    // 6. UPDATE SESSION MEMORY
    // =========================

    session.history = [
      ...(session.history || []),
      {
        lessonId: lesson.id,
        answer,
        score: orchestration.mastery.masteryLevel,
        timestamp: Date.now()
      }
    ]

    // =========================
    // 7. RETURN FULL AI CONTEXT
    // =========================

    return {
      success: true,
      userId: user.id,
      lessonId: lesson.id,

      // AI CORE RESULTS
      mastery: orchestration.mastery,
      difficulty: orchestration.difficulty,
      feedback: orchestration.feedback,

      // NEXT ACTION
      nextStep,

      // ANALYTICS INSIGHT
      insights: analytics.insights,

      // SYSTEM STATE
      session
    }

  } catch (error) {

    console.error("❌ Learning Engine Bridge Error:", error)

    return {
      success: false,
      error: "Learning engine failed",
      fallback: {
        nextStep: {
          type: "lesson",
          action: "retry"
        }
      }
    }
  }
}
