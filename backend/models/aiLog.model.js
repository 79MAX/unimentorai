/**
 * 🤖 AI LOG MODEL — UNIMENTORAI (PRODUCTION READY)
 */

export const AiLogModel = {

  collection: "ai_logs",

  // 🧠 AI INTENTS
  intents: [
    "GENERAL_EDUCATION",
    "MATH",
    "SCIENCE",
    "TRANSLATION",
    "AFRICA_CONTEXT",
    "QUIZ_HELP",
    "CAREER_GUIDANCE"
  ],

  // 🚀 AI LOG SCHEMA
  schema: (data = {}) => {

    const now = Date.now();

    return {

      // 🆔 IDENTITY
      id: data.id || generateAiLogId(),

      userId:
        data.userId || null,

      courseId:
        data.courseId || null,

      organizationId:
        data.organizationId || null,

      // 🧠 AI INPUT
      question:
        sanitizeText(data.question),

      intent:
        AiLogModel.intents.includes(data.intent)
          ? data.intent
          : "GENERAL_EDUCATION",

      // 🤖 AI OUTPUT
      response:
        sanitizeText(data.response),

      // ⚙️ AI ENGINE
      aiProvider:
        data.aiProvider || "OPENAI",

      model:
        data.model || "gpt-5.5",

      temperature:
        data.temperature || 0.7,

      // 📊 TOKEN + COST TRACKING
      usage: {
        tokensUsed:
          validateNumber(data.usage?.tokensUsed),

        promptTokens:
          validateNumber(data.usage?.promptTokens),

        completionTokens:
          validateNumber(data.usage?.completionTokens),

        estimatedCost:
          validateNumber(data.usage?.estimatedCost)
      },

      // 🌍 LANGUAGE SYSTEM
      language:
        data.language || "fr",

      translated:
        data.translated || false,

      validatedByHuman:
        data.validatedByHuman || false,

      // 📱 DEVICE / AFRICA ENGINE
      device: {
        platform:
          data.device?.platform || "mobile",

        offlineMode:
          data.device?.offlineMode || false,

        lowBandwidth:
          data.device?.lowBandwidth || false
      },

      // 🧠 LEARNING ANALYTICS
      learningContext: {
        level:
          data.learningContext?.level || "beginner",

        difficulty:
          data.learningContext?.difficulty || "medium",

        helpedUser:
          data.learningContext?.helpedUser || false
      },

      // ⚠️ ERROR TRACKING
      error: {
        hasError:
          data.error?.hasError || false,

        message:
          data.error?.message || null
      },

      // 🕒 TIMESTAMPS
      createdAt:
        data.createdAt || now
    };
  }
};

---

# 🔐 HELPERS

function sanitizeText(value = "") {

  return String(value).trim();
}

function validateNumber(value = 0) {

  const parsed = Number(value);

  if (isNaN(parsed) || parsed < 0) {
    return 0;
  }

  return parsed;
}

---

# 🆔 SAFE AI LOG ID

function generateAiLogId() {

  return (
    "AILOG_" +
    Date.now() +
    "_" +
    Math.random()
      .toString(36)
      .substring(2, 8)
  );
}

