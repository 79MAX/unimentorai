import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

/**
 * =====================================
 * AUTHENTICATE USER
 * =====================================
 */
const authenticate = async (
  req,
  res,
  next
) => {
  try {
    const authHeader =
      req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const token =
      authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(
      decoded.id
    )
      .select("-password -refreshToken")
      .lean();

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: "Account disabled",
      });
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      isVerified: user.isVerified,
    };

    next();
  } catch (error) {
    if (
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }

    if (
      error.name === "JsonWebTokenError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    console.error(
      "AUTH MIDDLEWARE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

/**
 * =====================================
 * ROLE GUARD
 * =====================================
 */
const authorize =
  (...allowedRoles) =>
  (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message:
            "Authentication required",
        });
      }

      if (
        !allowedRoles.includes(
          req.user.role
        )
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Insufficient permissions",
        });
      }

      next();
    } catch (error) {
      console.error(
        "AUTHORIZE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Authorization failed",
      });
    }
  };

/**
 * =====================================
 * OPTIONAL AUTH
 * =====================================
 */
const optionalAuth = async (
  req,
  res,
  next
) => {
  try {
    const authHeader =
      req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return next();
    }

    const token =
      authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(
      decoded.id
    )
      .select("-password -refreshToken")
      .lean();

    if (user) {
      req.user = {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      };
    }

    next();
  } catch {
    next();
  }
};

/**
 * =====================================
 * ADMIN ONLY
 * =====================================
 */
const adminOnly = authorize(
  "admin",
  "super_admin"
);

/**
 * =====================================
 * MENTOR ONLY
 * =====================================
 */
const mentorOnly = authorize(
  "mentor",
  "admin",
  "super_admin"
);

/**
 * =====================================
 * TRAINER ONLY
 * =====================================
 */
const trainerOnly = authorize(
  "trainer",
  "admin",
  "super_admin"
);

export default {
  authenticate,
  authorize,
  optionalAuth,
  adminOnly,
  mentorOnly,
  trainerOnly,
};
