import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * =====================================
 * AUTH SERVICE V4 - ENTERPRISE CORE
 * =====================================
 */

export default class AuthService {
  constructor({ userRepository, tokenStore }) {
    if (!userRepository) throw new Error("userRepository required");
    if (!tokenStore) throw new Error("tokenStore required");

    this.userRepository = userRepository;
    this.tokenStore = tokenStore;

    this.jwtSecret = process.env.JWT_SECRET;
    this.refreshSecret = process.env.JWT_REFRESH_SECRET;
  }

  // REGISTER
  async register({ email, password, name }) {
    const exists = await this.userRepository.findByEmail(email);
    if (exists) throw this._error("USER_EXISTS", "User exists", 409);

    const hashed = await bcrypt.hash(password, 12);

    const user = await this.userRepository.create({
      email,
      name,
      password: hashed,
      role: "user",
    });

    return { user: this._sanitize(user) };
  }

  // LOGIN
  async login({ email, password }) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw this._error("INVALID", "Invalid credentials", 401);

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw this._error("INVALID", "Invalid credentials", 401);

    const tokens = this._tokens(user);

    await this.tokenStore.save(user.id, {
      refreshToken: tokens.refreshToken,
      sessionId: tokens.sessionId,
    });

    return { user: this._sanitize(user), ...tokens };
  }

  // REFRESH
  async refresh(refreshToken) {
    const decoded = jwt.verify(refreshToken, this.refreshSecret);

    const session = await this.tokenStore.get(decoded.id);

    if (!session || session.refreshToken !== refreshToken) {
      throw this._error("INVALID_SESSION", "Session invalid", 401);
    }

    const user = await this.userRepository.findById(decoded.id);
    const tokens = this._tokens(user);

    await this.tokenStore.save(user.id, {
      refreshToken: tokens.refreshToken,
      sessionId: tokens.sessionId,
    });

    return tokens;
  }

  // LOGOUT
  async logout(userId) {
    await this.tokenStore.delete(userId);
    return { success: true };
  }

  // TOKENS
  _tokens(user) {
    const sessionId = crypto.randomUUID();

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      sessionId,
    };

    return {
      sessionId,
      accessToken: jwt.sign(payload, this.jwtSecret, {
        expiresIn: "15m",
      }),
      refreshToken: jwt.sign(payload, this.refreshSecret, {
        expiresIn: "7d",
      }),
    };
  }

  _sanitize(user) {
    const { password, ...safe } = user;
    return safe;
  }

  _error(code, message, status) {
    const err = new Error(message);
    err.code = code;
    err.status = status;
    return err;
  }
}
