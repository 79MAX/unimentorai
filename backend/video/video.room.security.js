
/**
 * ==========================================
 * 🛡️ VIDEO ROOM SECURITY ENGINE
 * UniMentorAI Secure Video System
 * ==========================================
 * Ensures integrity, rules, and trust inside rooms
 */

class VideoRoomSecurity {

  /**
   * ==========================================
   * ACCESS VALIDATION ENTRYPOINT
   * ==========================================
   */
  async validateAccess({ userId, roomId, role }) {

    const room =
      await this.getRoom(roomId);

    if (!room) {
      return false;
    }

    /**
     * 1. Banned users check
     */
    if (room.bannedUsers?.includes(userId)) {
      return false;
    }

    /**
     * 2. Invite-only rooms
     */
    if (
      room.type === "invite_only" &&
      !room.allowedUsers?.includes(userId) &&
      role !== "host"
    ) {
      return false;
    }

    /**
     * 3. Paid room validation
     */
    if (
      room.isPaid &&
      !room.paidUsers?.includes(userId) &&
      role !== "host"
    ) {
      return false;
    }

    /**
     * 4. Room time validity
     */
    if (room.schedule) {

      const now = Date.now();

      if (
        now < room.schedule.start ||
        now > room.schedule.end
      ) {
        return false;
      }
    }

    /**
     * 5. Max capacity enforcement
     */
    if (
      room.participants.length >=
      room.maxCapacity
    ) {
      return false;
    }

    return true;
  }

  /**
   * ==========================================
   * ROOM INTEGRITY CHECK
   * ==========================================
   */
  validateRoomIntegrity(room) {

    const issues = [];

    if (!room.roomId) {
      issues.push("MISSING_ROOM_ID");
    }

    if (!room.hostId) {
      issues.push("MISSING_HOST");
    }

    if (room.maxCapacity <= 0) {
      issues.push("INVALID_CAPACITY");
    }

    if (!room.status) {
      issues.push("MISSING_STATUS");
    }

    return {
      valid: issues.length === 0,
      issues
    };
  }

  /**
   * ==========================================
   * ANTI ABUSE DETECTION
   * ==========================================
   */
  detectAbuse({ userId, room }) {

    const flags = [];

    /**
     * 1. Rapid join/leave spam
     */
    if (room.activityLog?.[userId]?.length > 10) {
      flags.push("JOIN_LEAVE_SPAM");
    }

    /**
     * 2. Multiple device detection
     */
    if (room.activeSessions?.[userId] > 2) {
      flags.push("MULTI_DEVICE_ABUSE");
    }

    /**
     * 3. Unauthorized attempts
     */
    if (room.failedAccessAttempts?.[userId] > 5) {
      flags.push("ACCESS_BRUTE_FORCE");
    }

    return {
      suspicious: flags.length > 0,
      flags
    };
  }

  /**
   * ==========================================
   * ROOM STATE VALIDATION
   * ==========================================
   */
  validateRoomState(room) {

    const isValid =
      room &&
      room.status !== "corrupted" &&
      room.hostId &&
      Array.isArray(room.participants);

    return isValid;
  }

  /**
   * ==========================================
   * GET ROOM (HOOK TO DB / MEMORY)
   * ==========================================
   */
  async getRoom(roomId) {

    // 🔁 Replace with DB / Redis in production
    return global.videoRooms?.get(roomId);
  }

  /**
   * ==========================================
   * SECURITY SCORE (OPTIONAL AI FEED)
   * ==========================================
   */
  computeSecurityScore(room) {

    let score = 100;

    if (room.bannedUsers?.length > 0) {
      score -= 10;
    }

    if (room.failedAccessAttempts) {
      score -= Object.keys(
        room.failedAccessAttempts
      ).length * 5;
    }

    if (room.isPaid) {
      score += 5;
    }

    if (room.type === "invite_only") {
      score += 10;
    }

    return Math.max(score, 0);
  }
}

module.exports = new VideoRoomSecurity();
