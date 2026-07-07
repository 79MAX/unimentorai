/**
 * =========================================
 * UniMentorAI - STRIPE PLANS V3
 * SaaS Monetization Core
 * =========================================
 *
 * Features:
 * - AI usage limits
 * - Stripe pricing ready
 * - scalable tiers (FREE / PRO / ENTERPRISE)
 * - future-ready for credits + addons
 * =========================================
 */

export const PLAN_IDS = {
  FREE: "FREE",
  PRO: "PRO",
  ENTERPRISE: "ENTERPRISE",
};

/* =========================
   CORE PLANS CONFIG
========================= */
export const PLANS = {
  FREE: {
    id: PLAN_IDS.FREE,
    name: "Free",
    price: 0,
    currency: "USD",

    limits: {
      aiRequests: 20,
      tokensPerRequest: 1000,
      storageMB: 100,
    },

    features: {
      ads: true,
      analytics: false,
      prioritySupport: false,
    },
  },

  PRO: {
    id: PLAN_IDS.PRO,
    name: "Pro",
    price: 9.99,
    currency: "USD",

    limits: {
      aiRequests: 2000,
      tokensPerRequest: 8000,
      storageMB: 5000,
    },

    features: {
      ads: false,
      analytics: true,
      prioritySupport: true,
    },
  },

  ENTERPRISE: {
    id: PLAN_IDS.ENTERPRISE,
    name: "Enterprise",
    price: 29.99,
    currency: "USD",

    limits: {
      aiRequests: Infinity,
      tokensPerRequest: Infinity,
      storageMB: Infinity,
    },

    features: {
      ads: false,
      analytics: true,
      prioritySupport: true,
      dedicatedInfra: true,
    },
  },
};

/* =========================
   HELPERS
========================= */

/**
 * Get plan safely
 */
export function getPlan(planId = "FREE") {
  return PLANS[planId] || PLANS.FREE;
}

/**
 * Check if plan is premium
 */
export function isPremium(planId = "FREE") {
  return planId === PLAN_IDS.PRO || planId === PLAN_IDS.ENTERPRISE;
}

/**
 * Get AI request limit
 */
export function getAILimit(planId = "FREE") {
  return getPlan(planId).limits.aiRequests;
}

/**
 * Check if unlimited usage
 */
export function isUnlimited(planId = "FREE") {
  return getAILimit(planId) === Infinity;
}
