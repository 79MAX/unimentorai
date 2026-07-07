import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

/**
 * =====================================
 * AUTH SERVICE (CLEAN ARCH V2)
 * =====================================
 */

export default class AuthService {
  constructor({ UserModel }) {
    this.UserModel = UserModel;

    this.sessions = new Map();

    this.jwtSecret = process.env.JWT_SECRET;
    this.jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
  }

  // =========================
  // REGISTER
  // =========================
  async register({ email, password, name }) {
    const exists = await this.UserModel.findOne({ email });

    if (exists) {
      throw this._error("USER_EXISTS", "User already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await this.UserModel.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    return this._sanitize(user);
  }

  // =========================
  // LOGIN
  // =========================
  async login({ email, password }) {
    const user = await this.UserModel.findOne({ email });

    if (!user) {
      throw this._error("INVALID_CREDENTIALS", "Invalid credentials", 401);
    }

    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
      throw this._error("INVALID_CREDENTIALS", "Invalid credentials", 401);
    }

    const sessionId = crypto.randomUUID();

    const accessToken = this._generateAccessToken(user);
    const refreshToken = this._generateRefreshToken(user, sessionId);

    this.sessions.set(user._id.toString(), {
      sessionId,
      refreshToken,
      createdAt: Date.now(),
    });

    return {
      user: this._sanitize(user),
      accessToken,
      refreshToken,
    };
  }

  // =========================
  // REFRESH TOKEN
  // =========================
  async refreshAccessToken(token) {
    try {
      const decoded = jwt.verify(token, this.jwtRefreshSecret);

      const session = this.sessions.get(decoded.id);

      if (!session) {
        throw this._error("SESSION_EXPIRED", "Session expired", 401);
      }

      if (session.sessionId !== decoded.sessionId) {
        throw this._error("INVALID_SESSION", "Invalid session", 403);
      }

      const newAccessToken = this._generateAccessToken({ _id: decoded.id });

      return { accessToken: newAccessToken };
    } catch {
      throw this._error("INVALID_TOKEN", "Invalid refresh token", 401);
    }
  }

  // =========================
  // LOGOUT
  // =========================
  async logout(userId) {
    this.sessions.delete(userId);
    return { success: true };
  }

  // =========================
  // UTILS
  // =========================
  _generateAccessToken(user) {
    return jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      this.jwtSecret,
      { expiresIn: "15m" }
    );
  }

  _generateRefreshToken(user, sessionId) {
    return jwt.sign(
      {
        id: user._id,
        sessionId,
      },
      this.jwtRefreshSecret,
      { expiresIn: "7d" }
    );
  }

  _sanitize(user) {
    const obj = user.toObject ? user.toObject() : user;
    const { password, ...safe } = obj;
    return safe;
  }

  _error(code, message, status = 500) {
    const err = new Error(message);
    err.code = code;
    err.status = status;
    return err;
  }
}
