/**
 * VIDEO TUTOR INTERACTION CONTROLLER - UniMentorAI
 * Handles all user interactions during video learning sessions
 */

class VideoTutorInteractionController {
  constructor({ tutorBrain, contextAnalyzer, analytics, logger }) {
    this.tutorBrain = tutorBrain;
    this.contextAnalyzer = contextAnalyzer;
    this.analytics = analytics;
    this.logger = logger;
  }

  /**
   * 🎯 Main entry point for all interactions
   */
  async handleInteraction({ userId, courseId, videoId, action, payload }) {
    try {
      this._validateAction(action);

      const context = await this.contextAnalyzer.analyze({
        userId,
        courseId,
        sessionData: payload?.session || {}
      });

      const enrichedEvent = this._buildEvent({
        userId,
        courseId,
        videoId,
        action,
        payload,
        context
      });

      await this._routeInteraction(enrichedEvent);

      await this._trackInteraction(enrichedEvent);

      return this._buildResponse(enrichedEvent);

    } catch (error) {
      this.logger.error("InteractionController error", error);

      return this._fallbackResponse(action);
    }
  }

  /**
   * 🚦 Route interaction to proper handler
   */
  async _routeInteraction(event) {
    switch (event.action) {
      case "play":
        return this._onPlay(event);

      case "pause":
        return this._onPause(event);

      case "skip":
        return this._onSkip(event);

      case "replay":
        return this._onReplay(event);

      case "next":
        return this._onNext(event);

      default:
        throw new Error(`Unknown action: ${event.action}`);
    }
  }

  /**
   * ▶️ Play event
   */
  async _onPlay(event) {
    return this.tutorBrain.decideNextStep({
      userId: event.userId,
      courseId: event.courseId,
      currentState: {
        type: "play",
        videoId: event.videoId,
        context: event.context
      }
    });
  }

  /**
   * ⏸ Pause event
   */
  async _onPause(event) {
    await this.analytics.track("video_pause", event);
    return { status: "paused", next: "awaiting_action" };
  }

  /**
   * ⏩ Skip event
   */
  async _onSkip(event) {
    await this.analytics.track("video_skip", event);

    return this.tutorBrain.decideNextStep({
      userId: event.userId,
      courseId: event.courseId,
      currentState: {
        type: "skip",
        videoId: event.videoId,
        context: event.context
      }
    });
  }

  /**
   * 🔁 Replay event
   */
  async _onReplay(event) {
    await this.analytics.track("video_replay", event);

    return this.tutorBrain.decideNextStep({
      userId: event.userId,
      courseId: event.courseId,
      currentState: {
        type: "replay",
        videoId: event.videoId,
        context: event.context
      }
    });
  }

  /**
   * ➡️ Next event
   */
  async _onNext(event) {
    await this.analytics.track("video_next", event);

    return this.tutorBrain.decideNextStep({
      userId: event.userId,
      courseId: event.courseId,
      currentState: {
        type: "next",
        videoId: event.videoId,
        context: event.context
      }
    });
  }

  /**
   * 📊 Track all interactions
   */
  async _trackInteraction(event) {
    await this.analytics.track("tutor_interaction", {
      userId: event.userId,
      courseId: event.courseId,
      videoId: event.videoId,
      action: event.action,
      timestamp: Date.now(),
      context: event.context?.readinessScore || null
    });
  }

  /**
   * 🧠 Build enriched event object
   */
  _buildEvent({ userId, courseId, videoId, action, payload, context }) {
    return {
      userId,
      courseId,
      videoId,
      action,
      payload,
      context,
      timestamp: Date.now()
    };
  }

  /**
   * 🚦 Validate allowed actions (security layer light)
   */
  _validateAction(action) {
    const allowed = ["play", "pause", "skip", "replay", "next"];

    if (!allowed.includes(action)) {
      throw new Error(`Invalid action: ${action}`);
    }
  }

  /**
   * 🧾 Standard response format
   */
  _buildResponse(event) {
    return {
      status: "ok",
      action: event.action,
      timestamp: event.timestamp
    };
  }

  /**
   * 🔄 Safe fallback
   */
  _fallbackResponse(action) {
    return {
      status: "error_recovered",
      action,
      message: "Fallback mode activated"
    };
  }
}

module.exports = VideoTutorInteractionController;
