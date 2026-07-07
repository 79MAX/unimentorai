import { applyAutoProtection } from "./auto.protection.service.js";
import { analyzeRisk } from "FIX_REQUIRED_PATH";
import { processAIEvent } from "FIX_REQUIRED_PATH";

/**
 * ==================================================
 * AUTO PROTECTION HOOK V2
 * UniMentorAI Security Orchestration Gateway
 * ==================================================
 *
 * 🎯 ROLE:
 * - Central entry for AI security pipeline
 * - Orchestrates risk + protection + alerts
 * - Ensures system stability (fail-safe)
 */

/**
 * 🚀 MAIN ENTRY POINT
 */
export async function handleSecurityEvent(rawEvent = {}) {
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
     * 2. BUILD ENRICHED EVENT
     * ==========================
     */
    const enrichedEvent = buildEvent(rawEvent, aiResult);

    /**
     * ==========================
     * 3. AUTO PROTECTION EXECUTION
     * ==========================
     */
    await safeAutoProtection(enrichedEvent);

    /**
     * ==========================
     * 4. CONTINUE PIPELINE (ALERT SYSTEM)
     * ==========================
     */
    return enrichedEvent;
  } catch (error) {
    console.error("[AUTO_PROTECTION_HOOK_ERROR]", error.message);

    /**
     * NEVER BREAK SECURITY PIPELINE
     */
    return rawEvent;
  }
}

/**
 * ==========================
 * EVENT ENRICHMENT LAYER
 * ==========================
 */
function buildEvent(rawEvent, aiResult) {
  return {
    ...rawEvent,

    /**
     * AI CORE OUTPUT
     */
    score: aiResult.score,
    level: aiResult.level,
    decision: aiResult.decision,

    /**
     * AI INSIGHTS
     */
    ai: {
      signal: aiResult.riskSignal,
      breakdown: aiResult.breakdown,
      context: aiResult.context,
      attackSurface: aiResult.context?.attackSurface || [],
    },

    /**
     * SYSTEM METADATA
     */
    processedAt: new Date(),
    pipeline: "AUTO_PROTECTION_V2",
  };
}

/**
 * ==========================
 * SAFE AUTO PROTECTION WRAPPER
 * ==========================
 */
async function safeAutoProtection(event) {
  try {
    return await applyAutoProtection(event);
  } catch (error) {
    console.error("[AUTO_PROTECTION_FAILSAFE]", error.message);

    /**
     * NEVER BREAK FLOW
     */
    return false;
  }
}
