/* =========================
   TOKEN ENGINE (ENTERPRISE V3.1)
   - Secure JWT layer
   - Production hardened
   - SaaS scalable
========================= */

import jwt from "jsonwebtoken";

/* =========================
   ENV SAFETY CHECK
========================= */
const ACCESS_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error("JWT secrets are not defined in environment variables");
}

/* =========================
   COMMON JWT OPTIONS
========================= */
const ACCESS_OPTIONS = {
  expiresIn: "15m",
  issuer: "UniMentorAI",
};

const REFRESH_OPTIONS = {
  expiresIn: "7d",
  issuer: "UniMentorAI",
};

/* =========================
   SAFE SIGN WRAPPER
========================= */
function signToken(payload, secret, options) {
  try {
    return jwt.sign(payload, secret, options);
  } catch (err) {
    throw new Error(`TOKEN_SIGN_ERROR: ${err.message}`);
  }
}

/* =========================
   SAFE VERIFY WRAPPER
========================= */
function verifyToken(token, secret) {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    throw new Error("INVALID_OR_EXPIRED_TOKEN");
  }
}

/* =========================
   ACCESS TOKEN (SHORT LIVED)
========================= */
export function generateAccessToken(user) {
  return signToken(
    {
      sub: user._id, // standard JWT subject
      role: user.role,
    },
    ACCESS_SECRET,
    ACCESS_OPTIONS
  );
}

/* =========================
   REFRESH TOKEN (LONG LIVED)
========================= */
export function generateRefreshToken(user) {
  return signToken(
    {
      sub: user._id,
      type: "refresh",
    },
    REFRESH_SECRET,
    REFRESH_OPTIONS
  );
}

/* =========================
   VERIFY ACCESS TOKEN
========================= */
export function verifyAccessToken(token) {
  const decoded = verifyToken(token, ACCESS_SECRET);

  return {
    id: decoded.sub,
    role: decoded.role,
  };
}

/* =========================
   VERIFY REFRESH TOKEN
========================= */
export function verifyRefreshToken(token) {
  const decoded = verifyToken(token, REFRESH_SECRET);

  if (decoded.type !== "refresh") {
    throw new Error("INVALID_REFRESH_TOKEN");
  }

  return {
    id: decoded.sub,
  };
}
