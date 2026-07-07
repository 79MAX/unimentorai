/**
 * =========================================
 * UniMentorAI - STRIPE SERVICE V2
 * SaaS Billing Core (READY FOR MONETIZATION)
 * =========================================
 *
 * Features:
 * - Subscription creation (FREE → PRO)
 * - Customer management
 * - Checkout session builder
 * - Billing portal
 * - Webhook helpers
 * - Plan resolution (SaaS logic)
 * =========================================
 */

import Stripe from "stripe";

// =========================
// STRIPE INIT
// =========================
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

// =========================
// PLANS CONFIG (CORE SAAS)
// =========================
export const PLANS = {
  FREE: {
    name: "Free",
    priceId: null,
    limits: {
      aiRequests: 10,
    },
  },

  PRO: {
    name: "Pro",
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    limits: {
      aiRequests: 1000,
    },
  },

  ENTERPRISE: {
    name: "Enterprise",
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    limits: {
      aiRequests: Infinity,
    },
  },
};

// =========================
// CREATE CUSTOMER
// =========================
export async function createCustomer({ email, userId }) {
  try {
    const customer = await stripe.customers.create({
      email,
      metadata: {
        userId,
      },
    });

    return customer;
  } catch (err) {
    throw new Error("STRIPE_CUSTOMER_CREATE_FAILED: " + err.message);
  }
}

// =========================
// CREATE CHECKOUT SESSION (SUBSCRIPTION)
// =========================
export async function createCheckoutSession({ customerId, priceId }) {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/billing/success`,
      cancel_url: `${process.env.CLIENT_URL}/billing/cancel`,
    });

    return session;
  } catch (err) {
    throw new Error("STRIPE_CHECKOUT_FAILED: " + err.message);
  }
}

// =========================
// CREATE BILLING PORTAL
// =========================
export async function createBillingPortal(customerId) {
  try {
    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.CLIENT_URL}/account/billing`,
    });

    return portal;
  } catch (err) {
    throw new Error("STRIPE_PORTAL_FAILED: " + err.message);
  }
}

// =========================
// GET SUBSCRIPTION STATUS
// =========================
export async function getSubscription(customerId) {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    return subscriptions.data[0] || null;
  } catch (err) {
    throw new Error("STRIPE_SUBSCRIPTION_FETCH_FAILED: " + err.message);
  }
}

// =========================
// PLAN RESOLVER (CORE SAAS LOGIC)
// =========================
export function resolvePlan(subscription) {
  if (!subscription) return "FREE";

  const priceId = subscription.items?.data?.[0]?.price?.id;

  if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
    return "PRO";
  }

  if (priceId === process.env.STRIPE_ENTERPRISE_PRICE_ID) {
    return "ENTERPRISE";
  }

  return "FREE";
}

// =========================
// STRIPE WEBHOOK VERIFIER
// =========================
export function verifyStripeEvent(rawBody, signature) {
  try {
    return stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    throw new Error("STRIPE_WEBHOOK_INVALID: " + err.message);
  }
}

// =========================
// SAFE EXPORT
// =========================
export default stripe;
