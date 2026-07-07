import { processAlertRules } from "./alert.rules.engine.js";
import { sendNotification } from "./notification.service.js";
import { executeSecurityAction } from "./security.actions.service.js";
import { emitSystemAlert } from "FIX_REQUIRED_PATH";

/**
 * ==================================================
 * ALERT ENGINE V2 (CORE ORCHESTRATOR)
 * UniMentorAI Security Response Brain
 * ==================================================
 */

/**
 * 🚨 MAIN ENTRY POINT
 * Every security event passes here
 */
export async function handleSecurityEvent(event) {
  const startTime = Date.now();

  try {
    if (!event) return false;

    /**
     * ==========================
     * 1. RULE EVALUATION (DECISION LAYER)
     * ==========================
     */
    const decision = processAlertRules(event);

    /**
     * ==========================
     * 2. REALTIME SYSTEM BROADCAST
     * ==========================
     */
    emitSystemAlert({
      message: event.message || "Security event detected",
      severity: event.level || "LOW",
      type: event.type,
    });

    /**
     * ==========================
     * 3. NOTIFICATION LAYER
     * ==========================
     */
    if (decision.notify) {
      try {
        await sendNotification({
          level: event.level,
          message: event.message,
          userId: event.userId,
          type: event.type,
        });
      } catch (err) {
        console.error(
          "[ALERT_ENGINE_NOTIFICATION_ERROR]",
          err.message
        );
      }
    }

    /**
     * ==========================
     * 4. SECURITY ACTION LAYER
     * ==========================
     */
    if (decision.action) {
      try {
        await executeSecurityAction({
          action: decision.action,
          userId: event.userId,
          reason: event.message,
          metadata: {
            score: event.score,
            ip: event.ip,
            type: event.type,
          },
        });
      } catch (err) {
        console.error(
          "[ALERT_ENGINE_ACTION_ERROR]",
          err.message
        );
      }
    }

    /**
     * ==========================
     * 5. OBSERVABILITY LOG
     * ==========================
     */
    logExecution({
      event,
      decision,
      duration: Date.now() - startTime,
    });

    return true;
  } catch (error) {
    console.error(
      "[ALERT_ENGINE_FATAL_ERROR]",
      error.message
    );

    return false;
  }
}

/**
 * ==========================
 * OBSERVABILITY / DEBUG LOG
 * ==========================
 */
function logExecution({ event, decision, duration }) {
  console.log("📊 ALERT ENGINE EXECUTION", {
    type: event.type,
    level: event.level,
    userId: event.userId,
    decision,
    duration: `${duration}ms`,
    timestamp: new Date(),
  });
}
