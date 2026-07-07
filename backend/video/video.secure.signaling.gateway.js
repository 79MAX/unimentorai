
/**
 * ==========================================
 * 🌐 SECURE SIGNALING GATEWAY
 * UniMentorAI Video System
 * ==========================================
 * Secure WebRTC signaling layer:
 * - SDP exchange
 * - ICE candidates
 * - room messaging
 * - authentication enforced
 */

const VideoTokenService = require("./video.token.service");
const VideoAuditLogger = require("./video.audit.logger");
const VideoSecurityMonitor = require("./video.security.monitor");

class SecureSignalingGateway {

  constructor(io) {
    this.io = io;

    this.activeRooms = new Map();

    this.io.use((socket, next) =>
      this.authenticateSocket(socket, next)
    );

    this.io.on("connection", (socket) =>
      this.handleConnection(socket)
    );
  }

  /**
   * ==========================================
   * SOCKET AUTHENTICATION
   * ==========================================
   */
  authenticateSocket(socket, next) {

    const token =
      socket.handshake?.auth?.token;

    if (!token) {
      return next(new Error("Missing token"));
    }

    const decoded =
      VideoTokenService.verify(token);

    if (!decoded) {
      return next(new Error("Invalid token"));
    }

    socket.user = decoded;

    next();
  }

  /**
   * ==========================================
   * CONNECTION HANDLER
   * ==========================================
   */
  handleConnection(socket) {

    const { userId, roomId } = socket.user;

    socket.join(roomId);

    this.registerRoom(roomId, socket);

    VideoAuditLogger.logRoomEvent({
      userId,
      roomId,
      action: "JOIN_SIGNALING_GATEWAY"
    });

    socket.on("signal", (data) =>
      this.handleSignal(socket, data)
    );

    socket.on("disconnect", () =>
      this.handleDisconnect(socket)
    );
  }

  /**
   * ==========================================
   * SIGNAL HANDLER (CORE RTC FLOW)
   * ==========================================
   */
  handleSignal(socket, data) {

    const { userId, roomId } = socket.user;

    if (!data || !data.type) {
      return;
    }

    /**
     * Security monitoring
     */
    VideoSecurityMonitor.ingest({
      type: "WEBRTC_EVENT",
      userId,
      roomId,
      action: data.type
    });

    switch (data.type) {

      case "offer":
      case "answer":
      case "ice-candidate":

        this.relaySignal(roomId, socket, data);
        break;

      case "chat":

        this.broadcastMessage(roomId, socket, data);
        break;

      default:

        VideoAuditLogger.logSecurityEvent({
          userId,
          roomId,
          reason: "UNKNOWN_SIGNAL_TYPE",
          severity: "warning"
        });
    }
  }

  /**
   * ==========================================
   * RELAY SIGNAL (WEBRTC CORE)
   * ==========================================
   */
  relaySignal(roomId, socket, data) {

    socket.to(roomId).emit("signal", {
      from: socket.user.userId,
      data
    });
  }

  /**
   * ==========================================
   * BROADCAST MESSAGE
   * ==========================================
   */
  broadcastMessage(roomId, socket, data) {

    this.io.to(roomId).emit("chat", {
      from: socket.user.userId,
      message: data.message,
      timestamp: Date.now()
    });

    VideoAuditLogger.logRoomEvent({
      userId: socket.user.userId,
      roomId,
      action: "CHAT_MESSAGE"
    });
  }

  /**
   * ==========================================
   * DISCONNECT HANDLER
   * ==========================================
   */
  handleDisconnect(socket) {

    const { userId, roomId } = socket.user;

    VideoAuditLogger.logRoomEvent({
      userId,
      roomId,
      action: "DISCONNECT"
    });

    socket.leave(roomId);
  }

  /**
   * ==========================================
   * ROOM REGISTRY
   * ==========================================
   */
  registerRoom(roomId, socket) {

    if (!this.activeRooms.has(roomId)) {
      this.activeRooms.set(roomId, new Set());
    }

    this.activeRooms.get(roomId).add(socket.id);
  }

  /**
   * ==========================================
   * ROOM SIZE CHECK (ANTI ABUSE)
   * ==========================================
   */
  getRoomSize(roomId) {

    return this.activeRooms.get(roomId)?.size || 0;
  }

  /**
   * ==========================================
   * BROADCAST SYSTEM MESSAGE
   * ==========================================
   */
  sendSystemMessage(roomId, message) {

    this.io.to(roomId).emit("system", {
      message,
      timestamp: Date.now()
    });
  }
}

module.exports =
  SecureSignalingGateway;
