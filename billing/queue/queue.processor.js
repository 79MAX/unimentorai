import { Queue } from "bullmq";

/* =========================
   🔐 REDIS CONFIG
========================= */
const REDIS_CONFIG = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined
};

/* =========================
   🚀 WEBHOOK QUEUE INIT
========================= */
export const webhookQueue = new Queue(
  "webhook-processing",
  {
    connection: REDIS_CONFIG,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 5000
      },
      removeOnComplete: 100,
      removeOnFail: 500
    }
  }
);

/* =========================
   📥 ADD JOB TO QUEUE
========================= */
export async function addWebhookJob(data = {}) {

  return webhookQueue.add(
    "process-payment",
    data,
    {
      jobId: data.id || undefined
    }
  );
}

/* =========================
   📊 QUEUE HEALTH MONITORING
========================= */
export async function getQueueStats() {

  const [
    waiting,
    active,
    completed,
    failed,
    delayed,
    paused
  ] = await Promise.all([
    webhookQueue.getWaitingCount(),
    webhookQueue.getActiveCount(),
    webhookQueue.getCompletedCount(),
    webhookQueue.getFailedCount(),
    webhookQueue.getDelayedCount(),
    webhookQueue.isPaused()
  ]);

  return {
    waiting,
    active,
    completed,
    failed,
    delayed,
    paused,
    timestamp: new Date().toISOString()
  };
}

/* =========================
   🧹 CLEAN OLD JOBS
========================= */
export async function cleanQueue() {

  await webhookQueue.clean(
    1000 * 60 * 60, // 1h
    100,
    "completed"
  );

  await webhookQueue.clean(
    1000 * 60 * 60 * 24, // 24h
    100,
    "failed"
  );
}

/* =========================
   🚨 QUEUE EVENTS LOGGING
========================= */
webhookQueue.on("error", (err) => {
  console.error("[QUEUE_ERROR]", err);
});

webhookQueue.on("waiting", jobId => {
  console.log(`[QUEUE_WAITING] ${jobId}`);
});
