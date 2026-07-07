
const jwt = require("jsonwebtoken");

/**
 * ========================
 * 🔐 AUTH MIDDLEWARE
 * ========================
 * Protects private routes using JWT
 * Injects user into req.user
 */
function authMiddleware(req, res, next) {

  try {

    // ========================
    // CHECK AUTH HEADER
    // ========================
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing"
      });
    }

    // ========================
    // EXTRACT TOKEN
    // Format: "Bearer TOKEN"
    // ========================
    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format"
      });
    }

    const token = parts[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing"
      });
    }

    // ========================
    // VERIFY TOKEN
    // ========================
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret_key"
    );

    // ========================
    // ATTACH USER CONTEXT
    // ========================
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };

    next();

  } catch (err) {

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
}

module.exports = authMiddleware;
