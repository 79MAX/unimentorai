/**
 * 🤖 AI LOG MODEL — UNIMENTORAI (PRODUCTION GRADE v2)
 * Observabilité IA + Cost tracking + Learning analytics
 */

export const AiLogModel = {

  collection: "ai_logs",

  // 🧠 INTENTS SUPPORTÉS
  intents: Object.freeze([
    "GENERAL",
    "MATH",
    "SCIENCE",
    "HISTORY",
    "TRANSLATION",
    "AFRICA_CONTEXT",
    "QUIZ_HELP",
    "CAREER_GUIDANCE"
  ]),

  // 🚀 SCHEMA PRINCIPAL
  schema: (data = {}) => {

    const now = Date.now();

    return {

      // 🆔 IDENTIFIANT
      id: data.id || AiLogModel.generateLogId(),

      // 👤 CONTEXT UTILISATEUR
      userId: data.userId ?? null,
      courseId: data.courseId ?? null,
      organizationId: data.organizationId ?? null,

      // 🧠 INPUT IA
      question: AiLogModel.sanitize(data.question),

      intent: AiLogModel.intents.includes(data.intent)
        ? data.intent
        : "GENERAL",

      language: data.language ?? "fr",

      // 🤖 OUTPUT IA
      response: AiLogModel.sanitize(data.response),

      // ⚙️ ENGINE IA
      aiProvider: data.aiProvider ?? "OPENAI",
      model: data.model ?? "gpt-5",
      temperature: data.temperature ?? 0.7,

      // ⏱️ PERFORMANCE (NOUVEAU IMPORTANT)
      performance: {
        responseTimeMs: data.performance?.responseTimeMs ?? 0,
        requestStart: data.performance?.requestStart ?? null,
        requestEnd: data.performance?.requestEnd ?? null
      },

      // 📊 TOKEN + COST CONTROL
      usage: {
        tokensUsed: AiLogModel.validateNumber(data.usage?.tokensUsed),
        promptTokens: AiLogModel.validateNumber(data.usage?.promptTokens),
        completionTokens: AiLogModel.validateNumber(data.usage?.completionTokens),
        estimatedCost: AiLogModel.validateNumber(data.usage?.estimatedCost),
        currency: data.usage?.currency ?? "USD"
      },

      // 🌍 DEVICE + AFRICA OPTIMIZATION
      device: {
        platform: data.device?.platform ?? "mobile",
        offlineMode: Boolean(data.device?.offlineMode),
        lowBandwidth: Boolean(data.device?.lowBandwidth),
        networkType: data.device?.networkType ?? "unknown"
      },

      // 🧠 LEARNING ANALYTICS
      learning: {
        level: data.learning?.level ?? "beginner",
        difficulty: data.learning?.difficulty ?? "medium",
        helpedUser: Boolean(data.learning?.helpedUser),
        accuracyScore: data.learning?.accuracyScore ?? null
      },

      // 👨‍🏫 HUMAN VALIDATION (IMPORTANT MVP AFRIQUE)
      validation: {
        humanChecked: Boolean(data.validation?.humanChecked),
        corrected: Boolean(data.validation?.corrected),
        validatorId: data.validation?.validatorId ?? null
      },

      // ⚠️ ERROR TRACKING
      error: {
        hasError: Boolean(data.error?.hasError),
        message: data.error?.message ?? null,
        stack: data.error?.stack ?? null
      },

      // 📦 VERSIONING (IMPORTANT POUR EVOLUTION IA)
      version: "1.0.0",

      createdAt: data.createdAt ?? now
    };
  },

  // 🔧 HELPERS ENCAPSULÉS (PROPRE ARCHITECTURE)
  sanitize(text = "") {
    return String(text || "").trim();
  },

  validateNumber(value = 0) {

    const n = Number(value);

    if (!Number.isFinite(n) || n < 0) return 0;

    return n;
  },

  generateLogId() {

    return (
      "AILOG_" +
      Date.now() +
      "_" +
      Math.random().toString(36).substring(2, 10)
    );
  }
};

