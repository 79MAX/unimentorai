import crypto from "crypto";

/**
 * =====================================
 * UNI-MENTORAI RATE LIMIT ENGINE
 * (ENTERPRISE TRAFFIC CONTROL SYSTEM)
 * =====================================
 *
 * FEATURES:
 * - Multi-tier rate limiting
 * - Adaptive blocking
 * - IP tracking
 * - Burst detection
 * - Redis-ready architecture
 */

/**
 * =====================================
 * MEMORY STORE (DEV ONLY)
 * ⚠️ Replace with Redis in production
 * =====================================
 */
const store = new Map();

/**
 * =====================================
 * RATE LIMIT CONFIGURATION
 * =====================================
 */
const LIMITS = {
  GLOBAL: {
    windowMs: 60 * 1000,
    max: 300,
  },

  API: {
    windowMs: 60 * 1000,
    max: 120,
  },

  AUTH: {
    windowMs: 10 * 60 * 1000,
    max: 20,
  },

  PREMIUM: {
    windowMs: 60 * 1000,
    max: 800,
  },
};

/**
 * =====================================
 * GET CLIENT KEY
 * =====================================
 */
const getKey = (req) =>
  req.ip ||
  req.headers["x-forwarded-for"] ||
  "unknown";

/**
 * =====================================
 * INIT BUCKET
 * =====================================
 */
const getBucket = (key) => {
  if (!store.has(key)) {
    store.set(key, {
      requests: [],
      blockedUntil: 0,
      burstCount: 0,
    });
  }
  return store.get(key);
};

/**
 * =====================================
 * CLEAN OLD REQUESTS
 * =====================================
 */
const cleanRequests = (bucket, windowMs) => {
  const now = Date.now();

  bucket.requests = bucket.requests.filter(
    (t) => now - t < windowMs
  );
};

/**
 * =====================================
 * RATE LIMIT CORE ENGINE
 * =====================================
 */
const rateLimiter = (type) => {
  const config = LIMITS[type];

  return (req, res, next) => {
    try {
      const key = getKey(req);
      const bucket = getBucket(key);

      const now = Date.now();

      /**
       * =====================================
       * BLOCK CHECK
       * =====================================
       */
      if (bucket.blockedUntil > now) {
        return res.status(429).json({
          success: false,
          code: "RATE_LIMIT_BLOCKED",
          retryAfter: Math.ceil(
            (bucket.blockedUntil - now) / 1000
          ),
          message:
            "Too many requests. Temporarily blocked.",
        });
      }

      /**
       * =====================================
       * TRACK REQUEST
       * =====================================
       */
      bucket.requests.push(now);

      cleanRequests(bucket, config.windowMs);

      const count = bucket.requests.length;

      /**
       * =====================================
       * BURST DETECTION
       * =====================================
       */
      if (count > config.max * 0.7) {
        bucket.burstCount += 1;
      } else {
        bucket.burstCount = 0;
      }

      /**
       * =====================================
       * SOFT ABUSE PENALTY (BURST)
       * =====================================
       */
      if (bucket.burstCount > 10) {
        bucket.blockedUntil =
          now + 30 * 1000; // 30 sec soft block
      }

      /**
       * =====================================
       * HARD LIMIT EXCEEDED
       * =====================================
       */
      if (count > config.max) {
        const penalty = Math.min(
          2 * 60 * 1000,
          (count - config.max) * 1000
        );

        bucket.blockedUntil = now + penalty;

        console.warn("⚠️ RATE LIMIT HIT:", {
          ip: key,
          type,
          count,
          penalty,
          time: new Date().toISOString(),
        });

        return res.status(429).json({
          success: false,
          code: "RATE_LIMIT_EXCEEDED",
          retryAfter: Math.ceil(penalty / 1000),
          message:
            "Too many requests. Slow down.",
          traceId: crypto.randomUUID(),
        });
      }

      next();
    } catch (err) {
      console.error(
        "❌ RATE LIMIT ERROR:",
        err.message
      );

      return res.status(500).json({
        success: false,
        code: "RATE_LIMIT_ERROR",
        message:
          "Rate limiter system failure",
      });
    }
  };
};

/**
 * =====================================
 * PRE-BUILT LIMITERS EXPORT
 * =====================================
 */
export const globalLimiter = rateLimiter(
  "GLOBAL"
);

export const apiLimiter = rateLimiter("API");

export const authLimiter = rateLimiter("AUTH");

export const premiumLimiter =
  rateLimiter("PREMIUM");

export default {
  globalLimiter,
  apiLimiter,
  authLimiter,
  premiumLimiter,
};
