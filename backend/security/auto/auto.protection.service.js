import { executeSecurityAction } from "FIX_REQUIRED_PATH";
import { aiMetricsService } from "../../ai/ai.metrics.service.js";
import { safetyGuard } from "./safety.guard.js";

/**
 * ==================================================
 * AUTO PROTECTION SERVICE V2
 * UniMentorAI Autonomous Security Response Engine
 * ==================================================
 *
 * 🎯 ROLE:
 * - Execute AI decisions safely
 * - Prevent false-positive disasters
 * - Apply real-time protection rules
 */

/**
 * 🚀 MAIN ENTRY POINT
 */
export async function applyAutoProtection(aiEvent = {}) {
  try {
    const { decision = {}, score = 0, userId } = aiEvent;

    if (!decision || !decision.action) return false;

    /**
     * ==========================
     * 1. SAFETY GATE (CRITICAL)
     * ==========================
     */
    const isSafe = safetyGuard(score, decision.action);

    if (!isSafe) {
      console.warn("[AUTO_PROTECTION_BLOCKED_BY_GUARD]", {
        userId,
        score,
        action: decision.action,
      });
      return false;
    }

    /**
     * ==========================
     * 2. AUTO EXECUTION RULES
     * ==========================
     */
    const shouldExecute =
      decision.autoExecute === true ||
      decision.priority === "CRITICAL" ||
      score >= 90;

    if (!shouldExecute) {
      return await trackOnly(aiEvent, decision);
    }

    /**
     * ==========================
     * 3. EXECUTE SECURITY ACTION
     * ==========================
     */
    const result = await executeSecurityAction({
      action: decision.action,
      userId,
      reason: buildReason(score, decision),
      metadata: aiEvent,
    });

    /**
     * ==========================
     * 4. METRICS TRACKING
     * ==========================
     */
    aiMetricsService.track(aiEvent, {
      score,
      level: aiEvent.level,
      decision,
    });

    /**
     * ==========================
     * 5. AUDIT LOGGING
     * ==========================
     */
    logAction(aiEvent, decision, result);

    return result;
  } catch (error) {
    console.error("[AUTO_PROTECTION_ERROR]", error.message);
    return false;
  }
}

/**
 * ==========================
 * SAFE TRACKING ONLY MODE
 * ==========================
 */
async function trackOnly(event, decision) {
  aiMetricsService.track(event, {
    score: event.score,
    level: event.level,
    decision,
  });

  console.log("[AUTO_PROTECTION_MONITOR_ONLY]", {
    userId: event.userId,
    action: decision.action,
  });

  return {
    success: true,
    mode: "MONITOR_ONLY",
  };
}

/**
 * ==========================
 * REASON BUILDER (AUDIT SAFE)
 * ==========================
 */
function buildReason(score, decision) {
  return `AI_AUTO_PROTECTION_SCORE_${score}_ACTION_${decision.action}`;
}

/**
 * ==========================
 * AUDIT LOGGER
 * ==========================
 */
function logAction(event, decision, result) {
  console.log("[AUTO_PROTECTION_ACTION]", {
    userId: event.userId,
    ip: event.ip,
    score: event.score,
    action: decision.action,
    success: result?.success ?? true,
    timestamp: new Date().toISOString(),
  });
}
