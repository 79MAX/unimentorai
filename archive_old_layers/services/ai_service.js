/**
 * 🤖 AI SERVICE CORE — UNIMENTORAI MVP (OPTIMIZED)
 * Production-grade + Africa-first + cost controlled
 */

export class AIService {

  // 🧠 MEMORY CACHE WITH TTL
  static cache = new Map();

  static config = {

    maxTokens: 500,
    cacheEnabled: true,
    fallbackMode: true,
    cacheTTL: 1000 * 60 * 60, // 1h
    maxCacheSize: 500
  };

  // 🚀 INIT SERVICE
  static async init() {

    console.log("🤖 AI SERVICE INITIALIZED");

    // preload essential education patterns
    this.setCache("math", "📊 Explication math simple");
    this.setCache("science", "🔬 Explication science simple");
    this.setCache("history", "📜 Explication histoire simple");
  }

  // 🧠 MAIN ENTRY POINT
  static async ask(question, context = {}) {

    try {

      const cacheKey = this.generateKey(question);

      // 1. CACHE CHECK
      const cached = this.getCache(cacheKey);
      if (cached) return cached;

      // 2. INTENT DETECTION (improved)
      const intent = this.detectIntent(question);

      // 3. RESPONSE GENERATION
      const response = await this.generateResponse(question, intent, context);

      // 4. STORE CACHE
      this.setCache(cacheKey, response);

      return response;

    } catch (error) {

      // 5. SAFE FALLBACK (VERY IMPORTANT)
      return this.fallbackResponse();
    }
  }

  // 🧠 ADVANCED INTENT DETECTION
  static detectIntent(question) {

    const q = question.toLowerCase();

    const patterns = [

      { type: "MATH", keywords: ["math", "calcule", "equation", "+", "-"] },
      { type: "SCIENCE", keywords: ["physics", "chimie", "science", "energy"] },
      { type: "HISTORY", keywords: ["history", "guerre", "empire", "colonial"] },
      { type: "TRANSLATION", keywords: ["translate", "traduire", "meaning"] },
      { type: "AFRICA_CONTEXT", keywords: ["africa", "benin", "nigeria", "african"] }

    ];

    for (let p of patterns) {
      if (p.keywords.some(k => q.includes(k))) {
        return p.type;
      }
    }

    return "GENERAL_EDUCATION";
  }

  // 🤖 RESPONSE ENGINE
  static async generateResponse(question, intent, context) {

    const baseResponses = {

      MATH: "📊 Voici une explication simple étape par étape.",
      SCIENCE: "🔬 Voici une explication scientifique claire avec exemple.",
      HISTORY: "📜 Voici une explication historique simplifiée.",
      TRANSLATION: "🌍 Voici une traduction adaptée avec phonétique.",
      AFRICA_CONTEXT: "🌍 Voici une explication adaptée au contexte africain.",
      GENERAL_EDUCATION: "🤖 Voici une explication simple et claire."

    };

    let response = baseResponses[intent];

    // 1. LEVEL ADAPTATION
    response = this.adaptLevel(response, context);

    // 2. LANGUAGE ADAPTATION
    response = this.adaptLanguage(response, context);

    return response;
  }

  // 🌍 LANGUAGE ADAPTER
  static adaptLanguage(text, context) {

    if (context.language === "local") {
      return text + " (adapté langue locale)";
    }

    if (context.language === "fr") {
      return text;
    }

    return text;
  }

  // 🎓 LEVEL ADAPTER
  static adaptLevel(text, context) {

    if (context.level === "beginner") {
      return text + " 👉 explication très simple";
    }

    if (context.level === "advanced") {
      return text + " 👉 version détaillée disponible";
    }

    return text;
  }

  // 💾 CACHE SYSTEM (SAFE + TTL)
  static setCache(key, value) {

    if (this.cache.size > this.config.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  static getCache(key) {

    const data = this.cache.get(key);

    if (!data) return null;

    const isExpired =
      Date.now() - data.timestamp > this.config.cacheTTL;

    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return data.value;
  }

  // 🔑 KEY GENERATION (IMPROVED)
  static generateKey(question) {
    return question
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "_")
      .slice(0, 60);
  }

  // 🚨 FALLBACK SAFE MODE
  static fallbackResponse() {
    return "🤖 Je rencontre un problème technique, réessaie dans un instant.";
  }
}
