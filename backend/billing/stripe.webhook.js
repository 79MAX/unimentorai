/**
 * =========================================
 * UniMentorAI - STRIPE WEBHOOK V2
 * Billing Event Processor (SaaS CORE)
 * =========================================
 *
 * Features:
 * - Secure webhook verification
 * - Subscription lifecycle handling
 * - User plan updates (FREE → PRO)
 * - Payment tracking hooks
 * - Ready for analytics + AI gating
 * =========================================
 */

import express from "express";
import { verifyStripeEvent } from "./stripe.service.js";

const router = express.Router();

// =========================
// RAW BODY REQUIRED (IMPORTANT)
// =========================
router.post(
  "/",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const signature = req.headers["stripe-signature"];

    let event;

    // =========================
    // VERIFY STRIPE SIGNATURE
    // =========================
    try {
      event = verifyStripeEvent(req.body, signature);
    } catch (err) {
      console.error("[STRIPE_WEBHOOK_INVALID]", err.message);

      return res.status(400).json({
        success: false,
        code: "INVALID_SIGNATURE",
      });
    }

    // =========================
    // EVENT ROUTING
    // =========================
    try {
      switch (event.type) {
        // ---------------------------------
        // PAYMENT SUCCESS
        // ---------------------------------
        case "checkout.session.completed": {
          const session = event.data.object;

          console.log("[STRIPE] CHECKOUT COMPLETED", {
            customer: session.customer,
            email: session.customer_details?.email,
            status: session.payment_status,
          });

          // TODO:
          // - upgrade user to PRO
          // - save subscription in DB
          // - unlock AI limits

          break;
        }

        // ---------------------------------
        // SUBSCRIPTION CREATED
        // ---------------------------------
        case "customer.subscription.created": {
          const subscription = event.data.object;

          console.log("[STRIPE] SUBSCRIPTION CREATED", {
            id: subscription.id,
            customer: subscription.customer,
            status: subscription.status,
          });

          // TODO:
          // - set user plan = PRO
          // - enable premium AI features

          break;
        }

        // ---------------------------------
        // SUBSCRIPTION UPDATED
        // ---------------------------------
        case "customer.subscription.updated": {
          const subscription = event.data.object;

          console.log("[STRIPE] SUBSCRIPTION UPDATED", {
            id: subscription.id,
            status: subscription.status,
          });

          // TODO:
          // - downgrade/upgrade plan dynamically

          break;
        }

        // ---------------------------------
        // SUBSCRIPTION DELETED
        // ---------------------------------
        case "customer.subscription.deleted": {
          const subscription = event.data.object;

          console.log("[STRIPE] SUBSCRIPTION CANCELED", {
            id: subscription.id,
            customer: subscription.customer,
          });

          // TODO:
          // - revert user to FREE plan
          // - limit AI access

          break;
        }

        // ---------------------------------
        // PAYMENT FAILED
        // ---------------------------------
        case "invoice.payment_failed": {
          const invoice = event.data.object;

          console.log("[STRIPE] PAYMENT FAILED", {
            customer: invoice.customer,
            reason: invoice.billing_reason,
          });

          // TODO:
          // - notify user
          // - restrict PRO access if needed

          break;
        }

        default:
          console.log(`[STRIPE] Unhandled event type: ${event.type}`);
      }

      return res.status(200).json({
        success: true,
        received: true,
      });
    } catch (err) {
      console.error("[STRIPE_WEBHOOK_ERROR]", err);

      return res.status(500).json({
        success: false,
        code: "WEBHOOK_PROCESSING_ERROR",
      });
    }
  }
);

export default router;
