import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * =========================
 * 🔐 AUTH SERVICE (LOCK V2)
 * BUSINESS LAYER ONLY
 * =========================
 */
class AuthService {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET;
    this.refreshSecret = process.env.JWT_REFRESH_SECRET;

    // ⚠️ TEMP STORAGE (replace with DB in production scale)
    this.refreshStore = new Map();
  }

  /**
   * =========================
   * REGISTER
   * =========================
   */
  async register({ email, password, name }) {
    if (!email || !password) {
      throw new Error("Missing credentials");
    }

    const existingUser = await this._findUserByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await this._createUser({
      id: Date.now().toString(),
      email,
      name: name || null,
      password: hashedPassword,
    });

    return this._generateAuthResponse(user);
  }

  /**
   * =========================
   * LOGIN
   * =========================
   */
  async login({ email, password }) {
    if (!email || !password) {
      throw new Error("Missing credentials");
    }

    const user = await this._findUserByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    return this._generateAuthResponse(user);
  }

  /**
   * =========================
   * REFRESH TOKEN
   * =========================
   */
  async refreshToken({ refreshToken }) {
    try {
      const decoded = jwt.verify(refreshToken, this.refreshSecret);

      const stored = this.refreshStore.get(decoded.id);
      if (stored !== refreshToken) {
        throw new Error("Invalid refresh token");
      }

      const user = await this._findUserById(decoded.id);
      if (!user) {
        throw new Error("User not found");
      }

      return this._generateAuthResponse(user);
    } catch (err) {
      throw new Error("Token refresh failed");
    }
  }

  /**
   * =========================
   * LOGOUT
   * =========================
   */
  async logout(userId) {
    if (!userId) throw new Error("Missing userId");

    this.refreshStore.delete(userId);

    return { message: "Logged out successfully" };
  }

  /**
   * =========================
   * CURRENT USER
   * =========================
   */
  async getCurrentUser(userId) {
    const user = await this._findUserById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    return this._sanitizeUser(user);
  }

  /**
   * =========================
   * AUTH RESPONSE BUILDER
   * =========================
   */
  _generateAuthResponse(user) {
    const payload = {
      id: user.id,
      email: user.email,
    };

    const accessToken = jwt.sign(payload, this.jwtSecret, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign(payload, this.refreshSecret, {
      expiresIn: "7d",
    });

    this.refreshStore.set(user.id, refreshToken);

    return {
      user: this._sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }

  /**
   * =========================
   * SECURITY HELPERS
   * =========================
   */
  _sanitizeUser(user) {
    const { password, ...safe } = user;
    return safe;
  }

  /**
   * =========================
   * MOCK DB LAYER (TO REPLACE LATER)
   * =========================
   */
  async _findUserByEmail(email) {
    // TODO: replace with real DB (Mongo/Prisma)
    return null;
  }

  async _findUserById(id) {
    // TODO: replace with real DB
    return null;
  }

  async _createUser(user) {
    return user;
  }
}

export const authService = new AuthService();
