// ======================================
// 🧠 AI LEARNING STREAM ENGINE
// UniMentorAI - REAL-TIME COGNITIVE CORE
// ======================================

export class LearningStreamEngine {

  constructor({

    graphEngine,
    websocketServer,
    logger

  }) {

    this.graphEngine = graphEngine
    this.websocketServer = websocketServer
    this.logger = logger

    this.stateStore = new Map()
  }

  // ======================================
  // 📥 PROCESS EVENT
  // ======================================

  async processEvent(event = {}) {

    try {

      this.validateEvent(event)

      const {

        userId

      } = event

      const currentState =
        this.getState(userId)

      const updatedState =
        await this.updateLearningState({

          currentState,
          event

        })

      this.stateStore.set(
        userId,
        updatedState
      )

      const graph =
        await this.recalculateGraph({

          userId,
          courseId: updatedState.courseId
        })

      const payload = {

        type: "LEARNING_STATE_UPDATED",

        timestamp: Date.now(),

        state: updatedState,

        graph
      }

      await this.broadcast(userId, payload)

      return {

        status: "UPDATED",

        payload
      }

    } catch (error) {

      this.logger?.error?.(
        "STREAM_ENGINE_ERROR",
        error
      )

      return {

        status: "ERROR",

        message: error.message
      }
    }
  }

  // ======================================
  // 🛡️ VALIDATION
  // ======================================

  validateEvent(event) {

    if (!event.userId) {

      throw new Error(
        "userId is required"
      )
    }

    if (!event.type) {

      throw new Error(
        "event.type is required"
      )
    }
  }

  // ======================================
  // 🧠 UPDATE LEARNING STATE
  // ======================================

  async updateLearningState({

    currentState,
    event

  }) {

    const next = {

      ...currentState
    }

    switch (event.type) {

      case "ANSWER_CORRECT":

        next.mastery =
          Math.min(
            100,
            (next.mastery || 0) + 5
          )

        next.engagement =
          Math.min(
            100,
            (next.engagement || 50) + 2
          )

        break

      case "ANSWER_WRONG":

        next.errorRate =
          Math.min(
            100,
            (next.errorRate || 0) + 5
          )

        break

      case "SESSION_LONG":

        next.fatigue =
          Math.min(
            100,
            (next.fatigue || 0) + 10
          )

        break

      default:
        break
    }

    next.lastEvent = event.type
    next.updatedAt = Date.now()

    return next
  }

  // ======================================
  // 🌐 RECALCULATE GRAPH
  // ======================================

  async recalculateGraph({

    userId,
    courseId

  }) {

    if (!courseId) {

      return []
    }

    return await this.graphEngine
      .markRecommendations({

        userId,
        courseId
      })
  }

  // ======================================
  // 📡 BROADCAST
  // ======================================

  async broadcast(
    userId,
    payload
  ) {

    if (
      !this.websocketServer ||
      !this.websocketServer.broadcastToUser
    ) {
      return
    }

    await this.websocketServer
      .broadcastToUser(

        userId,
        payload
      )
  }

  // ======================================
  // 📦 GET STATE
  // ======================================

  getState(userId) {

    return (

      this.stateStore.get(userId)

      ||

      {

        mastery: 0,

        difficulty: 50,

        fatigue: 0,

        engagement: 50,

        errorRate: 0,

        courseId: null
      }
    )
  }

  // ======================================
  // 📊 SNAPSHOT
  // ======================================

  getSnapshot(userId) {

    return this.getState(userId)
  }

  // ======================================
  // 🧹 CLEAR USER CACHE
  // ======================================

  clearUser(userId) {

    this.stateStore.delete(userId)
  }
}
