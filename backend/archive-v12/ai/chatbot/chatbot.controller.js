
const ChatAssistant = require("./ai.analytics.chatbot.assistant");
const ChatMemory = require("./ai.chat.memory");
const ChatFormatter = require("./ai.chat.formatter");

/**
 * ========================
 * 🤖 CHATBOT CONTROLLER
 * UniMentorAI SaaS API Layer
 * ========================
 * Handles HTTP requests for AI chatbot
 */

class ChatbotController {

  /**
   * ========================
   * 💬 MAIN CHAT ENDPOINT
   * ========================
   */
  async chat(req, res) {

    try {

      const { query } = req.body;
      const userId = req.user?.id || req.body.userId;

      if (!query) {
        return res.status(400).json(
          ChatFormatter.formatError("Query is required")
        );
      }

      if (!userId) {
        return res.status(400).json(
          ChatFormatter.formatError("User ID is required")
        );
      }

      /**
       * ========================
       * 🧠 LOAD MEMORY CONTEXT
       * ========================
       */
      const context = ChatMemory.buildAIContext(userId, query);

      /**
       * ========================
       * 🤖 PROCESS AI RESPONSE
       * ========================
       */
      const rawResponse = await ChatAssistant.chat(context);

      /**
       * ========================
       * 💾 SAVE TO MEMORY
       * ========================
       */
      ChatMemory.addMessage(userId, "user", query);
      ChatMemory.addMessage(userId, "assistant", JSON.stringify(rawResponse));

      /**
       * ========================
       * 🎨 FORMAT RESPONSE
       * ========================
       */
      const formatted = ChatFormatter.formatGeneric(
        rawResponse.intent || "chat",
        rawResponse
      );

      return res.status(200).json(formatted);

    } catch (error) {

      return res.status(500).json(
        ChatFormatter.formatError(error.message)
      );
    }
  }

  /**
   * ========================
   * 📊 GET CHAT MEMORY
   * ========================
   */
  async getHistory(req, res) {

    try {

      const userId = req.user?.id || req.params.userId;

      const history = ChatMemory.getMemory(userId);

      return res.status(200).json({
        success: true,
        userId,
        history
      });

    } catch (error) {

      return res.status(500).json(
        ChatFormatter.formatError(error.message)
      );
    }
  }

  /**
   * ========================
   * 🧹 CLEAR CHAT MEMORY
   * ========================
   */
  async clearHistory(req, res) {

    try {

      const userId = req.user?.id || req.body.userId;

      ChatMemory.clearMemory(userId);

      return res.status(200).json({
        success: true,
        message: "Chat history cleared"
      });

    } catch (error) {

      return res.status(500).json(
        ChatFormatter.formatError(error.message)
      );
    }
  }

  /**
   * ========================
   * 📈 CHAT STATS
   * ========================
   */
  async getStats(req, res) {

    try {

      const userId = req.user?.id || req.params.userId;

      const stats = ChatMemory.getStats(userId);

      return res.status(200).json({
        success: true,
        userId,
        stats
      });

    } catch (error) {

      return res.status(500).json(
        ChatFormatter.formatError(error.message)
      );
    }
  }
}

module.exports = new ChatbotController();
