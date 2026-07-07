/**
 * =========================================
 * UniMentorAI - AI COST ENGINE V3
 * SaaS Monetization Core
 * =========================================
 *
 * Features:
 * - Token-based cost estimation
 * - Provider-ready (OpenAI / future models)
 * - Revenue margin calculation
 * - Stripe billing integration ready
 * =========================================
 */

/* =========================
   BASE COST CONFIG (SIMULATION)
   Replace with real provider pricing
========================= */
const COST_CONFIG = {
  openai: {
    inputPer1KTokens: 0.0015,
    outputPer1KTokens: 0.002,
  },
};

/* =========================
   DEFAULT SAAS PRICING
========================= */
const SAAS_PRICING = {
  FREE: 0,
  PRO: 9.99,
  ENTERPRISE: 29.99,
};

/* =========================
   ESTIMATE AI COST
========================= */
export function estimateAICost({
  inputTokens = 0,
  outputTokens = 0,
  provider = "openai",
}) {
  const config = COST_CONFIG[provider];

  if (!config) {
    throw new Error("UNKNOWN_AI_PROVIDER");
  }

  const inputCost = (inputTokens / 1000) * config.inputPer1KTokens;
  const outputCost = (outputTokens / 1000) * config.outputPer1KTokens;

  const totalCost = inputCost + outputCost;

  return {
    inputCost,
    outputCost,
    totalCost,
  };
}

/* =========================
   CALCULATE SAAS MARGIN
========================= */
export function calculateMargin({
  plan = "FREE",
  inputTokens = 0,
  outputTokens = 0,
}) {
  const cost = estimateAICost({ inputTokens, outputTokens });

  const revenue = SAAS_PRICING[plan] || 0;

  const margin = revenue - cost.totalCost;

  return {
    revenue,
    cost: cost.totalCost,
    margin,
    profitable: margin > 0,
  };
}

/* =========================
   SIMPLIFIED COST PER REQUEST
========================= */
export function estimateRequestCost(tokens = 0) {
  return (tokens / 1000) * 0.0025;
}

/* =========================
   AI COST SUMMARY (FOR ANALYTICS)
========================= */
export function getCostSummary({
  inputTokens = 0,
  outputTokens = 0,
  plan = "FREE",
}) {
  const cost = estimateAICost({ inputTokens, outputTokens });

  const marginData = calculateMargin({
    plan,
    inputTokens,
    outputTokens,
  });

  return {
    ...cost,
    ...marginData,
  };
}
