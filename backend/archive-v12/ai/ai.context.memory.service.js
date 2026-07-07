const AIMetricsService = require("../ai.metrics.service");

/**
 * AI CONTEXT MEMORY SERVICE - UniMentorAI
 * Short-term + long-term + semantic context memory layer
 * Role: Persist intelligence across agents & sessions
 */

class AIContextMemoryService {

  constructor() {
    // 🧠 In-memory cache (replace with Redis / DB in prod)
    this.shortTermMemory = new Map(); // session-based
    this.longTermMemory = new Map();  // user-based
    this.semanticMemory = new Map();  // topic-based clustering

    this.metrics = AIMetricsService;
  }

  /**
   * 🧠 STORE CONTEXT (MAIN ENTRY)
   */
  async store({ userId, sessionId, input, output, metadata = {} }) {

    // ========================
    // 1. SHORT TERM MEMORY
    // ========================
    this.storeShortTerm(sessionId, {
      input,
      output,
      timestamp: Date.now(),
    });

    // ========================
    // 2. LONG TERM MEMORY
    // ========================
    this.storeLongTerm(userId, {
      input,
      output,
      metadata,
      timestamp: Date.now(),
    });

    // ========================
    // 3. SEMANTIC MEMORY INDEXING
    // ========================
    this.storeSemantic(input, output);

    return true;
  }

  /**
   * ⚡ SHORT TERM MEMORY (SESSION CONTEXT)
   */
  storeShortTerm(sessionId, data) {

    if (!this.shortTermMemory.has(sessionId)) {
      this.shortTermMemory.set(sessionId, []);
    }

    const session = this.shortTermMemory.get(sessionId);
    session.push(data);

    // limit memory size
    if (session.length > 20) {
      session.shift();
    }

    this.shortTermMemory.set(sessionId, session);
  }

  /**
   * 🧠 LONG TERM MEMORY (USER HISTORY)
   */
  storeLongTerm(userId, data) {

    if (!this.longTermMemory.has(userId)) {
      this.longTermMemory.set(userId, []);
    }

    const memory = this.longTermMemory.get(userId);
    memory.push(data);

    // keep last 200 interactions
    if (memory.length > 200) {
      memory.shift();
    }

    this.longTermMemory.set(userId, memory);
  }

  /**
   * 🧩 SEMANTIC MEMORY (TOPIC CLUSTERING)
   */
  storeSemantic(input, output) {

    const keywords = this.extractKeywords(input);

    keywords.forEach(keyword => {

      if (!this.semanticMemory.has(keyword)) {
        this.semanticMemory.set(keyword, []);
      }

      const cluster = this.semanticMemory.get(keyword);

      cluster.push({
        input,
        output,
        timestamp: Date.now(),
      });

      // limit cluster size
      if (cluster.length > 50) {
        cluster.shift();
      }

      this.semanticMemory.set(keyword, cluster);
    });
  }

  /**
   * 🔍 GET CONTEXT (CORE FUNCTION)
   */
  async getContext({ userId, sessionId, query }) {

    const shortTerm = this.shortTermMemory.get(sessionId) || [];
    const longTerm = this.longTermMemory.get(userId) || [];
    const semantic = this.getSemanticContext(query);

    return {
      shortTerm,
      longTerm: longTerm.slice(-10), // last interactions
      semantic,
    };
  }

  /**
   * 🧠 SEMANTIC RETRIEVAL ENGINE
   */
  getSemanticContext(query) {

    const keywords = this.extractKeywords(query);
    let results = [];

    keywords.forEach(k => {
      const cluster = this.semanticMemory.get(k);
      if (cluster) {
        results = results.concat(cluster.slice(-5));
      }
    });

    return results;
  }

  /**
   * 🧠 KEYWORD EXTRACTION (LIGHT NLP)
   */
  extractKeywords(text = "") {

    return text
      .toLowerCase()
      .split(" ")
      .filter(w => w.length > 3);
  }

  /**
   * 🔁 CLEAR SESSION MEMORY
   */
  clearSession(sessionId) {
    this.shortTermMemory.delete(sessionId);
  }

  /**
   * 🧹 RESET USER MEMORY (ADMIN)
   */
  clearUser(userId) {
    this.longTermMemory.delete(userId);
  }

  /**
   * 📊 MEMORY ANALYTICS
   */
  async getMemoryStats() {

    return {
      sessions: this.shortTermMemory.size,
      users: this.longTermMemory.size,
      semanticClusters: this.semanticMemory.size,
    };
  }
}

module.exports = new AIContextMemoryService();
