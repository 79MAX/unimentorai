
/**
 * ==========================================
 * 🛡️ VIDEO ACCESS GUARD
 * UniMentorAI Secure Video System
 * ==========================================
 * Controls permissions inside video rooms
 */

class VideoAccessGuard {

  /**
   * ==========================================
   * MAIN ACCESS VALIDATION
   * ==========================================
   */
  async canAccess({ userId, roomId, role, action }) {

    const room =
      await this.getRoom(roomId);

    if (!room) {
      return {
        allowed: false,
        reason: "ROOM_NOT_FOUND"
      };
    }

    /**
     * 1. Check membership
     */
    const isMember =
      room.participants.includes(userId);

    if (!isMember && role !== "host") {
      return {
        allowed: false,
        reason: "NOT_ROOM_MEMBER"
      };
    }

    /**
     * 2. Role-based permissions
     */
    const roleCheck =
      this.checkRolePermissions(role, action);

    if (!roleCheck.allowed) {
      return roleCheck;
    }

    /**
     * 3. Room state validation
     */
    if (room.status === "locked") {
      return {
        allowed: false,
        reason: "ROOM_LOCKED"
      };
    }

    /**
     * 4. Capacity check
     */
    if (
      room.participants.length >=
      room.maxCapacity
    ) {
      return {
        allowed: false,
        reason: "ROOM_FULL"
      };
    }

    return {
      allowed: true,
      reason: "ACCESS_GRANTED"
    };
  }

  /**
   * ==========================================
   * ROLE PERMISSIONS ENGINE
   * ==========================================
   */
  checkRolePermissions(role, action) {

    const permissions = {

      host: [
        "join",
        "mute_all",
        "kick_user",
        "start_stream",
        "end_stream",
        "record"
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

    const allowedActions =
      permissions[role] || [];

    if (!allowedActions.includes(action)) {
      return {
        allowed: false,
        reason: "ACTION_NOT_ALLOWED",
        role,
        action
      };
    }

    return {
      allowed: true
    };
  }

  /**
   * ==========================================
   * ROOM FETCH (SIMPLIFIED HOOK)
   * ==========================================
   */
  async getRoom(roomId) {

    // 🔁 Replace with DB / Redis in production
    return global.videoRooms?.get(roomId);
  }

  /**
   * ==========================================
   * SPECIAL RULES ENGINE
   * ==========================================
   */
  applySpecialRules({ userId, room, action }) {

    /**
     * Example rules:
     * - banned users
     * - VIP access
     * - paid sessions
     */

    if (room.bannedUsers?.includes(userId)) {
      return {
        allowed: false,
        reason: "USER_BANNED"
      };
    }

    if (room.paidOnly && !room.paidUsers?.includes(userId)) {
      return {
        allowed: false,
        reason: "PAYMENT_REQUIRED"
      };
    }

    return {
      allowed: true
    };
  }
}

module.exports = new VideoAccessGuard();
