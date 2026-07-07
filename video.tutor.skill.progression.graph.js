/**
 * video.tutor.skill.progression.graph.js
 * UniMentorAI - Advanced Skill Graph Engine
 */

class VideoTutorSkillProgressionGraph {
  constructor({ eventBus, telemetry, logger }) {
    this.eventBus = eventBus;
    this.telemetry = telemetry;
    this.logger = logger;

    // skill nodes
    this.graph = new Map();

    // user progress cache
    this.progress = new Map();
  }

  /**
   * 🧩 Register skill node
   */
  registerSkill(skillId, meta = {}) {
    if (!this.graph.has(skillId)) {
      this.graph.set(skillId, {
        id: skillId,
        domain: meta.domain || "general",
        difficulty: meta.difficulty || 0.5,
        weight: meta.weight || 1,
        prerequisites: new Map(), // weighted edges
        unlocks: new Set()
      });
    }

    return this.graph.get(skillId);
  }

  /**
   * 🔗 Add weighted dependency
   */
  addDependency(skillId, prereqId, weight = 1) {
    const skill = this.registerSkill(skillId);
    this.registerSkill(prereqId);

    skill.prerequisites.set(prereqId, weight);

    this.graph.get(prereqId).unlocks.add(skillId);

    return this;
  }

  /**
   * 📊 Update user mastery
   */
  updateUserSkill(userId, skillId, mastery, attempts = 0) {
    if (!this.progress.has(userId)) {
      this.progress.set(userId, new Map());
    }

    const userMap = this.progress.get(userId);

    userMap.set(skillId, {
      mastery,
      attempts,
      updatedAt: Date.now()
    });

    this._emit("skill.updated", { userId, skillId });

    return userMap;
  }

  /**
   * 🎯 Get available skills (ready to learn)
   */
  getAvailableSkills(userId) {
    const user = this.progress.get(userId) || new Map();

    const available = [];

    for (const [skillId, node] of this.graph) {
      const mastery = user.get(skillId)?.mastery || 0;

      if (mastery >= 0.8) continue;

      let prereqScore = 0;
      let totalWeight = 0;

      for (const [prereqId, weight] of node.prerequisites) {
        const m = user.get(prereqId)?.mastery || 0;

        prereqScore += m * weight;
        totalWeight += weight;
      }

      const readiness =
        totalWeight === 0 ? 1 : prereqScore / totalWeight;

      if (readiness >= 0.7) {
        available.push({
          skillId,
          readiness,
          difficulty: node.difficulty
        });
      }
    }

    return available.sort(
      (a, b) => b.readiness - a.readiness
    );
  }

  /**
   * 🧭 Optimal learning path (multi-path aware)
   */
  getOptimalPath(targetSkillId, userId) {
    const user = this.progress.get(userId) || new Map();

    const visited = new Set();
    const path = [];

    const dfs = (skillId) => {
      if (visited.has(skillId)) return;
      visited.add(skillId);

      const node = this.graph.get(skillId);
      if (!node) return;

      for (const prereqId of node.prerequisites.keys()) {
        const mastery =
          user.get(prereqId)?.mastery || 0;

        if (mastery < 0.7) {
          dfs(prereqId);
        }
      }

      path.push(skillId);
    };

    dfs(targetSkillId);

    return path.reverse();
  }

  /**
   * 🚨 Detect critical blockers
   */
  detectCriticalBlockers(userId) {
    const user = this.progress.get(userId) || new Map();

    const blockers = [];

    for (const [skillId, node] of this.graph) {
      const mastery = user.get(skillId)?.mastery || 0;

      let blockedCount = 0;

      for (const unlocked of node.unlocks) {
        const m = user.get(unlocked)?.mastery || 0;

        if (m < 0.5) blockedCount++;
      }

      if (mastery < 0.4 && blockedCount >= 2) {
        blockers.push({
          skillId,
          impact: blockedCount
        });
      }
    }

    return blockers.sort(
      (a, b) => b.impact - a.impact
    );
  }

  /**
   * 📈 Skill priority scoring
   */
  getSkillPriority(userId) {
    const available = this.getAvailableSkills(userId);

    return available.map(skill => {
      let priority = skill.readiness * 100;

      if (skill.difficulty > 0.7) {
        priority += 10;
      }

      if (skill.readiness < 0.3) {
        priority -= 20;
      }

      return {
        ...skill,
        priority
      };
    }).sort((a, b) => b.priority - a.priority);
  }

  /**
   * 📡 Event system
   */
  _emit(type, payload) {
    this.eventBus.emit(type, {
      ...payload,
      timestamp: Date.now()
    });

    this.telemetry.collect({
      type: "skill.graph.event",
      event: type,
      payload
    });
  }

  /**
   * 📊 Snapshot
   */
  getSnapshot(userId) {
    return {
      graphSize: this.graph.size,
      userSkills: this.progress.get(userId) || new Map()
    };
  }
}

module.exports =
  VideoTutorSkillProgressionGraph;
