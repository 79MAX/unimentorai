
/**
 * ==========================================
 * 🧠 VIDEO JOIN POLICY ENGINE
 * UniMentorAI Video System
 * ==========================================
 * Controls entry rules for video rooms:
 * - payment
 * - role
 * - capacity
 * - schedule
 * - restrictions
 */

class VideoJoinPolicyEngine {

  /**
   * ==========================================
   * MAIN POLICY CHECK
   * ==========================================
   */
  async evaluate({ userId, room }) {

    const checks = [];

    checks.push(this.checkRoomExists(room));
    checks.push(this.checkCapacity(room));
    checks.push(this.checkSchedule(room));
    checks.push(this.checkBannedUsers(userId, room));
    checks.push(this.checkInvitePolicy(userId, room));
    checks.push(this.checkPaymentAccess(userId, room));
    checks.push(this.checkRoleRestrictions(userId, room));

    const failed = checks.filter(c => !c.allowed);

    return {
      allowed: failed.length === 0,
      reasons: failed.map(f => f.reason),
      riskLevel: this.computeRiskLevel(failed)
    };
  }

  /**
   * ==========================================
   * ROOM EXISTENCE
   * ==========================================
   */
  checkRoomExists(room) {

    if (!room) {
      return {
        allowed: false,
        reason: "ROOM_NOT_FOUND"
      };
    }

    return { allowed: true };
  }

  /**
   * ==========================================
   * CAPACITY LIMIT
   * ==========================================
   */
  checkCapacity(room) {

    if (
      room.participants.length >=
      room.maxCapacity
    ) {
      return {
        allowed: false,
        reason: "ROOM_FULL"
      };
    }

    return { allowed: true };
  }

  /**
   * ==========================================
   * SCHEDULE VALIDATION
   * ==========================================
   */
  checkSchedule(room) {

    if (!room.schedule) {
      return { allowed: true };
    }

    const now = Date.now();

    if (now < room.schedule.start) {
      return {
        allowed: false,
        reason: "SESSION_NOT_STARTED"
      };
    }

    if (now > room.schedule.end) {
      return {
        allowed: false,
        reason: "SESSION_ENDED"
      };
    }

    return { allowed: true };
  }

  /**
   * ==========================================
   * BANNED USERS CHECK
   * ==========================================
   */
  checkBannedUsers(userId, room) {

    if (room.bannedUsers?.includes(userId)) {
      return {
        allowed: false,
        reason: "USER_BANNED"
      };
    }

    return { allowed: true };
  }

  /**
   * ==========================================
   * INVITE POLICY
   * ==========================================
   */
  checkInvitePolicy(userId, room) {

    if (room.type === "public") {
      return { allowed: true };
    }

    if (
      room.type === "invite_only" &&
      !room.allowedUsers?.includes(userId)
    ) {
      return {
        allowed: false,
        reason: "INVITE_REQUIRED"
      };
    }

    return { allowed: true };
  }

  /**
   * ==========================================
   * PAYMENT POLICY
   * ==========================================
   */
  checkPaymentAccess(userId, room) {

    if (!room.isPaid) {
      return { allowed: true };
    }

    if (!room.paidUsers?.includes(userId)) {
      return {
        allowed: false,
        reason: "PAYMENT_REQUIRED"
      };
    }

    return { allowed: true };
  }

  /**
   * ==========================================
   * ROLE RESTRICTIONS
   * ==========================================
   */
  checkRoleRestrictions(userId, room) {

    const role = room.roles?.[userId] || "guest";

    if (role === "banned") {
      return {
        allowed: false,
        reason: "ROLE_BANNED"
      };
    }

    if (
      role === "guest" &&
      room.guestDisabled
    ) {
      return {
        allowed: false,
        reason: "GUEST_DISABLED"
      };
    }

    return { allowed: true };
  }

  /**
   * ==========================================
   * RISK ENGINE
   * ==========================================
   */
  computeRiskLevel(failedChecks) {

    const critical = [
      "USER_BANNED",
      "PAYMENT_REQUIRED",
      "ROOM_FULL"
    ];

    const high = [
      "INVITE_REQUIRED",
      "SESSION_ENDED"
    ];

    for (const f of failedChecks) {

      if (critical.includes(f.reason)) {
        return "critical";
      }

      if (high.includes(f.reason)) {
        return "high";
      }
    }

    return failedChecks.length
      ? "medium"
      : "low";
  }
}

module.exports =
  new VideoJoinPolicyEngine();
