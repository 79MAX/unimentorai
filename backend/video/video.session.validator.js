
/**
 * ==========================================
 * 🧠 VIDEO SESSION VALIDATOR
 * UniMentorAI Secure Video System
 * ==========================================
 * Ensures session integrity before runtime usage
 */

class VideoSessionValidator {

  /**
   * ==========================================
   * MAIN VALIDATION ENTRYPOINT
   * ==========================================
   */
  validate(session) {

    if (!session) {
      return this.fail("SESSION_MISSING");
    }

    const errors = [];

    errors.push(
      ...this.validateStructure(session)
    );

    errors.push(
      ...this.validateParticipants(session)
    );

    errors.push(
      ...this.validateTiming(session)
    );

    errors.push(
      ...this.validateState(session)
    );

    errors.push(
      ...this.validateSecurity(session)
    );

    return {
      valid: errors.length === 0,
      errors,
      score: this.computeIntegrityScore(errors)
    };
  }

  /**
   * ==========================================
   * STRUCTURE VALIDATION
   * ==========================================
   */
  validateStructure(session) {

    const errors = [];

    if (!session.sessionId) {
      errors.push("MISSING_SESSION_ID");
    }

    if (!session.roomId) {
      errors.push("MISSING_ROOM_ID");
    }

    if (!session.hostId) {
      errors.push("MISSING_HOST_ID");
    }

    if (!session.status) {
      errors.push("MISSING_STATUS");
    }

    return errors;
  }

  /**
   * ==========================================
   * PARTICIPANTS VALIDATION
   * ==========================================
   */
  validateParticipants(session) {

    const errors = [];

    if (!session.participants) {
      errors.push("MISSING_PARTICIPANTS");
    }

    if (
      session.participants &&
      session.participants.size > 1000
    ) {
      errors.push("PARTICIPANT_LIMIT_EXCEEDED");
    }

    return errors;
  }

  /**
   * ==========================================
   * TIMING VALIDATION
   * ==========================================
   */
  validateTiming(session) {

    const errors = [];

    if (!session.startedAt) {
      errors.push("MISSING_START_TIME");
    }

    if (
      session.endedAt &&
      session.endedAt < session.startedAt
    ) {
      errors.push("INVALID_TIME_RANGE");
    }

    const duration =
      session.endedAt
        ? session.endedAt - session.startedAt
        : Date.now() - session.startedAt;

    if (duration < 0) {
      errors.push("NEGATIVE_DURATION");
    }

    if (duration > 12 * 60 * 60 * 1000) {
      errors.push("SESSION_TOO_LONG");
    }

    return errors;
  }

  /**
   * ==========================================
   * STATE VALIDATION
   * ==========================================
   */
  validateState(session) {

    const errors = [];

    const validStates = [
      "active",
      "ended",
      "paused",
      "waiting"
    ];

    if (
      !validStates.includes(session.status)
    ) {
      errors.push("INVALID_SESSION_STATE");
    }

    if (
      session.status === "ended" &&
      !session.endedAt
    ) {
      errors.push("MISSING_END_TIMESTAMP");
    }

    return errors;
  }

  /**
   * ==========================================
   * SECURITY VALIDATION
   * ==========================================
   */
  validateSecurity(session) {

    const errors = [];

    if (session.isCompromised) {
      errors.push("SESSION_COMPROMISED");
    }

    if (session.unauthorizedAccessDetected) {
      errors.push("UNAUTHORIZED_ACCESS");
    }

    return errors;
  }

  /**
   * ==========================================
   * INTEGRITY SCORE (AI FEED)
   * ==========================================
   */
  computeIntegrityScore(errors) {

    let score = 100;

    for (const error of errors) {

      switch (error) {

        case "SESSION_COMPROMISED":
        case "UNAUTHORIZED_ACCESS":
          score -= 40;
          break;

        case "INVALID_TIME_RANGE":
        case "PARTICIPANT_LIMIT_EXCEEDED":
          score -= 25;
          break;

        case "MISSING_SESSION_ID":
        case "MISSING_ROOM_ID":
        case "MISSING_HOST_ID":
          score -= 20;
          break;

        default:
          score -= 10;
      }
    }

    return Math.max(score, 0);
  }

  /**
   * ==========================================
   * FAIL HELPER
   * ==========================================
   */
  fail(reason) {

    return {
      valid: false,
      errors: [reason],
      score: 0
    };
  }
}

module.exports =
  new VideoSessionValidator();
