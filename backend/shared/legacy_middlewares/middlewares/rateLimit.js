import rateLimit from "express-rate-limit";

/* =========================
   🚦 GLOBAL API RATE LIMIT (PRODUCTION READY)
========================= */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes

  // 🔥 dynamique (plus flexible SaaS)
  max: process.env.RATE_LIMIT_MAX || 100,

  message: {
    success: false,
    error: "TOO_MANY_REQUESTS",
    retryAfter: "15 minutes"
  },

  standardHeaders: true,
  legacyHeaders: false,

  /* =========================
     🧠 CUSTOM HANDLING
  ========================= */
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: "RATE_LIMIT_EXCEEDED",
      message: "You are sending too many requests. Please slow down."
    });
  }
});

