/**
 * =========================================
 * UniMentorAI - AI GUARD V3
 * Security + Monetization Layer
 * =========================================
 *
 * Features:
 * - Plan-based access control
 * - AI request limiting
 * - Abuse protection
 * - Stripe-ready gating system
 * =========================================
 */

import { getUserUsage } from "../billing/stripe.usage.service.js";
import { PLANS } from "../billing/stripe.plans.js";

/* =========================
   BASIC RATE MEMORY (ANTI-SPAM SIMPLE LAYER)
========================= */
const requestLog = new Map();

/* =========================
   CHECK RATE SPAM (SHORT TERM)
========================= */
function isSpamming(userId, limit = 10, windowMs = 60 * 1000) {
  const now = Date.now();

  if (!requestLog.has(userId)) {
    requestLog.set(userId, []);
  }

  const timestamps = requestLog.get(userId);

  // remove old requests
  const recent = timestamps.filter((t) => now - t < windowMs);

  recent.push(now);
  requestLog.set(userId, recent);

  return recent.length > limit;
}

/* =========================
   CORE AI ACCESS CHECK
========================= */
export function canUseAI(userId, plan = "FREE") {
  const planConfig = PLANS[plan] || PLANS.FREE;
  const usage = getUserUsage(userId);

  // =========================
  // 1. ANTI-SPAM CHECK
  // =========================
  if (isSpamming(userId)) {
    return {
      allowed: false,
      reason: "SPAM_DETECTED",
      remaining: 0,
      limit: planConfig.limits.aiRequests,
    };
  }

  // =========================
  // 2. UNLIMITED PLAN
  // =========================
  if (planConfig.limits.aiRequests === Infinity) {
    return {
      allowed: true,
      remaining: Infinity,
      limit: Infinity,
    };
  }

  // =========================
  // 3. USAGE CHECK
  // =========================
  const remaining = planConfig.limits.aiRequests - usage.count;

  const allowed = usage.count < planConfig.limits.aiRequests;

  if (!allowed) {
    return {
      allowed: false,
      reason: "AI_LIMIT_REACHED",
      remaining: 0,
      limit: planConfig.limits.aiRequests,
    };
  }

  // =========================
  // 4. SUCCESS RESPONSE
  // =========================
  return {
    allowed: true,
    remaining,
    limit: planConfig.limits.aiRequests,
  };
}

/* =========================
   RESET SPAM WINDOW (OPTIONAL ADMIN HOOK)
========================= */
export function resetSpamProtection(userId) {
  requestLog.delete(userId);
}
