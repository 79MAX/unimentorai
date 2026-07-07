// ======================================
// 🧠 AI LEARNING STREAM GATEWAY
// UniMentorAI - REAL-TIME ENTRY POINT
// ======================================

export class LearningStreamGateway {

  constructor({

    streamEngine,
    websocketServer,
    logger

  }) {

    this.streamEngine = streamEngine
    this.websocketServer = websocketServer
    this.logger = logger
  }

  // ======================================
  // 📥 RECEIVE EVENT
  // ======================================

  async receive(event = {}) {

    try {

      this.validateEvent(event)

      const result =
        await this.streamEngine.processEvent(
          event
        )

      return result

    } catch (error) {

      this.logger?.error?.(
        "STREAM_GATEWAY_RECEIVE_ERROR",
        error
      )

      return {

        status: "ERROR",

        message: error.message
      }
    }
  }

  // ======================================
  // 📡 SUBSCRIBE USER
  // ======================================

  subscribe({

    userId,
    socket

  }) {

    if (
      !userId ||
      !socket
    ) {

      throw new Error(
        "INVALID_SUBSCRIPTION"
      )
    }

    this.websocketServer.registerUser(
      userId,
      socket
    )

    return {

      status: "SUBSCRIBED",

      userId
    }
  }

  // ======================================
  // 🔌 UNSUBSCRIBE USER
  // ======================================

  unsubscribe({

    userId,
    socketId

  }) {

    this.websocketServer.unregisterUser(
      userId,
      socketId
    )

    return {

      status: "UNSUBSCRIBED",

      userId
    }
  }

  // ======================================
  // 📊 GET SNAPSHOT
  // ======================================

  async getSnapshot({

    userId

  }) {

    const snapshot =
      this.streamEngine.getSnapshot(
        userId
      )

    return {

      status: "OK",

      data: snapshot
    }
  }

  // ======================================
  // 🌐 GET GRAPH SNAPSHOT
  // ======================================

  async getGraphSnapshot({

    userId,
    courseId

  }) {

    const graph =
      await this.streamEngine
        .recalculateGraph({

          userId,
          courseId
        })

    return {

      status: "OK",

      data: graph
    }
  }

  // ======================================
  // 📤 MANUAL PUSH
  // ======================================

  async push({

    userId,
    payload

  }) {

    await this.websocketServer
      .broadcastToUser(

        userId,
        payload
      )

    return {

      status: "PUSHED"
    }
  }

  // ======================================
  // 📡 SYSTEM BROADCAST
  // ======================================

  async broadcast(payload) {

    await this.websocketServer
      .broadcast(payload)

    return {

      status: "BROADCASTED"
    }
  }

  // ======================================
  // 🛡️ EVENT VALIDATION
  // ======================================

  validateEvent(event) {

    if (!event) {

      throw new Error(
        "EVENT_REQUIRED"
      )
    }

    if (!event.userId) {

      throw new Error(
        "USER_ID_REQUIRED"
      )
    }

    if (!event.type) {

      throw new Error(
        "EVENT_TYPE_REQUIRED"
      )
    }
  }

  // ======================================
  // 📈 HEALTH CHECK
  // ======================================

  getHealth() {

    return {

      status: "UP",

      engine:
        !!this.streamEngine,

      websocket:
        !!this.websocketServer,

      timestamp:
        Date.now()
    }
  }
}
