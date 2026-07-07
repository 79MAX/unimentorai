/**
 * VIDEO TUTOR BOOTSTRAP - UniMentorAI
 * System initialization and dependency injection layer
 */

class VideoTutorBootstrap {
  constructor(dependencies = {}) {
    this.dependencies = dependencies;
    this.system = {};
  }

  /**
   * 🚀 Main boot sequence
   */
  async init() {
    try {
      // 1. Core infrastructure
      this._initCore();

      // 2. AI engines
      this._initAIEngines();

      // 3. Intelligence layer
      this._initIntelligence();

      // 4. Business layer
      this._initBusiness();

      // 5. Orchestration layer
      this._initOrchestrator();

      // 6. System validation
      this._validateSystem();

      return this.system;

    } catch (error) {
      throw new Error("Bootstrap failed: " + error.message);
    }
  }

  /**
   * ⚙️ Core system init
   */
  _initCore() {
    this.system.logger = this.dependencies.logger;
    this.system.middleware = this.dependencies.middleware;
    this.system.guard = this.dependencies.guard;
  }

  /**
   * 🧠 AI engines initialization
   */
  _initAIEngines() {
    this.system.behaviorDetector = this.dependencies.behaviorDetector;
    this.system.attentionTracker = this.dependencies.attentionTracker;
    this.system.lessonEngine = this.dependencies.lessonEngine;
    this.system.chatEngine = this.dependencies.chatEngine;
    this.system.voiceBridge = this.dependencies.voiceBridge;
    this.system.responseEngine = this.dependencies.responseEngine;
  }

  /**
   * 📊 Intelligence layer
   */
  _initIntelligence() {
    this.system.analytics = this.dependencies.analytics;
    this.system.insightsGenerator = this.dependencies.insightsGenerator;
    this.system.ltvEngine = this.dependencies.ltvEngine;
  }

  /**
   * 💰 Business layer
   */
  _initBusiness() {
    this.system.monetizer = this.dependencies.monetizer;
    this.system.revenueLinker = this.dependencies.revenueLinker;
  }

  /**
   * 🎯 Orchestration layer
   */
  _initOrchestrator() {
    const Orchestrator = this.dependencies.orchestrator;

    this.system.orchestrator = new Orchestrator({
      engine: this.dependencies.engine,
      analytics: this.system.analytics,
      insightsGenerator: this.system.insightsGenerator,
      monetizer: this.system.monetizer,
      revenueLinker: this.system.revenueLinker,
      ltvEngine: this.system.ltvEngine,
      behaviorDetector: this.system.behaviorDetector,
      logger: this.system.logger
    });
  }

  /**
   * 🧠 System validation
   */
  _validateSystem() {
    const required = [
      "logger",
      "middleware",
      "guard",
      "behaviorDetector",
      "analytics",
      "orchestrator"
    ];

    required.forEach((key) => {
      if (!this.system[key]) {
        throw new Error(`Missing system dependency: ${key}`);
      }
    });
  }

  /**
   * 📦 Get ready-to-run system
   */
  getSystem() {
    return this.system;
  }
}

module.exports = VideoTutorBootstrap;
