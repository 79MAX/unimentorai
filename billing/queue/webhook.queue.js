/* =========================
   📥 WEBHOOK QUEUE
   UniMentorAI - Billing Event Pipeline
========================= */

import { Queue } from "bullmq";

/* =========================
   🔐 REDIS CONNECTION CONFIG
========================= */
const connection = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379
};

/* =========================
   🚀 QUEUE CONFIG (ENTERPRISE SAFE)
========================= */
const queueOptions = {
  connection,

  defaultJobOptions: {
    attempts: Number(process.env.WEBHOOK_RETRY_ATTEMPTS) || 3,

    backoff: {
      type: "exponential",
      delay: 2000
    },

    removeOnComplete: {
      count: 1000
    },

    removeOnFail: {
      count: 5000
    }
  }
};

/* =========================
   🚀 WEBHOOK QUEUE INSTANCE
========================= */
export const webhookQueue = new Queue(
  "webhook-processing",
  queueOptions
);

/* =========================
   📥 ENQUEUE WEBHOOK EVENT
   (IDEMPOTENT + SAFE)
========================= */
export async function enqueueWebhook(jobData = {}) {

  const { id, event } = jobData;

  if (!id || !event) {
    throw new Error("INVALID_WEBHOOK_JOB");
  }

  try {

    return await webhookQueue.add(
      "process-webhook",
      jobData,
      {
        jobId: id, // 🔐 IDEMPOTENCY KEY

        /* =========================
           ⚡ PRIORITY SYSTEM (optional future AI scaling)
        ========================= */
        priority: jobData.priority || 1
      }
    );

  } catch (error) {

    console.error("[WEBHOOK_QUEUE_ERROR]", error.message);

    throw error;
  }
}

/* =========================
   📊 QUEUE STATS (ADMIN PANEL READY)
========================= */
export async function getQueueStats() {

  const [
    waiting,
    active,
    completed,
    failed,
    delayed
  ] = await Promise.all([
    webhookQueue.getWaitingCount(),
    webhookQueue.getActiveCount(),
    webhookQueue.getCompletedCount(),
    webhookQueue.getFailedCount(),
    webhookQueue.getDelayedCount()
  ]);

  return {
    waiting,
    active,
    completed,
    failed,
    delayed,
    timestamp: new Date().toISOString()
  };
}

/* =========================
   🧹 CLEAN SHUTDOWN SUPPORT
========================= */
export async function closeQueue() {

  try {

    await webhookQueue.close();

    console.log("[WEBHOOK_QUEUE] Gracefully closed");

  } catch (error) {

    console.error("[WEBHOOK_QUEUE_CLOSE_ERROR]", error.message);
  }
}
