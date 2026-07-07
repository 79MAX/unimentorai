/**
 * VIDEO TUTOR SESSION MEMORY - UniMentorAI
 * Long-term session memory system for AI Tutor learning intelligence
 */

class VideoTutorSessionMemory {
  constructor({ logger }) {
    this.logger = logger;

    // in-memory session history (swap to DB / Redis / S3 in production)
    this.memoryStore = new Map();
  }

  /**
   * 🧠 Initialize user memory store
   */
  init(userId) {
    if (!this.memoryStore.has(userId)) {
      this.memoryStore.set(userId, {
        userId,
        sessions: [],
        aggregatedInsights: {
          totalSessions: 0,
          totalWatchTime: 0,
          averageEngagement: 0,
          dominantBehavior: null,
          skillProgressionTrend: []
        }
      });
    }

    return this.memoryStore.get(userId);
  }

  /**
   * 📦 Save a session snapshot
   */
  saveSession(userId, sessionData) {
    const memory = this.init(userId);

    const sessionRecord = {
      sessionId: sessionData.sessionId || this._generateId(),
      courseId: sessionData.courseId,
      videoId: sessionData.videoId,

      metrics: {
        watchTime: sessionData.watchTime || 0,
        completionRate: sessionData.completionRate || 0,
        engagement: sessionData.engagement || 0,
        frustration: sessionData.frustration || 0,
        rewatchCount: sessionData.rewatchCount || 0
      },

      behavior: sessionData.behavior || {},
      ltvSnapshot: sessionData.ltv || {},
      timestamp: Date.now()
    };

    memory.sessions.push(sessionRecord);

    this._updateAggregates(memory, sessionRecord);

    this.memoryStore.set(userId, memory);

    return sessionRecord;
  }

  /**
   * 📊 Update aggregated intelligence
   */
  _updateAggregates(memory, session) {
    const agg = memory.aggregatedInsights;

    agg.totalSessions += 1;
    agg.totalWatchTime += session.metrics.watchTime;

    // rolling engagement average
    agg.averageEngagement =
      (agg.averageEngagement + session.metrics.engagement) / 2;

    // track progression trend
    agg.skillProgressionTrend.push({
      timestamp: session.timestamp,
      completion: session.metrics.completionRate
    });

    // limit trend size (performance optimization)
    if (agg.skillProgressionTrend.length > 100) {
      agg.skillProgressionTrend.shift();
    }

    // detect dominant behavior (simple heuristic)
    agg.dominantBehavior = this._detectDominantBehavior(memory.sessions);
  }

  /**
   * 🧠 Detect dominant behavior pattern
   */
  _detectDominantBehavior(sessions) {
    const patterns = {
      fast_learner: 0,
      deep_learner: 0,
      struggling: 0
    };

    sessions.forEach((s) => {
      if (s.metrics.completionRate > 0.8) patterns.fast_learner++;
      else if (s.metrics.rewatchCount > 2) patterns.deep_learner++;
      else if (s.metrics.frustration > 0.6) patterns.struggling++;
    });

    return Object.entries(patterns).sort((a, b) => b[1] - a[1])[0][0];
  }

  /**
   * 📚 Get full session history
   */
  getSessions(userId) {
    return this.init(userId).sessions;
  }

  /**
   * 🔍 Get last N sessions
   */
  getRecentSessions(userId, limit = 5) {
    const memory = this.init(userId);
    return memory.sessions.slice(-limit);
  }

  /**
   * 🧠 Get learning profile summary
   */
  getLearningProfile(userId) {
    const memory = this.init(userId);

    return {
      ...memory.aggregatedInsights,
      sessionCount: memory.sessions.length
    };
  }

  /**
   * 🧾 Generate session ID
   */
  _generateId() {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  }

  /**
   * 🧹 Clear user memory
   */
  clear(userId) {
    this.memoryStore.delete(userId);
  }
}

module.exports = VideoTutorSessionMemory;
