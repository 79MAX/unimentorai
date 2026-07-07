import fs from "fs";
import path from "path";

/**
 * =====================================
 * LOGGING SYSTEM (ENTERPRISE SAFE)
 * =====================================
 */
const logError = (err) => {
  try {
    const logDir = path.resolve("logs");

    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir);
    }

    const logPath = path.join(
      logDir,
      "error.log"
    );

    const logEntry = `
===============================
TIME: ${new Date().toISOString()}
NAME: ${err.name}
MESSAGE: ${err.message}
STACK:
${err.stack || "NO STACK"}
===============================
`;

    fs.appendFileSync(logPath, logEntry);
  } catch (e) {
    console.error(
      "❌ LOGGING ERROR:",
      e.message
    );
  }
};

/**
 * =====================================
 * GLOBAL ERROR HANDLER
 * =====================================
 * MUST be placed LAST in app.js
 */
export const errorHandler = (
  err,
  req,
  res,
  next
) => {
  // log internally
  logError(err);

  console.error("❌ GLOBAL ERROR:", {
    name: err.name,
    message: err.message,
  });

  /**
   * =====================================
   * MONGOOSE ERRORS
   * =====================================
   */
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      type: "VALIDATION_ERROR",
      message: "Invalid data provided",
      errors: Object.values(
        err.errors
      ).map((e) => e.message),
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      type: "DUPLICATE_KEY",
      message:
        "Duplicate field detected",
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      type: "INVALID_ID",
      message: "Invalid ID format",
    });
  }

  /**
   * =====================================
   * JWT ERRORS
   * =====================================
   */
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      type: "JWT_ERROR",
      message: "Invalid token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      type: "TOKEN_EXPIRED",
      message: "Token expired",
    });
  }

  /**
   * =====================================
   * DEFAULT ERROR
   * =====================================
   */
  return res.status(
    err.statusCode || 500
  ).json({
    success: false,
    type: "SERVER_ERROR",
    message:
      err.message ||
      "Internal Server Error",
  });
};

/**
 * =====================================
 * ASYNC WRAPPER (CLEAN + SAFE)
 * =====================================
 * Removes try/catch everywhere in controllers
 */
export const asyncHandler =
  (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(
      next
    );
