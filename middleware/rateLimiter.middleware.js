import rateLimit from "express-rate-limit";

/**
 * ==========================
 * BASE CONFIG ENTERPRISE
 * ==========================
 */
const windowMs = 15 * 60 * 1000; // 15 min
const maxRequests = 300; // default safe limit

/**
 * ==========================
 * STANDARD API LIMITER
 * ==========================
 */
export const apiRateLimiter = rateLimit({
  windowMs,
  max: maxRequests,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many requests, please try again later.",
    code: "RATE_LIMIT_EXCEEDED",
  },

  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message: "Rate limit exceeded. Slow down requests.",
      code: "RATE_LIMIT_EXCEEDED",
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
    });
  },
});

/**
 * ==========================
 * AUTH ROUTES STRICT LIMITER
 * ==========================
 * (login, register, reset password)
 */
export const authRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  max: 20, // strict protection

  message: {
    success: false,
    message: "Too many auth attempts. Please wait.",
    code: "AUTH_RATE_LIMIT",
  },

  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message: "Authentication rate limit reached.",
      code: "AUTH_RATE_LIMIT",
      path: req.originalUrl,
      timestamp: new Date().toISOString(),
    });
  },
});

/**
 * ==========================
 * AI / CHAT LIMITER (IMPORTANT FOR UNIMENTORAI)
 * ==========================
 */
export const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // AI-heavy system

  message: {
    success: false,
    message: "AI request limit reached. Please wait.",
    code: "AI_RATE_LIMIT",
  },

  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message: "AI system overloaded. Try again shortly.",
      code: "AI_RATE_LIMIT",
      timestamp: new Date().toISOString(),
    });
  },
});

/**
 * ==========================
 * DOWNLOAD / HEAVY ROUTES LIMITER
 * ==========================
 */
export const heavyRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1h
  max: 100,

  message: {
    success: false,
    message: "Heavy usage limit reached.",
    code: "HEAVY_RATE_LIMIT",
  },
});

/**
 * ==========================
 * EXPORT DEFAULT (SAFE FALLBACK)
 * ==========================
 */
export default apiRateLimiter;
