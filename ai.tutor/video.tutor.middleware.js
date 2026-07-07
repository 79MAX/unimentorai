/**
 * VIDEO TUTOR MIDDLEWARE - UniMentorAI
 * Intelligent request preprocessing layer for Tutor AI system
 */

class VideoTutorMiddleware {
  constructor({ logger, analytics }) {
    this.logger = logger;
    this.analytics = analytics;
  }

  /**
   * 🎯 Main middleware entry
   */
  async process(req, res, next) {
    try {
      const enriched = await this._enrichRequest(req);

      const validated = this._validate(enriched);

      if (!validated.ok) {
        return res.status(400).json({
          success: false,
          error: validated.reason
        });
      }

      req.tutorContext = validated.data;

      await this._trackRequest(validated.data);

      next();

    } catch (error) {
      this.logger.error("TutorMiddleware error", error);

      return res.status(500).json({
        success: false,
        error: "Middleware processing error"
      });
    }
  }

  /**
   * 🧠 Enrich request with AI context
   */
  async _enrichRequest(req) {
    return {
      userId: req.body.userId,
      courseId: req.body.courseId,
      videoId: req.body.videoId,

      payload: req.body,

      meta: {
        timestamp: Date.now(),
        ip: req.ip,
        userAgent: req.headers["user-agent"]
      }
    };
  }

  /**
   * 🧪 Validate incoming request
   */
  _validate(data) {
    if (!data.userId) {
      return { ok: false, reason: "Missing userId" };
    }

    if (!data.courseId) {
      return { ok: false, reason: "Missing courseId" };
    }

    if (!data.videoId) {
      return { ok: false, reason: "Missing videoId" };
    }

    return {
      ok: true,
      data: this._normalize(data)
    };
  }

  /**
   * ⚙️ Normalize data for AI engines
   */
  _normalize(data) {
    return {
      ...data,

      userId: String(data.userId),
      courseId: String(data.courseId),
      videoId: String(data.videoId),

      payload: data.payload || {},

      contextFlags: this._generateFlags(data)
    };
  }

  /**
   * 🧠 Generate AI context flags
   */
  _generateFlags(data) {
    const flags = [];

    if (data.payload?.message?.length > 200) {
      flags.push("long_query");
    }

    if (data.payload?.signal?.type === "fast_skip") {
      flags.push("high_speed_learner");
    }

    if (data.payload?.voiceEvent) {
      flags.push("voice_mode");
    }

    if (data.payload?.audioEvent) {
      flags.push("audio_mode");
    }

    return flags;
  }

  /**
   * 📊 Track all incoming requests
   */
  async _trackRequest(data) {
    await this.analytics.track("tutor_request", {
      userId: data.userId,
      courseId: data.courseId,
      videoId: data.videoId,
      flags: data.contextFlags,
      timestamp: Date.now()
    });
  }
}

module.exports = VideoTutorMiddleware;
