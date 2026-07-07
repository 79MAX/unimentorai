import { getIO } from "../../socket/socket.init.js";

/**
 * ==================================================
 * SECURITY EVENT STREAM V2
 * UniMentorAI Realtime Security Bus
 * ==================================================
 */

const SECURITY_NAMESPACE = "/security";
const SECURITY_ROOM = "security-admins";

/**
 * ==========================
 * SAFE EMIT CORE
 * ==========================
 */
function emit(event, payload = {}) {
  try {
    const io = getIO();

    if (!io) {
      console.warn("[SECURITY_STREAM] Socket not initialized");
      return false;
    }

    io.of(SECURITY_NAMESPACE)
      .to(SECURITY_ROOM)
      .emit(event, {
        id: generateId(),
        timestamp: new Date(),
        ...payload,
      });

    return true;
  } catch (error) {
    console.error(
      "[SECURITY_STREAM_ERROR]",
      error.message
    );

    return false;
  }
}

/**
 * ==========================
 * EVENT TYPES
 * ==========================
 */
export const SECURITY_EVENTS = {
  RISK_ALERT: "security:risk:alert",
  RISK_UPDATE: "security:risk:update",
  ATTACK_DETECTED: "security:attack:detected",
  USER_BLOCKED: "security:user:blocked",
  USER_UNBLOCKED: "security:user:unblocked",
  SYSTEM_ALERT: "security:system:alert",
};

/**
 * ==========================
 * RISK ALERT
 * ==========================
 */
export const emitRiskAlert = ({
  userId,
  score,
  level,
  message,
}) => {
  return emit(
    SECURITY_EVENTS.RISK_ALERT,
    {
      type: "RISK_ALERT",
      userId,
      score,
      level,
      message,
    }
  );
};

/**
 * ==========================
 * RISK UPDATE (LIVE SCORE CHANGE)
 * ==========================
 */
export const emitRiskUpdate = ({
  userId,
  score,
  level,
}) => {
  return emit(
    SECURITY_EVENTS.RISK_UPDATE,
    {
      type: "RISK_UPDATE",
      userId,
      score,
      level,
    }
  );
};

/**
 * ==========================
 * ATTACK DETECTION
 * ==========================
 */
export const emitAttackDetected = ({
  ip,
  userId,
  reason,
  severity,
}) => {
  return emit(
    SECURITY_EVENTS.ATTACK_DETECTED,
    {
      type: "ATTACK_DETECTED",
      ip,
      userId,
      reason,
      severity,
    }
  );
};

/**
 * ==========================
 * USER BLOCK EVENT
 * ==========================
 */
export const emitUserBlocked = ({
  userId,
  reason,
  adminId,
}) => {
  return emit(
    SECURITY_EVENTS.USER_BLOCKED,
    {
      type: "USER_BLOCKED",
      userId,
      reason,
      adminId,
    }
  );
};

/**
 * ==========================
 * USER UNBLOCK EVENT
 * ==========================
 */
export const emitUserUnblocked = ({
  userId,
  adminId,
}) => {
  return emit(
    SECURITY_EVENTS.USER_UNBLOCKED,
    {
      type: "USER_UNBLOCKED",
      userId,
      adminId,
    }
  );
};

/**
 * ==========================
 * SYSTEM ALERT (GLOBAL)
 * ==========================
 */
export const emitSystemAlert = ({
  message,
  severity = "LOW",
}) => {
  return emit(
    SECURITY_EVENTS.SYSTEM_ALERT,
    {
      type: "SYSTEM_ALERT",
      message,
      severity,
    }
  );
};

/**
 * ==========================
 * ID GENERATOR
 * ==========================
 */
function generateId() {
  return (
    "sec_" +
    Math.random()
      .toString(36)
      .substring(2, 10) +
    Date.now()
  );
}
