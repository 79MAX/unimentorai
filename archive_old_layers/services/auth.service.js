/* =========================
   AUTH SERVICE (ENTERPRISE V3.2)
   - Secure SaaS-ready core
   - Clean architecture
   - Production hardened
========================= */

import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/tokens.js";

/* =========================
   ERROR FACTORY (CLEAN SaaS ERRORS)
========================= */
function authError(code) {
  const errors = {
    USER_ALREADY_EXISTS: "USER_ALREADY_EXISTS",
    INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
    USER_NOT_FOUND: "USER_NOT_FOUND",
  };

  const err = new Error(errors[code] || "AUTH_ERROR");
  err.code = code;
  return err;
}

/* =========================
   SAFE USER SERIALIZER
   (NEVER expose password)
========================= */
function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
  };
}

/* =========================
   REGISTER USER (HARDENED)
========================= */
export async function registerUser({ name, email, password }) {
  const normalizedEmail = email.toLowerCase().trim();

  const exists = await User.findOne({ email: normalizedEmail });

  if (exists) {
    throw authError("USER_ALREADY_EXISTS");
  }

  const hashedPassword = await bcrypt.hash(password, 12); // stronger hashing

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken,
  };
}

/* =========================
   LOGIN USER (HARDENED)
========================= */
export async function loginUser({ email, password }) {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({ email: normalizedEmail }).select(
    "+password"
  );

  if (!user) {
    throw authError("INVALID_CREDENTIALS");
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    throw authError("INVALID_CREDENTIALS");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken,
  };
}
