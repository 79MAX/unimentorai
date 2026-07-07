import { LiveEventBus } from "./live_event_bus";

export class WebinarEngine {

  static async startWebinar(sessionId: string) {

    LiveEventBus.publish({
      type: "WEBINAR_STARTED",
      sessionId,
      timestamp: Date.now(),
    });

    return {
      success: true,
      sessionId,
    };
  }

  static async endWebinar(sessionId: string) {

    LiveEventBus.publish({
      type: "WEBINAR_ENDED",
      sessionId,
      timestamp: Date.now(),
    });

    return {
      success: true,
    };
  }
}