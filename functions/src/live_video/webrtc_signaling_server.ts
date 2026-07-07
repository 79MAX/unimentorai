type SignalHandler = (data: any) => void;

export class WebRTCSignalingServer {

  private static handlers = new Map<string, SignalHandler>();

  static register(socketId: string, handler: SignalHandler) {
    this.handlers.set(socketId, handler);
  }

  static send(to: string, payload: any) {

    const handler = this.handlers.get(to);

    if (handler) {
      handler(payload);
    }
  }

  static remove(socketId: string) {
    this.handlers.delete(socketId);
  }
}