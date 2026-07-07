import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

/**
 * =====================================
 * SECURITY HEADERS (OWASP TOP 10 READY)
 * =====================================
 */
export const securityHeaders = helmet({
  crossOriginResourcePolicy: {
    policy: "cross-origin",
  },

  crossOriginOpenerPolicy: {
    policy: "same-origin",
  },

  hidePoweredBy: true,

  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },

  frameguard: {
    action: "deny",
  },
});

/**
 * =====================================
 * CORS CONFIG (PRODUCTION SAFE)
 * =====================================
 */
export const corsConfig = cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.CLIENT_URL,
      "http://localhost:5173",
      "http://localhost:5174",
    ];

    // allow mobile apps / postman / server-to-server
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(
      new Error("CORS NOT ALLOWED"),
      false
    );
  },

  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],
});

/**
 * =====================================
 * GLOBAL RATE LIMITER (ANTI-DDOS)
 * =====================================
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 1000, // max requests per IP

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many requests. Please slow down.",
  },
});

/**
 * =====================================
 * AUTH RATE LIMITER (BRUTE FORCE PROTECTION)
 * =====================================
 */
export const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many login attempts. Try again later.",
  },
});

/**
 * =====================================
 * API ABUSE LIMITER (GENERAL ENDPOINTS)
 * =====================================
 */
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 200,

  message: {
    success: false,
    message: "API rate limit exceeded",
  },
});

/**
 * =====================================
 * PAYMENT PROTECTION (CRITICAL)
 * =====================================
 */
export const paymentLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 30,

  message: {
    success: false,
    message:
      "Too many payment requests. Please retry later.",
  },
});

/**
 * =====================================
 * EXPORT LAYER (CLEAN ARCHITECTURE)
 * =====================================
 */
export default {
  securityHeaders,
  corsConfig,
  globalLimiter,
  authLimiter,
  apiLimiter,
  paymentLimiter,
};
