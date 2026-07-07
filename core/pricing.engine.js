import { PLANS } from "./pricing.core.js";

/* =========================
   💰 PRICING ENGINE CONNECTOR (SAAS CORE)
   👉 Payment → Plan → Access → Limits → DB
========================= */
export class PricingEngine {

  /* =========================
     🔍 GET PLAN SAFELY
  ========================= */
  static getPlan(planId = "FREE") {

    const plan = PLANS[planId];

    if (!plan) {
      return PLANS.FREE;
    }

    return plan;
  }

  /* =========================
     💳 UPGRADE USER AFTER PAYMENT
     👉 SAFE MUTATION + AUDIT READY
  ========================= */
  static upgradeUser(user, planId, paymentData = {}) {

    const plan = this.getPlan(planId);

    const now = new Date().toISOString();

    return {
      ...user,

      plan: planId,
      planDetails: plan,

      payment: {
        provider: paymentData.provider || "UNKNOWN",
        paymentId: paymentData.paymentId || null,
        amount: paymentData.amount || plan.price,
        currency: paymentData.currency || "USD",
        status: "SUCCESS",
        activatedAt: now
      },

      updatedAt: now
    };
  }

  /* =========================
     🔐 FEATURE ACCESS CONTROL (PAYWALL CORE)
  ========================= */
  static canAccess(user, feature) {

    const plan = this.getPlan(user?.plan);

    if (!plan) return false;

    /* FREE USERS STRICT GATE */
    if (user?.plan === "FREE") {

      const freeFeatures = new Set([
        "basic_ai",
        "basic_jobs"
      ]);

      return freeFeatures.has(feature);
    }

    /* PRO / BUSINESS / ENTERPRISE */
    return true;
  }

  /* =========================
     📊 LIMIT ENGINE (SAFE + FLEXIBLE)
  ========================= */
  static checkLimit(user, limitType, value = 1) {

    const plan = this.getPlan(user?.plan);

    if (!plan?.limits) return true;

    const limit = plan.limits[limitType];

    if (limit === "unlimited" || limit === true) {
      return true;
    }

    if (typeof limit === "number") {
      return value <= limit;
    }

    return false;
  }

  /* =========================
     🔄 DOWNGRADE USER (SAFETY MODE)
  ========================= */
  static downgradeUser(user, reason = "manual") {

    const now = new Date().toISOString();

    return {
      ...user,

      plan: "FREE",
      planDetails: PLANS.FREE,

      downgrade: {
        reason,
        at: now
      },

      updatedAt: now
    };
  }

  /* =========================
     📡 PLAN STATUS SUMMARY (DASHBOARD READY)
  ========================= */
  static getUserPlanStatus(user) {

    const plan = this.getPlan(user?.plan);

    return {
      plan: user?.plan || "FREE",
      price: plan.price,
      features: plan.features,
      isPro: user?.plan !== "FREE"
    };
  }
}
