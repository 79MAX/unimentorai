
/**
 * ==========================================
 * 🧠 MENTOR MEMORY STORE ENGINE
 * UniMentorAI Long-Term Cognitive Memory
 * ==========================================
 * Responsible for:
 * - user learning history
 * - skill evolution tracking
 * - contextual memory retrieval
 * - experience persistence
 * - learning continuity
 */

class MentorMemoryStore {

  constructor() {

    // In-memory storage (replace with DB in production)
    this.store = new Map();
  }

  /**
   * ==========================================
   * GET USER MEMORY
   * ==========================================
   */
  get(userId) {

    if (!this.store.has(userId)) {
      this.store.set(userId, this.createEmptyProfile(userId));
    }

    return this.store.get(userId);
  }

  /**
   * ==========================================
   * INITIAL MEMORY STRUCTURE
   * ==========================================
   */
  createEmptyProfile(userId) {

    return {
      userId,

      createdAt: Date.now(),

      history: [],

      skills: {},

      progress: 0,

      weaknesses: [],

      strengths: [],

      learningPatterns: {

        preferredStyle: "unknown",
        bestDifficulty: "medium",
        attentionSpan: 0
      },

      emotionalProfile: {

        frustrationLevel: 0,
        motivationLevel: 0.5
      }
    };
  }

  /**
   * ==========================================
   * STORE INTERACTION
   * ==========================================
   */
  store(userId, data) {

    const memory = this.get(userId);

    // Add interaction to history
    memory.history.push({
      input: data.input,
      response: data.response,
      context: data.context,
      learningState: data.learningState,
      timestamp: Date.now()
    });

    // Limit history size (performance control)
    if (memory.history.length > 500) {
      memory.history.shift();
    }

    // Update progress
    this.updateProgress(memory, data);

    // Update skill map
    this.updateSkills(memory, data);

    // Update behavioral patterns
    this.updatePatterns(memory, data);

    this.store.set(userId, memory);
  }

  /**
   * ==========================================
   * PROGRESS TRACKING
   * ==========================================
   */
  updateProgress(memory, data) {

    const learning = data.learningState;

    if (!learning) return;

    if (learning.correctAnswer) {
      memory.progress += 2;
    }

    if (learning.levelUp) {
      memory.progress += 10;
    }

    memory.progress = Math.min(memory.progress, 100);
  }

  /**
   * ==========================================
   * SKILL EVOLUTION TRACKING
   * ==========================================
   */
  updateSkills(memory, data) {

    const topic = data.context?.topic || "general";

    if (!memory.skills[topic]) {
      memory.skills[topic] = {
        level: 1,
        attempts: 0,
        successRate: 0
      };
    }

    const skill = memory.skills[topic];

    skill.attempts += 1;

    if (data.learningState?.success) {
      skill.successRate =
        (skill.successRate + 1) / skill.attempts;
    }

    if (skill.successRate > 0.7 && skill.attempts > 5) {
      skill.level += 1;
    }
  }

  /**
   * ==========================================
   * BEHAVIOR PATTERN ANALYSIS
   * ==========================================
   */
  updatePatterns(memory, data) {

    const engagement =
      data.context?.engagement || 0.5;

    const confusion =
      data.context?.confusion || 0.2;

    // Adjust motivation
    memory.emotionalProfile.motivationLevel +=
      engagement > 0.6 ? 0.05 : -0.03;

    memory.emotionalProfile.motivationLevel =
      Math.max(0, Math.min(1, memory.emotionalProfile.motivationLevel));

    // Track frustration
    if (confusion > 0.7) {
      memory.emotionalProfile.frustrationLevel += 0.1;
    }

    // Determine preferred learning style
    if (engagement > 0.7) {
      memory.learningPatterns.preferredStyle = "interactive";
    }

    if (confusion < 0.3 && engagement > 0.6) {
      memory.learningPatterns.preferredStyle = "step-by-step";
    }
  }

  /**
   * ==========================================
   * MEMORY SUMMARY FOR AI CONTEXT
   * ==========================================
   */
  summary(userId) {

    const memory = this.get(userId);

    return {
      progress: memory.progress,
      topSkills: this.getTopSkills(memory),
      motivation: memory.emotionalProfile.motivationLevel,
      frustration: memory.emotionalProfile.frustrationLevel,
      preferredStyle: memory.learningPatterns.preferredStyle
    };
  }

  /**
   * ==========================================
   * GET TOP SKILLS
   * ==========================================
   */
  getTopSkills(memory) {

    return Object.entries(memory.skills)
      .sort((a, b) => b[1].level - a[1].level)
      .slice(0, 3)
      .map(([topic, data]) => ({
        topic,
        level: data.level
      }));
  }

  /**
   * ==========================================
   * RESET USER MEMORY (OPTIONAL)
   * ==========================================
   */
  reset(userId) {
    this.store.set(userId, this.createEmptyProfile(userId));
  }
}

module.exports = MentorMemoryStore;
