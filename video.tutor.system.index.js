/**
 * video.tutor.system.index.js
 * UniMentorAI - Video Tutor System Bootstrap & Orchestrator
 */

const EventEmitter = require("events");

// Core modules
const VideoTutorLearningModel = require("./video.tutor.learning.model");
const VideoTutorSkillGraph = require("./video.tutor.skill.progression.graph");
const VideoTutorAdaptiveDifficulty = require("./video.tutor.adaptive.difficulty");
const VideoTutorSubscriptionManager = require("./video.tutor.subscription.manager");

class VideoTutorSystem {
  constructor(config = {}) {
    this.config = config;

    // =========================
    // 🔗 CORE INFRASTRUCTURE
    // =========================
    this.eventBus = new EventEmitter();

    this.telemetry = config.telemetry || {
      collect: () => {}
    };

    this.logger = config.logger || console;

    // =========================
    // 🧠 CORE ENGINES
    // =========================
    this.learningModel = new VideoTutorLearningModel({
      eventBus: this.eventBus,
      telemetry: this.telemetry,
      logger: this.logger
    });

    this.skillGraph = new VideoTutorSkillGraph({
      eventBus: this.eventBus,
      telemetry: this.telemetry,
      logger: this.logger
    });

    this.difficultyEngine = new VideoTutorAdaptiveDifficulty({
      eventBus: this.eventBus,
      telemetry: this.telemetry,
      logger: this.logger
    });

    this.subscriptionManager = new VideoTutorSubscriptionManager({
      eventBus: this.eventBus,
      telemetry: this.telemetry,
      logger: this.logger
    });

    // =========================
    // ⚙️ SYSTEM BOOT
    // =========================
    this._registerEventHandlers();

    this.logger.info("VideoTutorSystem initialized");
  }

  /**
   * 🚀 SYSTEM BOOTSTRAP
   */
  async bootstrap() {
    this.logger.info("Bootstrapping Video Tutor System...");

    this.eventBus.emit("system.boot", {
      timestamp: Date.now()
    });

    return {
      status: "ready",
      modules: [
        "learningModel",
        "skillGraph",
        "difficultyEngine",
        "subscriptionManager"
      ]
    };
  }

  /**
   * 🧠 MAIN LEARNING FLOW ENTRY
   */
  processLearningEvent(userId, context = {}) {
    // 1. Update learning model
    this.learningModel.updateEngagement(
      userId,
      context.engagement?.score || 50
    );

    this.learningModel.updatePerformance(
      userId,
      context.performance || {}
    );

    // 2. Update skill graph
    if (context.skillId) {
      this.skillGraph.updateUserSkill(
        userId,
        context.skillId,
        context.mastery || 0
      );
    }

    // 3. Adaptive difficulty
    const difficulty =
      this.difficultyEngine.calculate(
        userId,
        context
      );

    // 4. Emit unified event
    this.eventBus.emit("learning.processed", {
      userId,
      difficulty,
      timestamp: Date.now()
    });

    return {
      userId,
      difficulty
    };
  }

  /**
   * 🔐 ACCESS CHECK (subscription + features)
   */
  canAccess(userId, feature) {
    return this.subscriptionManager.canAccess(
      userId,
      feature
    );
  }

  /**
   * 📊 FULL USER STATE SNAPSHOT
   */
  getUserState(userId) {
    return {
      learning: this.learningModel.getModel(userId),
      skills: this.skillGraph.getSnapshot(userId),
      subscription: this.subscriptionManager.getSubscription(userId),
      difficulty: this.difficultyEngine.getState(userId)
    };
  }

  /**
   * ⚙️ EVENT WIRING
   */
  _registerEventHandlers() {
    this.eventBus.on("system.boot", () => {
      this.logger.info("System boot event triggered");
    });

    this.eventBus.on("learning.processed", (event) => {
      this.telemetry.collect({
        type: "system.learning.processed",
        ...event
      });
    });
  }
}

module.exports = VideoTutorSystem;
