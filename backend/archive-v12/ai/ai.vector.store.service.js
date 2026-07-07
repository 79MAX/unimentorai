const AIMetricsService = require("../ai.metrics.service");

/**
 * AI VECTOR STORE SERVICE - UniMentorAI
 * RAG + Semantic memory + embedding simulation layer
 * Role: Long-term knowledge retrieval brain
 */

class AIVectorStoreService {

  constructor() {
    // 🧠 In-memory vector DB (replace with Pinecone / Weaviate / FAISS in prod)
    this.vectors = [];
    this.indexByUser = new Map();
    this.indexByTopic = new Map();

    this.metrics = AIMetricsService;
  }

  /**
   * 🧠 STORE EMBEDDING (SIMULATED VECTOR)
   */
  async store({ userId, text, metadata = {} }) {

    const vector = this.generatePseudoVector(text);

    const entry = {
      id: this.generateId(),
      userId,
      text,
      vector,
      metadata,
      timestamp: Date.now(),
    };

    this.vectors.push(entry);

    // ========================
    // USER INDEX
    // ========================
    if (!this.indexByUser.has(userId)) {
      this.indexByUser.set(userId, []);
    }
    this.indexByUser.get(userId).push(entry);

    // ========================
    // TOPIC INDEX
    // ========================
    const topic = this.extractTopic(text);

    if (!this.indexByTopic.has(topic)) {
      this.indexByTopic.set(topic, []);
    }
    this.indexByTopic.get(topic).push(entry);

    return entry.id;
  }

  /**
   * 🔍 SEMANTIC SEARCH (CORE RAG FUNCTION)
   */
  async search({ query, userId, limit = 5 }) {

    const queryVector = this.generatePseudoVector(query);

    const scored = this.vectors.map(item => ({
      ...item,
      score: this.cosineSimilarity(queryVector, item.vector),
    }));

    const filtered = scored
      .filter(v => !userId || v.userId === userId)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return filtered.map(f => ({
      text: f.text,
      metadata: f.metadata,
      score: f.score,
    }));
  }

  /**
   * 🧠 USER MEMORY RETRIEVAL (RAG FOR AGENTS)
   */
  async getUserContext(userId, query) {

    const results = await this.search({
      query,
      userId,
      limit: 10,
    });

    return {
      userId,
      context: results,
    };
  }

  /**
   * 📚 TOPIC RETRIEVAL
   */
  getByTopic(topic) {
    return this.indexByTopic.get(topic) || [];
  }

  /**
   * 🧠 PSEUDO VECTOR GENERATION (NO ML DEPENDENCY)
   */
  generatePseudoVector(text) {

    const words = text.toLowerCase().split(" ");

    const vector = new Array(16).fill(0);

    words.forEach((w, i) => {
      const index = w.charCodeAt(0) % 16;
      vector[index] += 1;
    });

    return vector;
  }

  /**
   * 📐 COSINE SIMILARITY
   */
  cosineSimilarity(a, b) {

    let dot = 0;
    let magA = 0;
    let magB = 0;

    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      magA += a[i] * a[i];
      magB += b[i] * b[i];
    }

    return dot / (Math.sqrt(magA) * Math.sqrt(magB) + 1e-10);
  }

  /**
   * 🧠 TOPIC EXTRACTION (LIGHT NLP)
   */
  extractTopic(text = "") {

    const keywords = text
      .toLowerCase()
      .split(" ")
      .filter(w => w.length > 4);

    return keywords[0] || "general";
  }

  /**
   * 🆔 ID GENERATOR
   */
  generateId() {
    return "vec_" + Math.random().toString(36).substring(2, 10);
  }

  /**
   * 📊 VECTOR STORE STATS
   */
  async getStats() {

    return {
      totalVectors: this.vectors.length,
      users: this.indexByUser.size,
      topics: this.indexByTopic.size,
    };
  }

  /**
   * 🧹 CLEAN OLD VECTORS
   */
  async cleanup(maxAgeMs = 7 * 24 * 60 * 60 * 1000) {

    const now = Date.now();

    this.vectors = this.vectors.filter(v => {
      return now - v.timestamp < maxAgeMs;
    });

    return true;
  }
}

module.exports = new AIVectorStoreService();
