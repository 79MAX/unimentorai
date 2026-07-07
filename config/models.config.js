export default {
  // =========================
  // CORE MODELS (PRODUCTION)
  // =========================

  fast: {
    name: "llama3.1:8b",
    timeout: 15000,
    priority: 3,
    type: "FAST"
  },

  code: {
    name: "qwen3-coder:30b",
    timeout: 180000,
    priority: 1,
    type: "CODE"
  },

  analysis: {
    name: "gemma4",
    timeout: 120000,
    priority: 2,
    type: "ANALYSIS"
  },

  general: {
    name: "llama3",
    timeout: 60000,
    priority: 4,
    type: "GENERAL"
  },

  // =========================
  // FALLBACK STRATEGY ORDER
  // =========================
  fallbackChain: [
    "llama3",
    "llama3.1:8b",
    "deepseek-r1:8b"
  ],

  // =========================
  // ENGINE SETTINGS
  // =========================
  settings: {
    maxRetries: 2,
    queueEnabled: true,
    debug: false,
    maxPromptSize: 8000
  }
};
