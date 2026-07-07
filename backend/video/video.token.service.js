
/**
 * ==========================================
 * 🔑 VIDEO TOKEN SERVICE
 * UniMentorAI Secure Video System
 * ==========================================
 * Generates and verifies secure access tokens
 * for video rooms (WebRTC + signaling)
 */

const crypto = require("crypto");

class VideoTokenService {

  /**
   * ==========================================
   * GENERATE SECURE VIDEO TOKEN
   * ==========================================
   */
  generate({ userId, roomId, role = "student", ttl = 60 * 60 }) {

    const payload = {
      userId,
      roomId,
      role,
      permissions: this.getPermissions(role),

      issuedAt: Date.now(),
      expiresAt: Date.now() + ttl * 1000
    };

    const base64Payload =
      Buffer.from(JSON.stringify(payload)).toString("base64");

    const signature =
      this.sign(base64Payload);

    return `${base64Payload}.${signature}`;
  }

  /**
   * ==========================================
   * VERIFY TOKEN
   * ==========================================
   */
  verify(token) {

    try {

      const [payloadEncoded, signature] =
        token.split(".");

      if (!payloadEncoded || !signature) {
        return null;
      }

      const expectedSignature =
        this.sign(payloadEncoded);

      if (expectedSignature !== signature) {
        return null;
      }

      const payload =
        JSON.parse(
          Buffer.from(payloadEncoded, "base64").toString()
        );

      if (Date.now() > payload.expiresAt) {
        return null;
      }

      return payload;

    } catch (error) {

      return null;
    }
  }

  /**
   * ==========================================
   * SIGNATURE ENGINE (SECURITY CORE)
   * ==========================================
   */
  sign(data) {

    const secret =
      process.env.VIDEO_TOKEN_SECRET ||
      "default_secret_change_me";

    return crypto
      .createHmac("sha256", secret)
      .update(data)
      .digest("hex");
  }

  /**
   * ==========================================
   * ROLE PERMISSIONS SYSTEM
   * ==========================================
   */
  getPermissions(role) {

    const permissions = {

      host: [
        "join",
        "mute_all",
        "kick_user",
        "start_stream",
        "end_stream",
        "record",
        "share_screen"
      ],

      mentor: [
        "join",
        "start_stream",
        "share_screen",
        "record"
      ],

      student: [
        "join",
        "share_screen_request"
      ],

      guest: [
        "join"
      ]
    };

    return permissions[role] || ["join"];
  }

  /**
   * ==========================================
   * REFRESH TOKEN (EXTEND SESSION)
   * ==========================================
   */
  refresh(token, extraTime = 60 * 60) {

    const decoded =
      this.verify(token);

    if (!decoded) {
      return null;
    }

    return this.generate({
      userId: decoded.userId,
      roomId: decoded.roomId,
      role: decoded.role,
      ttl: extraTime
    });
  }

  /**
   * ==========================================
   * DECODE WITHOUT VALIDATION (DEBUG ONLY)
   * ==========================================
   */
  decodeUnsafe(token) {

    try {

      const [payloadEncoded] =
        token.split(".");

      return JSON.parse(
        Buffer.from(payloadEncoded, "base64").toString()
      );

    } catch (error) {

      return null;
    }
  }
}

module.exports =
  new VideoTokenService();
