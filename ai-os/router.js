export default class AIRouter {

  constructor(config = {}) {

    this.models = {
      CODE: "qwen2.5-coder:7b",
      ANALYSIS: "deepseek-r1:8b",
      FAST: "llama3.1:8b",
      GENERAL: "llama3"
    };

    this.patterns = {
      CODE: /(bug|error|fix|refactor|debug|code|api|crash|issue|stack|exception)/i,
      ANALYSIS: /(analyse|analyze|optimize|architecture|design|explain|why|how|reason)/i
    };

    this.cache = new Map();
    this.ttl = 1000 * 60 * 5; // 5 min cache

    this.debug = config.debug || false;
  }

  // =========================
  // NORMALIZER (ROBUST)
  // =========================
  normalize(text = "") {
    return String(text)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  }

  // =========================
  // INTENT ENGINE (SMART)
  // =========================
  detectIntent(text = "") {

    const t = this.normalize(text);
    const words = t.split(" ");
    const len = t.length;

    const isCode = this.patterns.CODE.test(t);
    const isAnalysis = this.patterns.ANALYSIS.test(t);

    // 🔥 PRIORITY 1: CODE
    if (isCode) return "CODE";

    // 🔥 PRIORITY 2: ANALYSIS
    if (isAnalysis) return "ANALYSIS";

    // 🔥 PRIORITY 3: FAST (smart rule)
    const isShortQuery = words.length <= 6 && len < 40;

    if (isShortQuery) return "FAST";

    return "GENERAL";
  }

  // =========================
  // MODEL SELECTOR
  // =========================
  selectModel(intent = "GENERAL") {
    return this.models[intent] || this.models.GENERAL;
  }

  // =========================
  // CACHE KEY SAFE
  // =========================
  getCacheKey(message) {
    return this.normalize(message);
  }

  // =========================
  // MAIN API
  // =========================
  chat(message) {

    if (!message || typeof message !== "string") {
      return {
        status: "error",
        error: "INVALID_MESSAGE"
      };
    }

    const key = this.getCacheKey(message);

    const cached = this.cache.get(key);

    // 🔥 TTL check
    if (cached && Date.now() - cached.timestamp < this.ttl) {
      return {
        ...cached,
        cached: true
      };
    }

    const intent = this.detectIntent(message);
    const model = this.selectModel(intent);

    const result = {
      status: "ok",
      intent,
      model,
      input: message,
      timestamp: Date.now()
    };

    this.cache.set(key, result);

    return result;
  }

  // =========================
  // DEBUG TOOL
  // =========================
  inspect() {
    return {
      models: this.models,
      cacheSize: this.cache.size,
      ttl: this.ttl
    };
  }
}
