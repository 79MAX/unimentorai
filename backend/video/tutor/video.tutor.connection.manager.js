/**
 * video.tutor.connection.manager.js
 * UniMentorAI - Connection Lifecycle & Session Manager
 */

class VideoTutorConnectionManager {
  constructor({
    eventBus,
    logger,
    signalingClient
  }) {
    this.eventBus = eventBus;
    this.logger = logger;
    this.signaling = signalingClient;

    // userId -> connection state
    this.connections = new Map();

    // sessionId -> users
    this.sessions = new Map();
  }

  /**
   * 🔌 CONNECT USER
   */
  connect(userId, sessionId) {
    const connection = {
      userId,
      sessionId,
      status: "connecting",
      retries: 0,
      lastSeen: Date.now()
    };

    this.connections.set(userId, connection);

    this._registerToSession(userId, sessionId);

    this._emit("connection.started", connection);

    return connection;
  }

  /**
   * 👥 REGISTER USER IN SESSION
   */
  _registerToSession(userId, sessionId) {
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, new Set());
    }

    this.sessions.get(sessionId).add(userId);
  }

  /**
   * ✅ MARK AS READY
   */
  markReady(userId) {
    const conn = this.connections.get(userId);
    if (!conn) return;

    conn.status = "connected";
    conn.lastSeen = Date.now();

    this._emit("connection.ready", conn);
  }

  /**
   * 🔁 HANDLE DISCONNECT
   */
  disconnect(userId) {
    const conn = this.connections.get(userId);

    if (!conn) return;

    conn.status = "disconnected";
    conn.lastSeen = Date.now();

    this._emit("connection.disconnected", conn);

    // cleanup from session
    const session = this.sessions.get(conn.sessionId);
    if (session) {
      session.delete(userId);
    }
  }

  /**
   * 🔄 RECONNECT STRATEGY
   */
  async reconnect(userId) {
    const conn = this.connections.get(userId);

    if (!conn) return;

    conn.retries += 1;

    const delay = Math.min(
      1000 * Math.pow(2, conn.retries),
      30000
    );

    await new Promise(r => setTimeout(r, delay));

    this._emit("connection.reconnecting", conn);

    this.signaling.send({
      type: "reconnect-request",
      userId,
      sessionId: conn.sessionId
    });

    conn.status = "reconnecting";
  }

  /**
   * ⚠️ HEARTBEAT UPDATE
   */
  heartbeat(userId) {
    const conn = this.connections.get(userId);

    if (!conn) return;

    conn.lastSeen = Date.now();
    conn.status = "connected";
  }

  /**
   * 🧹 CLEANUP DEAD CONNECTIONS
   */
  cleanup(timeout = 30000) {
    const now = Date.now();

    for (const [userId, conn] of this.connections) {
      if (now - conn.lastSeen > timeout) {
        this.disconnect(userId);

        this._emit("connection.expired", conn);
      }
    }
  }

  /**
   * 📡 SESSION STATE
   */
  getSessionUsers(sessionId) {
    return Array.from(
      this.sessions.get(sessionId) || []
    );
  }

  /**
   * 📊 CONNECTION STATE
   */
  getConnection(userId) {
    return this.connections.get(userId) || null;
  }

  /**
   * 📡 EVENT EMITTER
   */
  _emit(type, payload) {
    this.eventBus.emit("connection.event", {
      type,
      ...payload,
      timestamp: Date.now()
    });
  }
}

module.exports =
  VideoTutorConnectionManager;
