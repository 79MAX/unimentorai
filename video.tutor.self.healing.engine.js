/**
 * video.tutor.self.healing.engine.js
 * UniMentorAI - Self Healing & Recovery Engine
 */

class VideoTutorSelfHealingEngine {
  constructor({
    eventBus,
    telemetry,
    logger,
    learningModel,
    skillGraph,
    difficultyEngine
  }) {
    this.eventBus = eventBus;
    this.telemetry = telemetry;
    this.logger = logger;

    this.learningModel = learningModel;
    this.skillGraph = skillGraph;
    this.difficultyEngine = difficultyEngine;
  }

  /**
   * 🧠 MAIN ENTRY
   */
  analyze(userId) {
    const issues = [];

    const model = this.learningModel.getModel(userId);
    const graph = this.skillGraph.getSnapshot(userId);
    const difficulty = this.difficultyEngine.getState(userId);

    // =========================
    // 🔍 DETECT ANOMALIES
    // =========================
    if (this._isInvalidMastery(model)) {
      issues.push("INVALID_MASTERY");
    }

    if (this._isStuckProgress(model)) {
      issues.push("STUCK_PROGRESS");
    }

    if (this._isSkillGraphBroken(graph)) {
      issues.push("SKILL_GRAPH_CORRUPTION");
    }

    if (this._isDifficultyInconsistent(difficulty)) {
      issues.push("DIFFICULTY_DRIFT");
    }

    return {
      userId,
      issues,
      healthy: issues.length === 0
    };
  }

  /**
   * 🧯 AUTO HEALING ENGINE
   */
  heal(userId) {
    const report = this.analyze(userId);

    if (report.healthy) {
      return { status: "ok" };
    }

    const model = this.learningModel.getModel(userId);

    for (const issue of report.issues) {
      switch (issue) {

        case "INVALID_MASTERY":
          this._fixInvalidMastery(model);
          break;

        case "STUCK_PROGRESS":
          this._fixStuckProgress(model);
          break;

        case "SKILL_GRAPH_CORRUPTION":
          this._rebuildSkillGraph(userId);
          break;

        case "DIFFICULTY_DRIFT":
          this._resetDifficulty(userId);
          break;
      }
    }

    this._emit(userId, report.issues);

    return {
      status: "healed",
      fixed: report.issues
    };
  }

  /**
   * 🔍 CHECKERS
   */
  _isInvalidMastery(model) {
    return Object.values(model.mastery || {})
      .some(v => v < 0 || v > 1);
  }

  _isStuckProgress(model) {
    return model.performance?.completionRate < 0.2 &&
           model.engagement?.score < 30;
  }

  _isSkillGraphBroken(graph) {
    return !graph || graph.graphSize === 0;
  }

  _isDifficultyInconsistent(diff) {
    return !diff || diff.current == null;
  }

  /**
   * 🧯 FIXERS
   */
  _fixInvalidMastery(model) {
    for (const k in model.mastery) {
      model.mastery[k] = Math.min(
        1,
        Math.max(0, model.mastery[k])
      );
    }
  }

  _fixStuckProgress(model) {
    model.engagement.score = 50;
    model.performance.completionRate = Math.max(
      model.performance.completionRate,
      0.3
    );
  }

  _rebuildSkillGraph(userId) {
    this.eventBus.emit(
      "skill.graph.rebuild",
      { userId }
    );
  }

  _resetDifficulty(userId) {
    this.eventBus.emit(
      "difficulty.reset",
      { userId }
    );
  }

  /**
   * 📡 EVENT EMITTER
   */
  _emit(userId, issues) {
    this.eventBus.emit(
      "system.self.healed",
      {
        userId,
        issues,
        timestamp: Date.now()
      }
    );

    this.telemetry.collect({
      type: "self_healing",
      userId,
      issues
    });

    this.logger.info(
      "self_healing_applied",
      {
        userId,
        issues
      }
    );
  }
}

module.exports =
  VideoTutorSelfHealingEngine;
