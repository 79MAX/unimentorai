
// ======================================
// 🧠 REAL-TIME AI LEARNING STREAM V2
// UniMentorAI - COGNITIVE STREAM BRAIN
// ======================================

export class LearningStream {

  constructor({
    bridge,
    wsServer,
    config = {}
  }) {

    this.bridge = bridge

    this.wsServer = wsServer

    this.config = config

    // 🧠 connected learners
    this.subscribers = new Map()

    // ⚡ event queue (priority system)
    this.eventQueue = []
  }

  // ======================================
  // 🚀 SUBSCRIBE USER STREAM
  // ======================================

  subscribe(userId, socket) {

    if (!this.subscribers.has(userId)) {

      this.subscribers.set(userId, new Set())
    }

    this.subscribers.get(userId).add(socket)

    // ==================================
    // RECEIVE EVENTS FROM CLIENT
    // ==================================

    socket.on("learning:event", async (event) => {

      const enriched =
        this.enrichEvent(userId, event)

      this.enqueue(enriched)

      const result =
        await this.processQueue()
      
      this.pushToClient(userId, result)
    })

    // ==================================
    // DISCONNECT HANDLING
    // ==================================

    socket.on("disconnect", () => {

      this.removeSocket(userId, socket)
    })
  }

  // ======================================
  // 🧠 EVENT ENRICHMENT LAYER
  // ======================================

  enrichEvent(userId, event) {

    return {

      userId,

      type: event.type,

      topic: event.topic || null,

      correct: event.correct || false,

      timeSpent: event.timeSpent || 0,

      timestamp: Date.now(),

      priority:
        this.computePriority(event)
    }
  }

  // ======================================
  // ⚡ PRIORITY ENGINE
  // ======================================

  computePriority(event) {

    // CRITICAL → mistake or dropout risk
    if (!event.correct) return 1

    // HIGH → slow response
    if (event.timeSpent > 60) return 2

    // NORMAL
    return 3
  }

  // ======================================
  // 🚀 QUEUE SYSTEM (BACKPRESSURE CONTROL)
  // ======================================

  enqueue(event) {

    this.eventQueue.push(event)

    // prevent overload
    if (this.eventQueue.length > 1000) {

      this.eventQueue.shift()
    }

    // sort by priority
    this.eventQueue.sort(
      (a, b) => a.priority - b.priority
    )
  }

  // ======================================
  // 🧠 PROCESS QUEUE (CORE BRAIN FLOW)
  // ======================================

  async processQueue() {

    const batch =
      this.eventQueue.splice(0, 5)

    if (batch.length === 0) return null

    // ==================================
    // SEND TO BRAIN BRIDGE
    // ==================================

    const results = []

    for (const event of batch) {

      const result =
        await this.bridge.emit(event)

      results.push(result)
    }

    return {
      processed: results.length,
      results
    }
  }

  // ======================================
  // 📡 PUSH TO CLIENT
  // ======================================

  pushToClient(userId, data) {

    const sockets =
      this.subscribers.get(userId)

    if (!sockets || !data) return

    for (const socket of sockets) {

      socket.emit("learning:update", {

        type: "STREAM_UPDATE",

        payload: data
      })
    }
  }

  // ======================================
  // 🧹 REMOVE SOCKET
  // ======================================

  removeSocket(userId, socket) {

    const sockets =
      this.subscribers.get(userId)

    if (!sockets) return

    sockets.delete(socket)

    if (sockets.size === 0) {

      this.subscribers.delete(userId)
    }
  }
}
