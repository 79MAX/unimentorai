import jwt from "jsonwebtoken";

/**
 * =====================================
 * UNI-MENTORAI JWT AUTH SYSTEM
 * (ENTERPRISE SECURITY LAYER)
 * =====================================
 *
 * Features:
 * - Access token verification
 * - Refresh-ready structure
 * - Role injection
 * - Secure error handling
 * - Production-ready API guard
 */

/**
 * =====================================
 * EXTRACT TOKEN FROM HEADER
 * =====================================
 */
const extractToken = (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return null;

  if (!authHeader.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.split(" ")[1];
};

/**
 * =====================================
 * VERIFY JWT TOKEN
 * =====================================
 */
export const verifyToken = (
  req,
  res,
  next
) => {
  try {
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        code: "NO_TOKEN",
        message:
          "Access denied. Token missing.",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    /**
     * =====================================
     * ATTACH USER TO REQUEST
     * =====================================
     */
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role || "user",
      sessionId: decoded.sessionId,
    };

    next();
  } catch (err) {
    /**
     * =====================================
     * TOKEN ERROR HANDLING
     * =====================================
     */
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        code: "TOKEN_EXPIRED",
        message: "Token expired.",
      });
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        code: "INVALID_TOKEN",
        message: "Invalid token.",
      });
    }

    return res.status(401).json({
      success: false,
      code: "AUTH_FAILED",
      message: "Authentication failed.",
    });
  }
};

/**
 * =====================================
 * ROLE-BASED ACCESS CONTROL (RBAC)
 * =====================================
 */
export const requireRole = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          code: "FORBIDDEN",
          message:
            "Insufficient permissions",
        });
      }

      next();
    } catch (err) {
      return res.status(500).json({
        success: false,
        message:
          "Role verification error",
      });
    }
  };
};

/**
 * =====================================
 * ADMIN ONLY GUARD
 * =====================================
 */
export const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      success: false,
      code: "ADMIN_ONLY",
      message:
        "Admin access required",
    });
  }

  next();
};

/**
 * =====================================
 * MENTOR ONLY GUARD
 * =====================================
 */
export const isMentor = (req, res, next) => {
  if (
    !["mentor", "admin"].includes(
      req.user?.role
    )
  ) {
    return res.status(403).json({
      success: false,
      code: "MENTOR_ONLY",
      message:
        "Mentor access required",
    });
  }

  next();
};

/**
 * =====================================
 * OPTIONAL: SAFE USER CHECK
 * =====================================
 */
export const optionalAuth = (
  req,
  res,
  next
) => {
  try {
    const token = extractToken(req);

    if (!token) return next();

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();
  } catch {
    // Ignore errors (public route)
    next();
  }
};

export default {
  verifyToken,
  requireRole,
  isAdmin,
  isMentor,
  optionalAuth,
};
