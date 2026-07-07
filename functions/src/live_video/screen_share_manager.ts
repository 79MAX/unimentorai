export class ScreenShareManager {

  private static activeShares = new Map<string, boolean>();

  static start(userId: string) {
    this.activeShares.set(userId, true);
  }

  static stop(userId: string) {
    this.activeShares.delete(userId);
  }

  static isSharing(userId: string): boolean {
    return this.activeShares.has(userId);
  }
}