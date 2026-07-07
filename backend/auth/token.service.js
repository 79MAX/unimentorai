/**
 * ==================================================
 * UNIMENTORAI TOKEN SERVICE
 * JWT Access + Refresh Tokens
 * ==================================================
 */

import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

/**
 * ==================================================
 * CONFIG VALIDATION
 * ==================================================
 */

if (!env.jwtSecret) {
  throw new Error(
    "JWT_SECRET_MISSING_IN_ENV"
  );
}

if (!env.jwtRefreshSecret) {
  throw new Error(
    "JWT_REFRESH_SECRET_MISSING_IN_ENV"
  );
}

/**
 * ==================================================
 * ACCESS TOKEN
 * ==================================================
 */

export const generateAccessToken = (
  user
) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role || "user",
    },
    env.jwtSecret,
    {
      expiresIn:
        env.jwtExpiresIn || "1h",
      issuer: "UniMentorAI",
      audience: "UniMentorAI-App",
    }
  );
};

/**
 * ==================================================
 * REFRESH TOKEN
 * ==================================================
 */

export const generateRefreshToken = (
  user
) => {
  return jwt.sign(
    {
      id: user.id,
      role: user.role || "user",
    },
    env.jwtRefreshSecret,
    {
      expiresIn:
        env.jwtRefreshExpiresIn ||
        "7d",
      issuer: "UniMentorAI",
      audience: "UniMentorAI-App",
    }
  );
};

/**
 * ==================================================
 * VERIFY ACCESS TOKEN
 * ==================================================
 */

export const verifyAccessToken = (
  token
) => {
  return jwt.verify(
    token,
    env.jwtSecret,
    {
      issuer: "UniMentorAI",
      audience: "UniMentorAI-App",
    }
  );
};

/**
 * ==================================================
 * VERIFY REFRESH TOKEN
 * ==================================================
 */

export const verifyRefreshToken = (
  token
) => {
  return jwt.verify(
    token,
    env.jwtRefreshSecret,
    {
      issuer: "UniMentorAI",
      audience: "UniMentorAI-App",
    }
  );
};

/**
 * ==================================================
 * DECODE TOKEN (NO VERIFY)
 * ==================================================
 */

export const decodeToken = (
  token
) => {
  return jwt.decode(token);
};
