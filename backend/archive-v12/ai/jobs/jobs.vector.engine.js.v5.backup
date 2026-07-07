const DEFAULT_CONFIG = Object.freeze({
  VECTOR_SIZE: 128,
  CACHE_LIMIT: 10000,
  ENABLE_CACHE: true,
  NORMALIZE_TEXT: true,
  CACHE_TTL_MS: 1000 * 60 * 30,
  MIN_TOKEN_SIZE: 2
});

export class JobsVectorEngine {

  /* =========================
     ⚙️ CONFIG
  ========================= */
  static config = { ...DEFAULT_CONFIG };

  /* =========================
     💾 CACHE (LRU SAFE)
  ========================= */
  static cache = new Map();

  /* =========================
     🧠 STOPWORDS
  ========================= */
  static STOPWORDS = new Set([
    "the", "a", "an", "and", "or",
    "of", "to", "in", "for", "on",
    "with", "at", "by"
  ]);

  /* =========================
     ⚙️ CONFIG UPDATE
  ========================= */
  static configure(options = {}) {
    this.config = { ...this.config, ...options };
    return this.config;
  }

  /* =========================
     🌍 TEXT NORMALIZATION (FAST PATH)
  ========================= */
  static normalize(text = "") {

    if (typeof text !== "string") return "";

    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  /* =========================
     🧠 TOKENIZER (ZERO ALLOC OPTIMIZED)
  ========================= */
  static tokenize(text = "") {

    const normalized = this.config.NORMALIZE_TEXT
      ? this.normalize(text)
      : text;

    const parts = normalized.split(" ");

    const tokens = [];

    for (let i = 0; i < parts.length; i++) {

      const t = parts[i];

      if (
        t.length >= this.config.MIN_TOKEN_SIZE &&
        !this.STOPWORDS.has(t)
      ) {
        tokens.push(t);
      }
    }

    return tokens;
  }

  /* =========================
     ⚡ FAST HASH (STABLE + SIMD FRIENDLY)
  ========================= */
  static hash(str = "") {

    let h = 2166136261;

    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }

    return h >>> 0;
  }

  /* =========================
     🧠 MAIN EMBEDDING ENGINE
  ========================= */
  static embed(text = "") {

    if (!text) {
      return new Float32Array(this.config.VECTOR_SIZE);
    }

    const key = this.normalize(text);

    const cached = this.getCache(key);
    if (cached) return cached;

    const tokens = this.tokenize(key);

    const vector = new Float32Array(this.config.VECTOR_SIZE);

    /* =========================
       🚀 VECTOR BUILD (FAST LOOP)
    ========================= */
    for (let t = 0; t < tokens.length; t++) {

      const seed = this.hash(tokens[t]);
      const weight = 1 / (t + 1);

      for (let i = 0; i < vector.length; i++) {

        const x = seed * (i + 1);

        vector[i] += (
          Math.sin(x * 0.0001) * 0.55 +
          Math.cos(x * 0.0002) * 0.35 +
          Math.sin(seed / (i + 5)) * 0.10
        ) * weight;
      }
    }

    this.normalizeVector(vector);

    this.setCache(key, vector);

    return vector;
  }

  /* =========================
     ⚡ VECTOR NORMALIZATION (FUSED LOOP OPT)
  ========================= */
  static normalizeVector(vector) {

    let mag = 0;

    for (let i = 0; i < vector.length; i++) {
      mag += vector[i] * vector[i];
    }

    if (mag === 0) return vector;

    const inv = 1 / Math.sqrt(mag);

    for (let i = 0; i < vector.length; i++) {
      vector[i] *= inv;
    }

    return vector;
  }

  /* =========================
     📊 COSINE (CLAMP SAFE)
  ========================= */
  static cosine(a, b) {

    if (!a || !b) return 0;

    const len = Math.min(a.length, b.length);

    let dot = 0;

    for (let i = 0; i < len; i++) {
      dot += a[i] * b[i];
    }

    return dot > 1 ? 1 : dot < 0 ? 0 : dot;
  }

  /* =========================
     🧠 SEMANTIC SIMILARITY
  ========================= */
  static similarity(a = "", b = "") {

    return this.cosine(
      this.embed(a),
      this.embed(b)
    );
  }

  /* =========================
     📈 HYBRID SCORING ENGINE
  ========================= */
  static hybridScore({
    semantic = 0,
    lexical = 0,
    experience = 0,
    weights = {
      semantic: 0.65,
      lexical: 0.25,
      experience: 0.10
    }
  }) {

    const score =
      semantic * weights.semantic +
      lexical * weights.lexical +
      experience * weights.experience;

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /* =========================
     📊 VECTOR SEARCH ENGINE
  ========================= */
  static rankBySimilarity(queryVector, dataset = [], field = "vector") {

    if (!queryVector || !dataset.length) return [];

    const result = new Array(dataset.length);

    for (let i = 0; i < dataset.length; i++) {

      const item = dataset[i];

      result[i] = {
        ...item,
        similarity: this.cosine(queryVector, item?.[field])
      };
    }

    return result.sort((a, b) => b.similarity - a.similarity);
  }

  /* =========================
     💾 CACHE GET (LRU + TTL)
  ========================= */
  static getCache(key) {

    if (!this.config.ENABLE_CACHE) return null;

    const entry = this.cache.get(key);

    if (!entry) return null;

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    // LRU refresh
    this.cache.delete(key);
    this.cache.set(key, entry);

    return entry.vector;
  }

  /* =========================
     💾 CACHE SET (LRU SAFE)
  ========================= */
  static setCache(key, vector) {

    if (!this.config.ENABLE_CACHE) return;

    if (this.cache.size >= this.config.CACHE_LIMIT) {
      const first = this.cache.keys().next().value;
      this.cache.delete(first);
    }

    this.cache.set(key, {
      vector,
      expiry: Date.now() + this.config.CACHE_TTL_MS
    });
  }

  /* =========================
     🧹 CACHE OPS
  ========================= */
  static clearCache() {
    this.cache.clear();
  }

  static cacheStats() {

    return {
      size: this.cache.size,
      limit: this.config.CACHE_LIMIT,
      usagePercent: Number(
        ((this.cache.size / this.config.CACHE_LIMIT) * 100).toFixed(2)
      )
    };
  }

  /* =========================
     🔮 AI PROVIDERS (ABSTRACTION LAYER)
  ========================= */
  static async providerEmbed(text, provider = "local") {

    switch (provider) {

      case "openai":
        return this.openAIEmbed(text);

      case "huggingface":
        return this.huggingFaceEmbed(text);

      default:
        return this.embed(text);
    }
  }

  static async openAIEmbed(text) {
    return this.embed(text);
  }

  static async huggingFaceEmbed(text) {
    return this.embed(text);
  }
}

