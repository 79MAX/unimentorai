import { MediaStreamSecurity } from "./media_stream_security";
import { PeerConnectionManager } from "./peer_connection_manager";

export class LiveVideoGateway {

  static async joinRoom(data: any) {

    const allowed =
      MediaStreamSecurity.validateAccess(
        data.role
      );

    if (!allowed) {
      throw new Error("Unauthorized room access");
    }

    const streamToken =
      MediaStreamSecurity.generateSecureStreamToken(
        data.roomId,
        data.userId
      );

    PeerConnectionManager.addPeer(
      data.userId,
      {
        roomId: data.roomId,
        joinedAt: Date.now(),
      }
    );

    return {
      success: true,
      streamToken,
      roomId: data.roomId,
    };
  }
}