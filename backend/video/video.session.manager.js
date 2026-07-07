
/**
 * ==========================================
 * 🎥 VIDEO SESSION MANAGER
 * UniMentorAI Secure Video System
 * ==========================================
 * Manages live video sessions lifecycle
 */

class VideoSessionManager {

  constructor() {
    this.sessions = new Map();
  }

  /**
   * ==========================================
   * CREATE SESSION
   * ==========================================
   */
  createSession({ roomId, hostId }) {

    const sessionId =
      this.generateSessionId();

    const session = {
      sessionId,
      roomId,
      hostId,

      participants: new Set(),
      status: "active",

      startedAt: Date.now(),
      endedAt: null,

      metadata: {
        totalJoins: 0,
        totalLeaves: 0
      }
    };

    this.sessions.set(sessionId, session);

    return session;
  }

  /**
   * ==========================================
   * JOIN SESSION
   * ==========================================
   */
  joinSession({ sessionId, userId }) {

    const session =
      this.sessions.get(sessionId);

    if (!session) {
      throw new Error("Session not found");
    }

    session.participants.add(userId);

    session.metadata.totalJoins++;

    return session;
  }

  /**
   * ==========================================
   * LEAVE SESSION
   * ==========================================
   */
  leaveSession({ sessionId, userId }) {

    const session =
      this.sessions.get(sessionId);

    if (!session) {
      return null;
    }

    session.participants.delete(userId);

    session.metadata.totalLeaves++;

    return session;
  }

  /**
   * ==========================================
   * END SESSION
   * ==========================================
   */
  endSession(sessionId) {

    const session =
      this.sessions.get(sessionId);

    if (!session) {
      return null;
    }

    session.status = "ended";
    session.endedAt = Date.now();

    return session;
  }

  /**
   * ==========================================
   * GET SESSION
   * ==========================================
   */
  getSession(sessionId) {

    return this.sessions.get(sessionId);
  }

  /**
   * ==========================================
   * SESSION HEALTH METRICS
   * ==========================================
   */
  getSessionMetrics(sessionId) {

    const session =
      this.sessions.get(sessionId);

    if (!session) {
      return null;
    }

    const duration =
      session.endedAt
        ? session.endedAt - session.startedAt
        : Date.now() - session.startedAt;

    return {
      sessionId,
      duration,

      participantsCount:
        session.participants.size,

      totalJoins:
        session.metadata.totalJoins,

      totalLeaves:
        session.metadata.totalLeaves,

      status: session.status
    };
  }

  /**
   * ==========================================
   * ACTIVE SESSIONS LIST
   * ==========================================
   */
  getActiveSessions() {

    return Array.from(
      this.sessions.values()
    ).filter(
      s => s.status === "active"
    );
  }

  /**
   * ==========================================
   * SESSION CLEANUP (IMPORTANT)
   * ==========================================
   */
  cleanupEndedSessions() {

    for (const [id, session] of this.sessions) {

      if (
        session.status === "ended" &&
        Date.now() - session.endedAt > 3600000
      ) {
        this.sessions.delete(id);
      }
    }
  }

  /**
   * ==========================================
   * SESSION ID GENERATOR
   * ==========================================
   */
  generateSessionId() {

    return (
      "sess_" +
      Date.now() +
      "_" +
      Math.random()
        .toString(36)
        .slice(2, 10)
    );
  }
}

module.exports =
  new VideoSessionManager();
