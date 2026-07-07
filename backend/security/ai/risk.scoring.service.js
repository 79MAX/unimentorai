import { extractFeatures } from "./feature.engine.js";
import { computeFraudScore } from "./fraud.model.js";
import {
  ALERT_LEVELS,
  getSeverityFromScore,
} from "../alert/alert.types.js";

/**
 * ==================================================
 * RISK SCORING SERVICE V2
 * UniMentorAI AI Decision Orchestrator
 * ==================================================
 *
 * 🎯 ROLE:
 * - Feature extraction
 * - Fraud scoring
 * - Risk interpretation
 * - Decision enrichment
 */

/**
 * 🚀 MAIN ENTRY POINT
 */
export function analyzeRisk(event = {}) {
  /**
   * ==========================
   * 1. FEATURE EXTRACTION
   * ==========================
   */
  const features = extractFeatures(event);

  /**
   * ==========================
   * 2. FRAUD SCORE COMPUTATION
   * ==========================
   */
  const modelOutput = computeFraudScore(features);

  const score = modelOutput.score;
  const breakdown = modelOutput.breakdown;

  /**
   * ==========================
   * 3. SEVERITY MAPPING
   * ==========================
   */
  const level = getSeverityFromScore(score);

  /**
   * ==========================
   * 4. INTELLIGENT DECISION ENGINE
   * ==========================
   */
  const decision = getDecisionEngine(score, features);

  /**
   * ==========================
   * 5. RISK CONTEXT ENRICHMENT
   * ==========================
   */
  const context = buildContext(features, event);

  /**
   * ==========================
   * FINAL RESPONSE OBJECT
   * ==========================
   */
  return {
    score,
    level,
    decision,
    breakdown,
    features,
    context,
    riskSignal: generateRiskSignal(score, level),
  };
}

/**
 * ==========================
 * DECISION ENGINE (SMART LAYER)
 * ==========================
 */
function getDecisionEngine(score, features) {
  if (score >= 90 || features.isBruteforce) {
    return {
      action: "BLOCK",
      priority: "CRITICAL",
      autoExecute: true,
    };
  }

  if (score >= 70 || features.isRateLimited) {
    return {
      action: "RESTRICT",
      priority: "HIGH",
      autoExecute: true,
    };
  }

  if (score >= 40 || features.isSuspicious) {
    return {
      action: "MONITOR",
      priority: "MEDIUM",
      autoExecute: false,
    };
  }

  return {
    action: "ALLOW",
    priority: "LOW",
    autoExecute: false,
  };
}

/**
 * ==========================
 * CONTEXT BUILDER (AI + ANALYTICS READY)
 * ==========================
 */
function buildContext(features, event) {
  return {
    ip: features.ip,
    userId: features.userId,
    device: event.device || "unknown",
    geo: event.geo || "unknown",
    timestamp: new Date(),
    environment: features.environment,
    attackSurface: detectAttackSurface(features),
  };
}

/**
 * ==========================
 * RISK SIGNAL GENERATOR
 * ==========================
 */
function generateRiskSignal(score, level) {
  return {
    score,
    level,
    signal:
      score >= 90
        ? "IMMEDIATE_THREAT"
        : score >= 70
        ? "HIGH_RISK"
        : score >= 40
        ? "SUSPICIOUS_ACTIVITY"
        : "NORMAL_ACTIVITY",
  };
}

/**
 * ==========================
 * ATTACK SURFACE DETECTOR
 * ==========================
 */
function detectAttackSurface(features) {
  const surfaces = [];

  if (features.isBruteforce) surfaces.push("AUTH");
  if (features.rateLimitExceeded) surfaces.push("API");
  if (features.geoMismatch) surfaces.push("LOCATION");
  if (features.isSuspicious) surfaces.push("BEHAVIOR");

  return surfaces.length ? surfaces : ["NONE"];
}
