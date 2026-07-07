/**
 * ==========================================
 * 🧠 MENTOR GATEWAY (OPTIMIZED)
 * UniMentorAI AI Entry Layer
 * ==========================================
 */

const MentorOrchestrator =
  require("../core/mentor.orchestrator");

class MentorGateway {

  constructor() {

    this.orchestrator =
      new MentorOrchestrator({
        contextAnalyzer: require("../core/mentor.context.analyzer"),
        memoryStore: require("../core/mentor.memory.store"),
        learningEngine: require("../core/mentor.learning.engine"),
        personalityEngine: require("../core/mentor.personality.engine"),
        difficultyAdjuster: require("../core/mentor.difficulty.adjuster"),
        dialogueEngine: require("../core/mentor.dialogue.engine"),
        responseGenerator: require("../core/mentor.response.generator"),
        feedbackLoop: require("../core/mentor.feedback.loop"),
        analyticsEngine: require("../core/mentor.analytics.engine")
      });
  }

  /**
   * ==========================================
   * MAIN CHAT ENTRY (EXPRESS READY)
   * ==========================================
   */
  async chat(req, res) {

    try {

      const {
        userId,
        message
      } = req.body || {};

      // --------------------------
      // VALIDATION LAYER (SAFE)
      // --------------------------
      if (!userId) {
        return res.status(400).json({
          success: false,
          error: "userId is required"
        });
      }

      if (!message || typeof message !== "string") {
        return res.status(400).json({
          success: false,
          error: "message must be a string"
        });
      }

      // --------------------------
      // CALL AI ORCHESTRATOR
      // --------------------------
      const result =
        await this.orchestrator.run(
          userId,
          { text: message }
        );

      // --------------------------
      // RESPONSE NORMALIZATION
      // --------------------------
      return res.json({
        success: true,

        data: {
          response:
            result.response?.response ||
            result.response,

          metadata:
            result.response?.metadata || {},

          context:
            result.context || {},

          learning:
            result.learning || {},

          timestamp:
            Date.now()
        }
      });

    } catch (error) {

      console.error(
        "[MENTOR_GATEWAY_ERROR]",
        error
      );

      return res.status(500).json({
        success: false,
        error: "Internal mentor error"
      });
    }
  }

  /**
   * ==========================================
   * HEALTH CHECK
   * ==========================================
   */
  health(req, res) {

    return res.json({
      success: true,
      status: "MENTOR_GATEWAY_OK",
      timestamp: Date.now()
    });
  }
}

module.exports =
  new MentorGateway();
