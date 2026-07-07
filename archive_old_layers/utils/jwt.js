import jwt from "jsonwebtoken";

/* =========================
   JWT UTILS (SAAS CORE SECURITY)
   - Access token + future refresh support
   - Safer error handling
   - Config-driven expiration
========================= */

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

/* =========================
   TOKEN GENERATION
========================= */

export function generateToken(user) {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
      issuer: "UniMentorAI",
      audience: "uni-mentor-users",
    }
  );
}

/* =========================
   TOKEN VERIFICATION (SAFE)
========================= */

export function verifyToken(token) {
  try {
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    return jwt.verify(token, JWT_SECRET, {
      issuer: "UniMentorAI",
      audience: "uni-mentor-users",
    });
  } catch (error) {
    return null; // safer for middleware handling
  }
}

/* =========================
   DECODE ONLY (NO VERIFY)
========================= */

export function decodeToken(token) {
  return jwt.decode(token);
}
