
/**
 * ==========================================
 * 🧠 MENTOR SKILL GRAPH ENGINE
 * UniMentorAI Knowledge & Skill Mapping System
 * ==========================================
 * Responsible for:
 * - skill relationship mapping
 * - dependency tracking
 * - learning path generation
 * - mastery propagation
 * - knowledge gap detection
 */

class MentorSkillGraph {

  constructor() {

    // Directed graph: skill → dependencies
    this.graph = new Map();

    // User-specific skill states
    this.userSkills = new Map();
  }

  /**
   * ==========================================
   * DEFINE SKILL RELATIONSHIPS
   * ==========================================
   */
  addSkill(skill, dependencies = []) {

    this.graph.set(skill, {
      dependencies,
      unlockedBy: []
    });

    // reverse mapping
    dependencies.forEach(dep => {

      if (!this.graph.has(dep)) {
        this.graph.set(dep, {
          dependencies: [],
          unlockedBy: []
        });
      }

      this.graph.get(dep).unlockedBy.push(skill);
    });
  }

  /**
   * ==========================================
   * GET OR CREATE USER SKILL PROFILE
   * ==========================================
   */
  getUserProfile(userId) {

    if (!this.userSkills.has(userId)) {

      this.userSkills.set(userId, {
        mastered: new Map(),
        inProgress: new Map(),
        locked: new Set()
      });
    }

    return this.userSkills.get(userId);
  }

  /**
   * ==========================================
   * UPDATE SKILL MASTERY
   * ==========================================
   */
  updateSkill(userId, skill, masteryScore) {

    const profile = this.getUserProfile(userId);

    profile.inProgress.set(skill, masteryScore);

    if (masteryScore > 0.8) {
      profile.mastered.set(skill, true);
      profile.inProgress.delete(skill);

      // unlock dependent skills
      this.unlockSkills(userId, skill);
    }
  }

  /**
   * ==========================================
   * UNLOCK DEPENDENT SKILLS
   * ==========================================
   */
  unlockSkills(userId, skill) {

    const node = this.graph.get(skill);

    if (!node) return;

    const profile = this.getUserProfile(userId);

    node.unlockedBy.forEach(nextSkill => {

      profile.locked.delete(nextSkill);

      if (!profile.inProgress.has(nextSkill) &&
          !profile.mastered.has(nextSkill)) {

        profile.inProgress.set(nextSkill, 0);
      }
    });
  }

  /**
   * ==========================================
   * GET NEXT BEST SKILLS TO LEARN
   * ==========================================
   */
  getNextSkills(userId) {

    const profile = this.getUserProfile(userId);

    const candidates = [];

    for (let [skill] of this.graph) {

      const node = this.graph.get(skill);

      const dependenciesMet =
        node.dependencies.every(dep =>
          profile.mastered.has(dep)
        );

      const notLearned =
        !profile.mastered.has(skill) &&
        !profile.inProgress.has(skill);

      if (dependenciesMet && notLearned) {
        candidates.push(skill);
      }
    }

    return candidates.slice(0, 5);
  }

  /**
   * ==========================================
   * DETECT KNOWLEDGE GAPS
   * ==========================================
   */
  detectGaps(userId) {

    const profile = this.getUserProfile(userId);

    const gaps = [];

    for (let [skill] of profile.inProgress) {

      const node = this.graph.get(skill);

      if (!node) continue;

      node.dependencies.forEach(dep => {

        if (!profile.mastered.has(dep)) {
          gaps.push({
            missing: dep,
            requiredBy: skill
          });
        }
      });
    }

    return gaps;
  }

  /**
   * ==========================================
   * GENERATE LEARNING PATH
   * ==========================================
   */
  generateLearningPath(userId) {

    const nextSkills = this.getNextSkills(userId);
    const gaps = this.detectGaps(userId);

    return {
      recommended: nextSkills,
      prerequisites: gaps,
      path: [...gaps.map(g => g.missing), ...nextSkills]
    };
  }

  /**
   * ==========================================
   * FULL GRAPH INSPECTION
   * ==========================================
   */
  debug() {

    return {
      totalSkills: this.graph.size,
      graph: Object.fromEntries(this.graph)
    };
  }
}

module.exports = MentorSkillGraph;
