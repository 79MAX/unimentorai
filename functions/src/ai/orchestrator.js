const admin = require("firebase-admin");
const OpenAI = require("openai");

class AIOrchestrator {
  constructor() {
    if (!admin.apps.length) {
      admin.initializeApp();
    }

    this.db = admin.firestore();

    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    this.cacheTTL = 60 * 5; // 5 min
  }

  // =========================
  // 🎯 ENTRY POINT
  // =========================
  async process(input = {}) {
    try {
      const { userId, type, payload = {}, context = {} } = input;

      if (!userId || !type) {
        throw new Error("INVALID_INPUT");
      }

      await this.rateLimit(userId);

      const userContext = await this.loadUserContext(userId);

      const cacheKey = this.buildCacheKey(type, payload);
      const cached = await this.getCache(cacheKey);
      if (cached) return cached;

      const engine = this.route(type);
      const result = await this.execute(engine, payload, userContext, context);

      await this.saveTrace(userId, type, payload, result);

      await this.setCache(cacheKey, result);

      return {
        success: true,
        engine,
        result
      };

    } catch (error) {
      console.error("AI ORCHESTRATOR ERROR:", error.message);

      return {
        success: false,
        error: error.message
      };
    }
  }

  // =========================
  // 🧭 ROUTER
  // =========================
  route(type) {
    const map = {
      GENERATE_COURSE: "course",
      CORRECT_CONTENT: "correction",
      MENTORING: "mentor",
      QUIZ: "quiz",
      TRANSLATE: "translate",
      SCORE_USER: "score"
    };

    return map[type] || "fallback";
  }

  // =========================
  // ⚙️ EXECUTION
  // =========================
  async execute(engine, payload, userContext) {
    switch (engine) {
      case "course":
        return this.generateCourse(payload);

      case "correction":
        return this.correctContent(payload);

      case "mentor":
        return this.mentor(payload, userContext);

      case "quiz":
        return this.generateQuiz(payload);

      case "translate":
        return this.translate(payload);

      case "score":
        return this.computeScore(userContext);

      default:
        return this.fallback(payload);
    }
  }

  // =========================
  // 🤖 OPENAI CORE SAFE
  // =========================
  async callAI(prompt, model = "gpt-4o-mini") {
    const res = await this.openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: "You are UniMentorAI, an elite education AI." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 800
    });

    return res.choices?.[0]?.message?.content || "";
  }

  // =========================
  // 📘 COURSE ENGINE (FIXED)
  // =========================
  async generateCourse(payload) {
    const topic = payload?.topic || "Unknown topic";

    const prompt = `
Create a structured course on "${topic}".
Return:
- Title
- 5 lessons
- Summary
- Beginner explanation
`;

    const content = await this.callAI(prompt);

    return {
      type: "course",
      title: topic,
      content,
      provider: "openai"
    };
  }

  // =========================
  // ✏️ CORRECTION
  // =========================
  async correctContent(payload) {
    const text = payload?.text || "";

    const prompt = `Correct and improve this text:\n${text}`;

    const corrected = await this.callAI(prompt);

    return {
      original: text,
      corrected
    };
  }

  // =========================
  // 🧑‍🏫 MENTOR
  // =========================
  async mentor(payload, userContext) {
    const topic = payload?.topic || "skills";

    const prompt = `Act as a mentor and guide on: ${topic}`;

    const advice = await this.callAI(prompt);

    return {
      message: advice,
      level: userContext?.level || "beginner"
    };
  }

  // =========================
  // 🧪 QUIZ
  // =========================
  async generateQuiz(payload) {
    const topic = payload?.topic || "general";

    const prompt = `Create 3 quiz questions on ${topic} with answers.`;

    const quiz = await this.callAI(prompt);

    return {
      topic,
      quiz
    };
  }

  // =========================
  // 🌍 TRANSLATE
  // =========================
  async translate(payload) {
    const text = payload?.text || "";
    const lang = payload?.targetLanguage || "en";

    const prompt = `Translate to ${lang}: ${text}`;

    const translated = await this.callAI(prompt);

    return {
      original: text,
      translated,
      language: lang
    };
  }

  // =========================
  // 📊 SCORE
  // =========================
  async computeScore() {
    const score = Math.floor(Math.random() * 100);

    return {
      score,
      level: score > 80 ? "advanced" : score > 50 ? "intermediate" : "beginner"
    };
  }

  // =========================
  // ⚡ CACHE KEY FIX
  // =========================
  buildCacheKey(type, payload) {
    return `${type}_${JSON.stringify(payload || {})}`;
  }

  // =========================
  // ⚡ CACHE SYSTEM FIXED
  // =========================
  async getCache(key) {
    const doc = await this.db.collection("ai_cache").doc(key).get();

    if (!doc.exists) return null;

    const data = doc.data();
    const now = Date.now();

    if (now - data.timestamp > this.cacheTTL * 1000) return null;

    return data.value;
  }

  async setCache(key, value) {
    await this.db.collection("ai_cache").doc(key).set({
      value,
      timestamp: Date.now()
    });
  }

  // =========================
  // 🔐 RATE LIMIT FIXED
  // =========================
  async rateLimit(userId) {
    const ref = this.db.collection("rate_limits").doc(userId);
    const snap = await ref.get();

    const now = Date.now();
    const data = snap.exists ? snap.data() : { count: 0, last: now };

    const WINDOW = 60000;
    const LIMIT = 20;

    if (now - data.last > WINDOW) {
      await ref.set({ count: 1, last: now });
      return;
    }

    if (data.count >= LIMIT) {
      throw new Error("RATE_LIMIT_EXCEEDED");
    }

    await ref.update({
      count: admin.firestore.FieldValue.increment(1)
    });
  }

  // =========================
  // 🧠 USER CONTEXT
  // =========================
  async loadUserContext(userId) {
    const doc = await this.db.collection("users").doc(userId).get();
    return doc.exists ? doc.data() : {};
  }

  // =========================
  // 💾 TRACE
  // =========================
  async saveTrace(userId, type, input, output) {
    await this.db.collection("ai_traces").add({
      userId,
      type,
      input,
      output,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }

  // =========================
  // 🔄 FALLBACK
  // =========================
  fallback(payload) {
    return {
      message: "AI fallback response",
      data: payload
    };
  }
}

module.exports = AIOrchestrator;
