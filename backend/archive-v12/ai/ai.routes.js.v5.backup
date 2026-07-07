import express from "express";
import { chatWithAI } from "./ai.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

/* =========================
   🚦 AI RATE LIMIT (ANTI ABUSE)
========================= */
const aiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // 20 AI requests/min per user
  message: {
    success: false,
    code: "AI_RATE_LIMIT",
    message: "Too many AI requests, slow down"
  },
  standardHeaders: true,
  legacyHeaders: false
});

/* =========================
   🧠 AI CHAT ROUTE (ENTERPRISE)
========================= */
router.post(
  "/chat",
  protect,
  aiLimiter,
  chatWithAI
);

export default router;

