import { analyzeRisk } from "FIX_REQUIRED_PATH";
import { triggerSecurityAlert } from "FIX_REQUIRED_PATH";

/**
 * ==================================================
 * AI HOOK V2
 * UniMentorAI Fraud Intelligence Gateway
 * ==================================================
 *
 * 🎯 ROLE:
 * - Entry point for AI security processing
 * - Enrich events with AI scoring
 * - Forward to alert system
 */

/**
 * 🚀 MAIN AI ENTRY POINT
 */
export async function processAIEvent(rawEvent = {}) {
  try {
    if (!rawEvent) return false;

    /**
     * ==========================
     * 1. AI RISK ANALYSIS
     * ==========================
     */
    const aiResult = analyzeRisk(rawEvent);

    /**
     * ==========================
     * 2. ENRICHED AI EVENT
     * ==========================
     */
    const enrichedEvent = buildAIEvent(rawEvent, aiResult);

    /**
     * ==========================
     * 3. FORWARD TO ALERT ENGINE
     * ==========================
     */
    return await triggerSecurityAlert(enrichedEvent);
  } catch (error) {
    console.error("[AI_HOOK_ERROR]", error.message);

    /**
     * NEVER BLOCK SECURITY PIPELINE
     */
    return false;
  }
}

/**
 * ==========================
 * AI EVENT BUILDER
 * ==========================
 */
function buildAIEvent(rawEvent, aiResult) {
  return {
    /**
     * ORIGINAL EVENT
     */
    ...rawEvent,

    /**
     * ==========================
     * AI CORE OUTPUT
     * ==========================
     */
    score: aiResult.score,
    level: aiResult.level,
    decision: aiResult.decision,

    /**
     * ==========================
     * AI INSIGHTS
     * ==========================
     */
    ai: {
      signal: aiResult.riskSignal,
      breakdown: aiResult.breakdown,
      context: aiResult.context,
      attackSurface: aiResult.context?.attackSurface || [],
    },

    /**
     * ==========================
     * METADATA
     * ==========================
     */
    processedBy: "AI_FRAUD_ENGINE_V1",
    processedAt: new Date(),
    version: "v1",
  };
}

/**
 * ==========================
 * QUICK AI SHORTCUT HELPERS
 * ==========================
 */

/**
 * 🚨 Bruteforce shortcut
 */
export function aiBruteforceEvent(data) {
  return processAIEvent({
    type: "security:attack:bruteforce",
    bruteforce: true,
    level: "HIGH",
    ...data,
  });
}

/**
 * ⚠️ Suspicious behavior shortcut
 */
export function aiSuspiciousEvent(data) {
  return processAIEvent({
    type: "security:risk:alert",
    suspiciousBehavior: true,
    level: "MEDIUM",
    ...data,
  });
}

/**
 * 🚫 Fraud attempt shortcut
 */
export function aiFraudEvent(data) {
  return processAIEvent({
    type: "security:attack:detected",
    score: 95,
    level: "CRITICAL",
    ...data,
  });
}
