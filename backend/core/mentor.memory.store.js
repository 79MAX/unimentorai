class MentorMemoryStore {
  constructor() {
    // fallback in-memory cache (MVP SAFE)
    this.cache = new Map();
  }

  // =========================
  // 💾 GET USER MEMORY
  // =========================
  async get(userId) {
    if (!userId) return {};

    // 1. check cache first
    const cached = this.cache.get(userId);
    if (cached) return cached;

    // 2. fallback empty memory
    return {
      userId,
      history: [],
      profile: {
        level: "unknown",
        topics: [],
        lastActive: null
      }
    };
  }

  // =========================
  // 💾 SAVE USER MEMORY
  // =========================
  async set(userId, data = {}) {
    if (!userId) return;

    const existing = await this.get(userId);

    const updated = {
      ...existing,
      ...data,
      userId,
      profile: {
        ...existing.profile,
        ...(data.profile || {})
      },
      history: [
        ...(existing.history || []),
        ...(data.history || [])
      ].slice(-50) // LIMIT MEMORY SIZE (important)
    };

    this.cache.set(userId, updated);

    return updated;
  }

  // =========================
  // 🧠 ADD CONVERSATION ENTRY
  // =========================
  async addMessage(userId, message, response) {
    const memory = await this.get(userId);

    const entry = {
      message,
      response,
      timestamp: Date.now()
    };

    return this.set(userId, {
      history: [...(memory.history || []), entry]
    });
  }

  // =========================
  // 📊 UPDATE USER PROFILE
  // =========================
  async updateProfile(userId, profileUpdate = {}) {
    const memory = await this.get(userId);

    return this.set(userId, {
      profile: {
        ...memory.profile,
        ...profileUpdate,
        lastActive: Date.now()
      }
    });
  }

  // =========================
  // 🧹 CLEAR MEMORY (OPTIONAL)
  // =========================
  async clear(userId) {
    this.cache.delete(userId);

    return {
      success: true,
      message: "Memory cleared"
    };
  }
}

export default MentorMemoryStore;
