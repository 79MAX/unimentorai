export class PeerConnectionManager {

  private static peers = new Map<string, any>();

  static addPeer(userId: string, connection: any) {
    this.peers.set(userId, connection);
  }

  static getPeer(userId: string) {
    return this.peers.get(userId);
  }

  static removePeer(userId: string) {
    this.peers.delete(userId);
  }

  static totalPeers() {
    return this.peers.size;
  }
}