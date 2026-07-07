const Redis = require("ioredis");

/* =========================
   ⚙️ CONFIG
========================= */
const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

const redisOptions = {
  maxRetriesPerRequest: 3,
  retryDelayOnFailover: 200,
  enableReadyCheck: true,
  lazyConnect: false
};

/* =========================
   ⚡ INSTANCE
========================= */
const redis = new Redis(REDIS_URL, redisOptions);

/* =========================
   🔌 EVENTS
========================= */
redis.on("connect", () => {
  console.log("⚡ Redis connected");
});

redis.on("ready", () => {
  console.log("🚀 Redis ready");
});

redis.on("reconnecting", (delay) => {
  console.warn(`🔄 Redis reconnecting in ${delay}ms`);
});

redis.on("error", (err) => {
  console.error("❌ Redis error:", err.message);
});

/* =========================
   🧠 SAFE SHUTDOWN (IMPORTANT PROD)
========================= */
process.on("SIGINT", async () => {
  try {
    await redis.quit();
    console.log("🧹 Redis disconnected cleanly");
  } catch {
    process.exit(1);
  }
});

module.exports = redis;
