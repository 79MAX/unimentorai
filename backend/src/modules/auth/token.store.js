import crypto from "crypto";

/**
 * =====================================
 * TOKEN STORE V4 - CLEAN ARCH CORE
 * =====================================
 *
 * ✔ In-memory dev store
 * ✔ Expiration support
 * ✔ Session-safe structure
 * ✔ Ready for Redis swap
 */

export default class TokenStore {
  constructor() {
    this.store = new Map();
  }

  /**
   * SAVE SESSION
   */
  async save(userId, { refreshToken, sessionId, ttlDays = 7 }) {
    const expiresAt = Date.now() + ttlDays * 24 * 60 * 60 * 1000;

    this.store.set(userId, {
      refreshToken,
      sessionId: sessionId || crypto.randomUUID(),
      createdAt: Date.now(),
      expiresAt,
    });
  }

  /**
   * GET SESSION
   */
  async get(userId) {
    const session = this.store.get(userId);

    if (!session) return null;

    // Auto cleanup expired sessions
    if (Date.now() > session.expiresAt) {
      this.store.delete(userId);
      return null;
    }

    return session;
  }

  /**
   * DELETE SESSION
   */
  async delete(userId) {
    return this.store.delete(userId);
  }

  /**
   * VALIDATE SESSION SAFETY
   */
  async validate(userId, refreshToken) {
    const session = await this.get(userId);

    if (!session) return false;

    return session.refreshToken === refreshToken;
  }

  /**
   * ROTATE TOKEN SAFELY
   */
  async rotate(userId, newSession) {
    const existing = await this.get(userId);

    if (!existing) return false;

    this.store.set(userId, {
      ...existing,
      ...newSession,
      updatedAt: Date.now(),
    });

    return true;
  }

  /**
   * CLEAR ALL (DEV ONLY)
   */
  async clear() {
    this.store.clear();
  }
}
