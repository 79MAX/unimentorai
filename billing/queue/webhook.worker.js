/* =========================
   🔥 WEBHOOK WORKER
   UniMentorAI - Billing Processor Engine
========================= */

import { Worker } from "bullmq";

import { markProcessed, isProcessed } from "./idempotency.store.js";
import { createBillingLog } from "../logs/billing.logs.js";
import { saveMemory } from "../../memory/memory.store.js";

/* =========================
   🔐 REDIS CONNECTION
========================= */
const connection = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379
};

/* =========================
   🧠 EVENT HANDLERS MAP
========================= */
const handlers = {

  /* =========================
     💰 PAYMENT SUCCESS
  ========================= */
  "payment.success": (payload) => {

    createBillingLog({
      type: "PAYMENT",
      provider: payload.provider || "stripe",
      email: payload.email,
      amount: payload.amount,
      currency: payload.currency || "USD",
      status: "SUCCESS"
    });

    saveMemory(payload.userId, {
      type: "PAYMENT_SUCCESS",
      message: "Payment successful",
      amount: payload.amount,
      provider: payload.provider
    });

    console.log("[PAYMENT_PROCESSED]", payload.email);
  },

  /* =========================
     ❌ PAYMENT FAILED
  ========================= */
  "payment.failed": (payload) => {

    createBillingLog({
      type: "PAYMENT",
      provider: payload.provider || "stripe",
      email: payload.email,
      amount: payload.amount,
      currency: payload.currency || "USD",
      status: "FAILED"
    });

    saveMemory(payload.userId, {
      type: "PAYMENT_FAILED",
      message: "Payment failed",
      amount: payload.amount
    });

    console.log("[PAYMENT_FAILED]", payload.email);
  }
};

/* =========================
   🚀 WORKER ENGINE
========================= */
export const webhookWorker = new Worker(
  "webhook-processing",

  async (job) => {

    const { id, event, payload } = job.data;

    /* =========================
       🔐 IDEMPOTENCY CHECK
    ========================= */
    if (!id || isProcessed(id)) {
      console.log("[WEBHOOK_SKIPPED_DUPLICATE]", id);
      return;
    }

    try {

      /* =========================
         ⚡ EVENT DISPATCHER
      ========================= */
      const handler = handlers[event];

      if (!handler) {

        console.warn("[WEBHOOK_UNKNOWN_EVENT]", event);

        return;
      }

      await handler(payload);

      /* =========================
         📦 MARK PROCESSED
      ========================= */
      markProcessed(id);

      return true;

    } catch (error) {

      console.error("[WEBHOOK_WORKER_ERROR]", {
        id,
        event,
        message: error.message
      });

      throw error;
    }
  },

  {
    connection,
    concurrency: Number(process.env.WORKER_CONCURRENCY) || 5
  }
);

/* =========================
   🚨 WORKER EVENTS
========================= */
webhookWorker.on("failed", (job, err) => {

  console.error("[WORKER_FAILED]", {
    jobId: job?.id,
    error: err.message
  });
});

webhookWorker.on("completed", (job) => {

  console.log("[WORKER_COMPLETED]", job.id);
});
