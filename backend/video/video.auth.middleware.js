
/**
 * ==========================================
 * 🔐 VIDEO AUTH MIDDLEWARE
 * UniMentorAI Secure Video System
 * ==========================================
 * Protects video rooms, signaling & WebRTC access
 */

const VideoTokenService = require("./video.token.service");
const VideoRoomSecurity = require("./video.room.security");

class VideoAuthMiddleware {

  /**
   * ==========================================
   * MAIN AUTH CHECK
   * ==========================================
   */
  async authenticate(req, res, next) {

    try {

      const token =
        this.extractToken(req);

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Missing video access token"
        });
      }

      const decoded =
        VideoTokenService.verify(token);

      if (!decoded) {
        return res.status(401).json({
          success: false,
          message: "Invalid or expired video token"
        });
      }

      const isAllowed =
        await VideoRoomSecurity.validateAccess({
          userId: decoded.userId,
          roomId: decoded.roomId,
          role: decoded.role
        });

      if (!isAllowed) {
        return res.status(403).json({
          success: false,
          message: "Access denied to video room"
        });
      }

      /**
       * Attach secure session context
       */
      req.videoSession = {
        userId: decoded.userId,
        roomId: decoded.roomId,
        role: decoded.role,
        permissions: decoded.permissions || []
      };

      next();

    } catch (error) {

      return res.status(500).json({
        success: false,
        message: "Video authentication error",
        error: error.message
      });
    }
  }

  /**
   * ==========================================
   * TOKEN EXTRACTION
   * ==========================================
   */
  extractToken(req) {

    return (
      req.headers["x-video-token"] ||
      req.headers["authorization"]?.replace("Bearer ", "") ||
      req.query.token ||
      null
    );
  }

  /**
   * ==========================================
   * SOCKET AUTH (REALTIME)
   * ==========================================
   */
  authenticateSocket(socket, next) {

    try {

      const token =
        socket.handshake?.auth?.token;

      if (!token) {
        return next(
          new Error("Missing video token")
        );
      }

      const decoded =
        VideoTokenService.verify(token);

      if (!decoded) {
        return next(
          new Error("Invalid video token")
        );
      }

      socket.videoSession = {
        userId: decoded.userId,
        roomId: decoded.roomId,
        role: decoded.role
      };

      next();

    } catch (error) {

      next(new Error("Socket auth failed"));
    }
  }
}

module.exports = new VideoAuthMiddleware();
