
/**
 * ==========================================
 * 🕸️ MENTOR SKILL GRAPH ENGINE
 * UniMentorAI Knowledge Graph System
 * ==========================================
 * Responsible for:
 * - skill relationship modeling
 * - mastery tracking per node
 * - prerequisite management
 * - learning path generation support
 * - adaptive knowledge navigation
 */

class MentorSkillGraph {

  constructor() {

    this.graph = new Map();
  }

  /**
   * ==========================================
   * GET OR CREATE SKILL NODE
   * ==========================================
   */
  get(skillId) {

    if (!this.graph.has(skillId)) {
      this.graph.set(skillId, this.createNode(skillId));
    }

    return this.graph.get(skillId);
  }

  /**
   * ==========================================
   * INITIAL SKILL NODE STRUCTURE
   * ==========================================
   */
  createNode(skillId) {

    return {
      skillId,

      // --------------------------------------
      // MASTERY STATE
      // --------------------------------------
      mastery: 0,
      attempts: 0,

      // --------------------------------------
      // RELATIONSHIPS
      // --------------------------------------
      prerequisites: [],
      unlocks: [],
      relatedSkills: [],

      // --------------------------------------
      // LEARNING STATE
      // --------------------------------------
      status: "locked", // locked | learning | mastered

      // --------------------------------------
      // PERFORMANCE METRICS
      // --------------------------------------
      performance: {
        successRate: 0,
        lastScore: 0,
        bestScore: 0
      },

      // --------------------------------------
      // USAGE DATA
      // --------------------------------------
      usage: {
        sessions: 0,
        lastAccess: null
      }
    };
  }

  /**
   * ==========================================
   * UPDATE SKILL MASTERY
   * ==========================================
   */
  update(userId, skillId, result) {

    const node = this.get(skillId);

    node.attempts += 1;
    node.usage.sessions += 1;
    node.usage.lastAccess = Date.now();

    // --------------------------------------
    // UPDATE MASTERY
    // --------------------------------------
    if (result.success) {
      node.mastery += 0.05;
    } else {
      node.mastery -= 0.03;
    }

    node.mastery = this.clamp(node.mastery);

    // --------------------------------------
    // UPDATE PERFORMANCE
    // --------------------------------------
    this.updatePerformance(node, result);

    // --------------------------------------
    // UPDATE STATUS
    // --------------------------------------
    this.updateStatus(node);

    return node;
  }

  /**
   * ==========================================
   * PERFORMANCE ENGINE
   * ==========================================
   */
  updatePerformance(node, result) {

    node.performance.lastScore = result.score || 0;

    if (result.success) {
      node.performance.bestScore =
        Math.max(node.performance.bestScore, result.score || 0);
    }

    const successRate =
      node.mastery > 0 ? node.mastery : 0;

    node.performance.successRate = successRate;
  }

  /**
   * ==========================================
   * STATUS ENGINE
   * ==========================================
   */
  updateStatus(node) {

    if (node.mastery >= 0.8) {
      node.status = "mastered";
    }

    else if (node.mastery >= 0.3) {
      node.status = "learning";
    }

    else {
      node.status = "locked";
    }
  }

  /**
   * ==========================================
   * PREREQUISITE SYSTEM
   * ==========================================
   */
  addPrerequisite(skillId, prereqId) {

    const node = this.get(skillId);

    if (!node.prerequisites.includes(prereqId)) {
      node.prerequisites.push(prereqId);
    }
  }

  /**
   * ==========================================
   * SKILL UNLOCK SYSTEM
   * ==========================================
   */
  addUnlock(skillId, unlockId) {

    const node = this.get(skillId);

    if (!node.unlocks.includes(unlockId)) {
      node.unlocks.push(unlockId);
    }
  }

  /**
   * ==========================================
   * READY SKILLS DETECTOR
   * ==========================================
   */
  getAvailableSkills() {

    const available = [];

    for (let node of this.graph.values()) {

      const prereqsMet =
        node.prerequisites.every(p => {
          const prereqNode = this.get(p);
          return prereqNode.mastery >= 0.7;
        });

      if (prereqsMet && node.status !== "mastered") {
        available.push(node);
      }
    }

    return available;
  }

  /**
   * ==========================================
   * NEXT BEST SKILL SELECTOR
   * ==========================================
   */
  getNextSkill() {

    const available = this.getAvailableSkills();

    if (available.length === 0) {
      return null;
    }

    // choose least mastered available skill
    return available.sort((a, b) =>
      a.mastery - b.mastery
    )[0];
  }

  /**
   * ==========================================
   * RELATED SKILLS FINDER
   * ==========================================
   */
  getRelatedSkills(skillId) {

    const node = this.get(skillId);

    const related = [
      ...node.prerequisites,
      ...node.unlocks,
      ...node.relatedSkills
    ];

    return related.map(id => this.get(id));
  }

  /**
   * ==========================================
   * CLAMP UTILITY
   * ==========================================
   */
  clamp(v) {
    return Math.max(0, Math.min(1, v));
  }

  /**
   * ==========================================
   * GRAPH INSIGHTS
   * ==========================================
   */
  insights() {

    let total = 0;
    let mastered = 0;

    for (let node of this.graph.values()) {

      total += 1;
      if (node.status === "mastered") mastered += 1;
    }

    return {
      totalSkills: total,
      masteredSkills: mastered,
      completionRate: total ? mastered / total : 0
    };
  }
}

module.exports = MentorSkillGraph;
