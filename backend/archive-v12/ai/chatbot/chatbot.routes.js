
const router = require("express").Router();

const ChatbotController = require("./chatbot.controller");
const authMiddleware = require("../../auth/auth.middleware");

/**
 * ========================
 * 🤖 AI CHATBOT ROUTES
 * UniMentorAI SaaS API Layer
 * ========================
 * Handles all AI chat interactions
 */

/**
 * ========================
 * 💬 MAIN CHAT ENDPOINT
 * ========================
 */
router.post(
  "/chat",
  authMiddleware,
  ChatbotController.chat
);

/**
 * ========================
 * 📊 GET CHAT HISTORY
 * ========================
 */
router.get(
  "/history/:userId",
  authMiddleware,
  ChatbotController.getHistory
);

/**
 * ========================
 * 🧹 CLEAR CHAT HISTORY
 * ========================
 */
router.delete(
  "/history",
  authMiddleware,
  ChatbotController.clearHistory
);

/**
 * ========================
 * 📈 CHAT STATS
 * ========================
 */
router.get(
  "/stats/:userId",
  authMiddleware,
  ChatbotController.getStats
);

module.exports = router;
