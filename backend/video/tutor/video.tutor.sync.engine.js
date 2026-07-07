/**
 * video.tutor.sync.engine.js
 * UniMentorAI - Real-time Synchronization Engine
 */

class VideoTutorSyncEngine {
  constructor({
    eventBus,
    logger
  }) {
    this.eventBus = eventBus;
    this.logger = logger;

    // server-authoritative state
    this.state = new Map();

    // event buffer for ordering
    this.eventBuffer = [];

    this.lastTimestamp = 0;
  }

  /**
   * 🧠 INIT SESSION STATE
   */
  initSession(sessionId, initialState = {}) {
    this.state.set(sessionId, {
      ...initialState,
      participants: {},
      lesson: {},
      updatedAt: Date.now()
    });

    this._emit("session.init", { sessionId });

    return this.state.get(sessionId);
  }

  /**
   * 📡 RECEIVE EVENT (from clients)
   */
  receiveEvent(sessionId, event) {
    const enrichedEvent = {
      ...event,
      sessionId,
      serverTime: Date.now()
    };

    this.eventBuffer.push(enrichedEvent);

    this._processBuffer(sessionId);
  }

  /**
   * 🔄 PROCESS BUFFER (ordering engine)
   */
  _processBuffer(sessionId) {
    const session = this.state.get(sessionId);
    if (!session) return;

    // sort events by timestamp (server-side correction)
    this.eventBuffer.sort(
      (a, b) => a.timestamp - b.timestamp
    );

    while (this.eventBuffer.length > 0) {
      const event = this.eventBuffer.shift();

      this._applyEvent(sessionId, session, event);
    }
  }

  /**
   * ⚙️ APPLY EVENT TO STATE
   */
  _applyEvent(sessionId, session, event) {
    switch (event.type) {

      case "participant.join":
        session.participants[event.userId] = {
          joinedAt: event.serverTime
        };
        break;

      case "participant.leave":
        delete session.participants[event.userId];
        break;

      case "lesson.progress":
        session.lesson.progress =
          event.data.progress;
        break;

      case "ai.response":
        session.lesson.lastAIResponse =
          event.data;
        break;

      default:
        this.logger.warn("Unknown event", event.type);
    }

    session.updatedAt = Date.now();

    this._broadcast(sessionId, event);
  }

  /**
   * 📡 BROADCAST TO ALL CLIENTS
   */
  _broadcast(sessionId, event) {
    this.eventBus.emit("sync.broadcast", {
      sessionId,
      event,
      state: this.state.get(sessionId)
    });
  }

  /**
   * ⚖️ RESOLVE CONFLICTS
   */
  resolveConflict(sessionId, remoteState) {
    const local = this.state.get(sessionId);

    if (!local) return remoteState;

    // simple merge strategy (can evolve to CRDT later)
    const merged = {
      ...local,
      ...remoteState,
      participants: {
        ...local.participants,
        ...remoteState.participants
      },
      updatedAt: Date.now()
    };

    this.state.set(sessionId, merged);

    return merged;
  }

  /**
   * ⏱ CLOCK DRIFT CORRECTION
   */
  correctTimestamp(event) {
    const now = Date.now();

    const drift = now - event.timestamp;

    if (Math.abs(drift) > 1000) {
      event.timestamp = now;
    }

    return event;
  }

  /**
   * 📊 GET SESSION STATE
   */
  getState(sessionId) {
    return this.state.get(sessionId) || null;
  }

  /**
   * 📡 EVENT EMITTER
   */
  _emit(type, payload) {
    this.eventBus.emit("sync.event", {
      type,
      ...payload,
      timestamp: Date.now()
    });
  }
}

module.exports =
  VideoTutorSyncEngine;
