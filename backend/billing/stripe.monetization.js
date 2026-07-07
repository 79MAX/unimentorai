/**
 * =========================================
 * UniMentorAI - STRIPE MONETIZATION V3
 * Revenue Tracking Core (SaaS Engine)
 * =========================================
 *
 * Features:
 * - Stripe event tracking
 * - Revenue analytics
 * - Subscription lifecycle
 * - SaaS KPIs ready
 * =========================================
 */

/* =========================
   MEMORY STORE (DEV ONLY)
   Replace later: DB / warehouse
========================= */
const revenueStore = [];

/* =========================
   TRACK REVENUE EVENT
========================= */
export function trackRevenueEvent({
  userId,
  eventType,
  amount = 0,
  currency = "USD",
  plan = "FREE",
  metadata = {},
}) {
  const event = {
    userId,
    eventType, // SUBSCRIPTION_CREATED | PAYMENT_SUCCESS | CANCELED | FAILED
    amount,
    currency,
    plan,
    metadata,
    timestamp: Date.now(),
  };

  revenueStore.push(event);

  console.log("[STRIPE_REVENUE]", event);

  return event;
}

/* =========================
   STRIPE SUBSCRIPTION EVENTS HANDLER
========================= */
export function handleStripeEvent(event) {
  switch (event.type) {
    /* =========================
       SUBSCRIPTION CREATED
    ========================= */
    case "checkout.session.completed":
      return trackRevenueEvent({
        userId: event.data.object.customer,
        eventType: "SUBSCRIPTION_CREATED",
        amount: event.data.object.amount_total || 0,
        currency: event.data.object.currency || "USD",
        plan: "PRO",
        metadata: event.data.object,
      });

    /* =========================
       PAYMENT SUCCESS
    ========================= */
    case "invoice.paid":
      return trackRevenueEvent({
        userId: event.data.object.customer,
        eventType: "PAYMENT_SUCCESS",
        amount: event.data.object.amount_paid || 0,
        currency: event.data.object.currency || "USD",
        plan: "PRO",
        metadata: event.data.object,
      });

    /* =========================
       PAYMENT FAILED
    ========================= */
    case "invoice.payment_failed":
      return trackRevenueEvent({
        userId: event.data.object.customer,
        eventType: "PAYMENT_FAILED",
        amount: 0,
        currency: event.data.object.currency || "USD",
        plan: "FREE",
        metadata: event.data.object,
      });

    /* =========================
       SUBSCRIPTION CANCELED
    ========================= */
    case "customer.subscription.deleted":
      return trackRevenueEvent({
        userId: event.data.object.customer,
        eventType: "SUBSCRIPTION_CANCELED",
        amount: 0,
        currency: "USD",
        plan: "FREE",
        metadata: event.data.object,
      });

    default:
      console.log("[STRIPE_EVENT_IGNORED]", event.type);
      return null;
  }
}

/* =========================
   REVENUE KPIs (SAAS DASHBOARD)
========================= */
export function getRevenueKPIs() {
  let totalRevenue = 0;
  let successPayments = 0;
  let failedPayments = 0;
  let activeSubscriptions = 0;

  for (const event of revenueStore) {
    if (event.eventType === "PAYMENT_SUCCESS") {
      totalRevenue += event.amount;
      successPayments++;
    }

    if (event.eventType === "PAYMENT_FAILED") {
      failedPayments++;
    }

    if (event.eventType === "SUBSCRIPTION_CREATED") {
      activeSubscriptions++;
    }
  }

  return {
    totalRevenue,
    successPayments,
    failedPayments,
    activeSubscriptions,
    totalEvents: revenueStore.length,
  };
}

/* =========================
   GET ALL EVENTS (ADMIN DASHBOARD)
========================= */
export function getRevenueEvents() {
  return revenueStore;
}
