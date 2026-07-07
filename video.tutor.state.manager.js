/**
 * VIDEO TUTOR STATE MANAGER - UniMentorAI
 * Central state management system for AI Tutor ecosystem
 */

class VideoTutorStateManager {
  constructor({ logger }) {
    this.logger = logger;

    // in-memory state store (replace with Redis / DB in production)
    this.stateStore = new Map();
  }

  /**
   * 🎯 Initialize user state
   */
  initState(userId) {
    if (!this.stateStore.has(userId)) {
      this.stateStore.set(userId, {
        userId,

        session: {
          active: true,
          startTime: Date.now(),
          lastActivity: Date.now()
        },

        learning: {
          currentCourse: null,
          currentLesson: null,
          progress: 0,
          streak: 0
        },

        behavior: {
          classification: "unknown",
          history: []
        },

        ai: {
          contextMemory: [],
          lastResponse: null
        },

        business: {
          ltv: 0,
          segment: "unknown",
          monetizationLevel: "none"
        }
      });
    }

    return this.stateStore.get(userId);
  }

  /**
   * 🧠 Get current state
   */
  getState(userId) {
    return this.stateStore.get(userId) || this.initState(userId);
  }

  /**
   * ⚙️ Update state safely
   */
  updateState(userId, patch = {}) {
    const current = this.getState(userId);

    const updated = this._deepMerge(current, patch);

    updated.session.lastActivity = Date.now();

    this.stateStore.set(userId, updated);

    return updated;
  }

  /**
   * 🔄 Merge utility (safe deep merge)
   */
  _deepMerge(target, source) {
    for (const key in source) {
      if (
        source[key] &&
        typeof source[key] === "object" &&
        !Array.isArray(source[key])
      ) {
        target[key] = this._deepMerge(target[key] || {}, source[key]);
      } else {
        target[key] = source[key];
      }
    }

    return target;
  }

  /**
   * 🧠 Append AI context memory
   */
  addMemory(userId, memory) {
    const state = this.getState(userId);

    state.ai.contextMemory.push({
      ...memory,
      timestamp: Date.now()
    });

    // limit memory size (performance control)
    if (state.ai.contextMemory.length > 50) {
      state.ai.contextMemory.shift();
    }

    this.stateStore.set(userId, state);

    return state;
  }

  /**
   * 📊 Update learning progress
   */
  updateLearning(userId, data) {
    return this.updateState(userId, {
      learning: {
        ...this.getState(userId).learning,
        ...data
      }
    });
  }

  /**
   * 🧠 Update behavior state
   */
  updateBehavior(userId, behavior) {
    const state = this.getState(userId);

    state.behavior.classification = behavior.classification;

    state.behavior.history.push({
      type: behavior.type,
      timestamp: Date.now()
    });

    this.stateStore.set(userId, state);

    return state;
  }

  /**
   * 💰 Update business state (LTV + monetization)
   */
  updateBusiness(userId, businessData) {
    return this.updateState(userId, {
      business: {
        ...this.getState(userId).business,
        ...businessData
      }
    });
  }

  /**
   * 🧾 Reset session (new video / course / restart)
   */
  resetSession(userId) {
    const state = this.getState(userId);

    state.session = {
      active: true,
      startTime: Date.now(),
      lastActivity: Date.now()
    };

    this.stateStore.set(userId, state);

    return state;
  }

  /**
   * 📦 Clear full state (logout / purge)
   */
  clearState(userId) {
    this.stateStore.delete(userId);
  }
}

module.exports = VideoTutorStateManager;
