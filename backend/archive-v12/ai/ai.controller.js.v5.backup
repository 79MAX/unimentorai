import { AIService } ;

/* =========================
   🧠 AI CHAT CONTROLLER (ENTERPRISE)
========================= */
export const chatWithAI = async (req, res) => {

  try {

    const { message, level } = req.body;

    // 🔐 VALIDATION
    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        code: "INVALID_MESSAGE",
        message: "Message is required and must be a string"
      });
    }

    const userLevel = level || "BEGINNER";

    // 🚀 AI CALL
    const response = await AIService.generateResponse(
      message.trim(),
      userLevel
    );

    // 📦 STRUCTURED RESPONSE (SaaS READY)
    return res.status(200).json({
      success: true,
      data: {
        response,
        level: userLevel,
        usage: {
          type: "chat"
        }
      }
    });

  } catch (err) {

    console.error("[AI_CONTROLLER_ERROR]", err);

    return res.status(500).json({
      success: false,
      code: "AI_ERROR",
      message:
        process.env.NODE_ENV === "development"
          ? err.message
          : "AI service temporarily unavailable"
    });

  }
};


