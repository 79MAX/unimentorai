import jwt from "jsonwebtoken";

/**
 * =====================================
 * CONFIGURATION
 * =====================================
 */
const ACCESS_TOKEN_EXP = "15m";
const REFRESH_TOKEN_EXP = "7d";

/**
 * =====================================
 * GENERATE ACCESS TOKEN
 * (short-lived - API security)
 * =====================================
 */
export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      type: "access",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: ACCESS_TOKEN_EXP,
    }
  );
};

/**
 * =====================================
 * GENERATE REFRESH TOKEN
 * (long-lived - session persistence)
 * =====================================
 */
export const generateRefreshToken = (
  user
) => {
  return jwt.sign(
    {
      id: user._id,
      type: "refresh",
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: REFRESH_TOKEN_EXP,
    }
  );
};

/**
 * =====================================
 * VERIFY TOKEN (generic)
 * =====================================
 */
export const verifyToken = (
  token,
  secret = process.env.JWT_SECRET
) => {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    throw err;
  }
};

/**
 * =====================================
 * DECODE WITHOUT VERIFY (safe debug)
 * =====================================
 */
export const decodeToken = (token) => {
  return jwt.decode(token);
};
