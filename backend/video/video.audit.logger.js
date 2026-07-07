
/**
 * ==========================================
 * 📊 VIDEO AUDIT LOGGER
 * UniMentorAI Video System
 * ==========================================
 * Tracks all critical events in video system
 * for security, analytics, billing, and AI
 */

const fs = require("fs");
const path = require("path");

class VideoAuditLogger {

  constructor() {
    this.logs = [];
    this.logFile =
      path.join(__dirname, "video.audit.log.json");
  }

  /**
   * ==========================================
   * MAIN LOG EVENT
   * ==========================================
   */
  log(event) {

    const entry = {
      id: this.generateId(),
      timestamp: Date.now(),
      type: event.type || "UNKNOWN",
      userId: event.userId || null,
      roomId: event.roomId || null,
      sessionId: event.sessionId || null,

      action: event.action || null,
      status: event.status || "info",

      metadata: event.metadata || {}
    };

    this.logs.push(entry);

    this.persist(entry);

    return entry;
  }

  /**
   * ==========================================
   * ROOM EVENTS
   * ==========================================
   */
  logRoomEvent({ userId, roomId, action, metadata }) {

    return this.log({
      type: "ROOM_EVENT",
      userId,
      roomId,
      action,
      metadata
    });
  }

  /**
   * ==========================================
   * SESSION EVENTS
   * ==========================================
   */
  logSessionEvent({ userId, sessionId, action, metadata }) {

    return this.log({
      type: "SESSION_EVENT",
      userId,
      sessionId,
      action,
      metadata
    });
  }

  /**
   * ==========================================
   * SECURITY EVENTS
   * ==========================================
   */
  logSecurityEvent({ userId, roomId, reason, severity }) {

    return this.log({
      type: "SECURITY_EVENT",
      userId,
      roomId,
      action: "SECURITY_ALERT",
      status: severity || "warning",
      metadata: {
        reason
      }
    });
  }

  /**
   * ==========================================
   * WEBRTC EVENTS
   * ==========================================
   */
  logWebRTCEvent({ userId, roomId, action }) {

    return this.log({
      type: "WEBRTC_EVENT",
      userId,
      roomId,
      action
    });
  }

  /**
   * ==========================================
   * ACCESS EVENTS
   * ==========================================
   */
  logAccessEvent({ userId, roomId, success, reason }) {

    return this.log({
      type: "ACCESS_EVENT",
      userId,
      roomId,
      action: success ? "ACCESS_GRANTED" : "ACCESS_DENIED",
      status: success ? "success" : "failed",
      metadata: {
        reason
      }
    });
  }

  /**
   * ==========================================
   * ANALYTICS EVENTS (FOR AI ENGINE)
   * ==========================================
   */
  logAnalyticsEvent(data) {

    return this.log({
      type: "ANALYTICS_EVENT",
      ...data
    });
  }

  /**
   * ==========================================
   * PERSIST LOGS
   * ==========================================
   */
  persist(entry) {

    try {

      fs.appendFileSync(
        this.logFile,
        JSON.stringify(entry) + "\n"
      );

    } catch (error) {

      console.error(
        "Audit log persistence failed:",
        error.message
      );
    }
  }

  /**
   * ==========================================
   * QUERY LOGS
   * ==========================================
   */
  query(filter = {}) {

    return this.logs.filter(log => {

      return Object.keys(filter).every(key =>
        log[key] === filter[key]
      );
    });
  }

  /**
   * ==========================================
   * SECURITY ANALYSIS
   * ==========================================
   */
  detectAnomalies() {

    const suspicious = [];

    const accessFailures =
      this.logs.filter(l =>
        l.type === "ACCESS_EVENT" &&
        l.status === "failed"
      );

    if (accessFailures.length > 10) {
      suspicious.push("HIGH_ACCESS_FAILURE_RATE");
    }

    return suspicious;
  }

  /**
   * ==========================================
   * ID GENERATOR
   * ==========================================
   */
  generateId() {

    return (
      "audit_" +
      Date.now() +
      "_" +
      Math.random()
        .toString(36)
        .slice(2, 10)
    );
  }
}

module.exports =
  new VideoAuditLogger();
