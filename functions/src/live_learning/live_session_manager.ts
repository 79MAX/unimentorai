import { SecureStreamTokenService } from "./secure_stream_token_service";
import { RealtimePresenceEngine } from "./realtime_presence_engine";

export class LiveSessionManager {

  static async createSession(data: any) {

    const sessionId = `session_${Date.now()}`;

    const secureToken =
      SecureStreamTokenService.generate(
        sessionId,
        data.mentorId
      );

    RealtimePresenceEngine.join(data.mentorId);

    return {
      sessionId,
      secureToken,
      createdAt: Date.now(),
      mentorId: data.mentorId,
    };
  }
}