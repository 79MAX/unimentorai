/**
 * =========================================
 * UniMentorAI - STRIPE USAGE SERVICE V3
 * AI Monetization Core (SaaS Engine)
 * =========================================
 *
 * Features:
 * - AI usage tracking per user
 * - Plan-based limits (FREE / PRO / ENTERPRISE)
 * - Stripe-ready billing hooks
 * - Analytics integration ready
 * =========================================
 */

import { PLANS } from "./stripe.plans.js";

/* =========================
   MEMORY STORE (DEV ONLY)
   Replace later: Redis / MongoDB / Postgres
========================= */
const usageStore = new Map();

/* =========================
   INIT USER USAGE
========================= */
function initUser(userId) {
  if (!usageStore.has(userId)) {
    usageStore.set(userId, {
      count: 0,
      tokens: 0,
      lastReset: Date.now(),
    });
  }

  return usageStore.get(userId);
}

/* =========================
   GET USER USAGE
========================= */
export function getUserUsage(userId) {
  return initUser(userId);
}

/* =========================
   RESET USAGE (DAILY / MONTHLY HOOK READY)
========================= */
export function resetUserUsage(userId) {
  usageStore.set(userId, {
    count: 0,
    tokens: 0,
    lastReset: Date.now(),
  });
}

/* =========================
   CHECK LIMITS (AI GUARD CORE)
========================= */
export function canUseAI(userId, plan = "FREE") {
  const usage = getUserUsage(userId);
  const limit = PLANS[plan]?.limits?.aiRequests ?? 10;

  if (limit === Infinity) {
    return {
      allowed: true,
      remaining: Infinity,
    };
  }

  const remaining = limit - usage.count;

  return {
    allowed: usage.count < limit,
    remaining: Math.max(remaining, 0),
    limit,
  };
}

/* =========================
   INCREMENT USAGE
========================= */
export function incrementUsage(userId, tokens = 0) {
  const usage = initUser(userId);

  usage.count += 1;
  usage.tokens += tokens;

  usageStore.set(userId, usage);

  return usage;
}

/* =========================
   MAIN TRACKING FUNCTION
========================= */
export function trackAIUsage({
  userId,
  intent,
  level,
  plan = "FREE",
  tokens = 0,
  language = "fr",
}) {
  const access = canUseAI(userId, plan);

  if (!access.allowed) {
    return {
      success: false,
      code: "AI_LIMIT_REACHED",
      remaining: access.remaining,
      limit: access.limit,
    };
  }

  const usage = incrementUsage(userId, tokens);

  const event = {
    userId,
    intent,
    level,
    language,
    plan,
    tokens,
    usageCount: usage.count,
    totalTokens: usage.tokens,
    timestamp: Date.now(),
  };

  // =========================
  // FUTURE: ANALYTICS PIPELINE
  // =========================
  console.log("[AI_USAGE]", event);

  return {
    success: true,
    event,
    remaining: access.remaining - 1,
  };
}

/* =========================
   GET GLOBAL STATS (ADMIN / SAAS DASHBOARD)
========================= */
export function getUsageStats() {
  const stats = [];

  for (const [userId, data] of usageStore.entries()) {
    stats.push({
      userId,
      count: data.count,
      tokens: data.tokens,
      lastReset: data.lastReset,
    });
  }

  return stats;
}

/* =========================
   KPI ENGINE (REVENUE READY)
========================= */
export function getUsageKPIs() {
  let totalRequests = 0;
  let totalTokens = 0;

  for (const [, data] of usageStore.entries()) {
    totalRequests += data.count;
    totalTokens += data.tokens;
  }

  return {
    totalUsers: usageStore.size,
    totalRequests,
    totalTokens,
  };
}
