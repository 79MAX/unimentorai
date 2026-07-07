const express = require("express");

class VideoTutorRoutes {
  constructor({
    lessonEngine,
    chatAdapter,
    voiceBridge,
    realtimeAdapter,
    responseEngine,
    signalsAnalyzer,
    audioProcessor,
    attentionTracker,
    logger
  }) {
    this.router = express.Router();

    this.lessonEngine = lessonEngine;
    this.chatAdapter = chatAdapter;
    this.voiceBridge = voiceBridge;
    this.realtimeAdapter = realtimeAdapter;
    this.responseEngine = responseEngine;
    this.signalsAnalyzer = signalsAnalyzer;
    this.audioProcessor = audioProcessor;
    this.attentionTracker = attentionTracker;
    this.logger = logger;

    this._initRoutes();
  }

  /**
   * 🚀 Initialize all tutor routes
   */
  _initRoutes() {

    // 🎯 Run full lesson flow
    this.router.post("/lesson/run", this._wrap(this.runLesson.bind(this)));

    // 💬 Chat interaction
    this.router.post("/chat/message", this._wrap(this.handleChat.bind(this)));

    // 🗣 Voice interaction
    this.router.post("/voice/handle", this._wrap(this.handleVoice.bind(this)));

    // ⚡ Real-time adaptation signals
    this.router.post("/realtime/adapt", this._wrap(this.handleRealtime.bind(this)));

    // 📊 Video signals analysis
    this.router.post("/signals/analyze", this._wrap(this.analyzeSignals.bind(this)));

    // 🎧 Audio processing
    this.router.post("/audio/process", this._wrap(this.processAudio.bind(this)));

    // 🧠 Attention tracking
    this.router.post("/attention/track", this._wrap(this.trackAttention.bind(this)));

    // 🧩 Final response aggregation
    this.router.post("/response/build", this._wrap(this.buildResponse.bind(this)));
  }

  /**
   * 🎯 Run full lesson engine
   */
  async runLesson(req) {
    const { userId, courseId, videoId, action } = req.body;

    return await this.lessonEngine.runLesson({
      userId,
      courseId,
      videoId,
      action
    });
  }

  /**
   * 💬 Chat handler
   */
  async handleChat(req) {
    const { userId, courseId, videoId, message } = req.body;

    return await this.chatAdapter.handleMessage({
      userId,
      courseId,
      videoId,
      message
    });
  }

  /**
   * 🗣 Voice handler
   */
  async handleVoice(req) {
    const { userId, courseId, videoId, voiceEvent } = req.body;

    return await this.voiceBridge.handleVoice({
      userId,
      courseId,
      videoId,
      voiceEvent
    });
  }

  /**
   * ⚡ Real-time adaptation
   */
  async handleRealtime(req) {
    const { userId, courseId, videoId, signal } = req.body;

    return await this.realtimeAdapter.adapt({
      userId,
      courseId,
      videoId,
      signal
    });
  }

  /**
   * 📊 Video signals
   */
  async analyzeSignals(req) {
    const { userId, courseId, videoId, event } = req.body;

    return await this.signalsAnalyzer.analyze({
      userId,
      courseId,
      videoId,
      event
    });
  }

  /**
   * 🎧 Audio processing
   */
  async processAudio(req) {
    const { userId, courseId, videoId, audioEvent } = req.body;

    return await this.audioProcessor.process({
      userId,
      courseId,
      videoId,
      audioEvent
    });
  }

  /**
   * 🧠 Attention tracking
   */
  async trackAttention(req) {
    const { userId, courseId, videoId, signals } = req.body;

    return await this.attentionTracker.track({
      userId,
      courseId,
      videoId,
      signals
    });
  }

  /**
   * 🧩 Final response engine
   */
  async buildResponse(req) {
    const { userId, courseId, videoId, inputs } = req.body;

    return await this.responseEngine.buildResponse({
      userId,
      courseId,
      videoId,
      inputs
    });
  }

  /**
   * 🔒 Wrapper (error handling + logging layer)
   */
  _wrap(fn) {
    return async (req, res) => {
      try {
        const result = await fn(req);
        res.json({
          success: true,
          data: result
        });
      } catch (error) {
        this.logger.error("Tutor route error", error);

        res.status(500).json({
          success: false,
          error: "Tutor system error"
        });
      }
    };
  }

  /**
   * 📦 Export router
   */
  getRouter() {
    return this.router;
  }
}

module.exports = VideoTutorRoutes;
