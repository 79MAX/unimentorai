import util from "util";

/**
 * ==========================
 * ERROR CLASS STANDARD (OPTIONNEL MAIS PRO)
 * ==========================
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, code = "INTERNAL_ERROR") {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * ==========================
 * FORMATTER (SAFE OUTPUT)
 * ==========================
 */
function formatError(err) {
  return {
    success: false,
    message: err.message || "Internal Server Error",
    code: err.code || "INTERNAL_ERROR",
    statusCode: err.statusCode || 500,
    timestamp: new Date().toISOString(),
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  };
}

/**
 * ==========================
 * LOGGER ENTERPRISE (STRUCTURED)
 * ==========================
 */
function logError(err, req) {
  console.error("====================================");
  console.error("❌ ERROR OCCURRED");
  console.error("🧭 METHOD:", req?.method);
  console.error("🌐 URL:", req?.originalUrl);
  console.error("📡 IP:", req?.ip);
  console.error("🧠 MESSAGE:", err.message);
  console.error("🔢 STATUS:", err.statusCode || 500);
  console.error("====================================");

  if (process.env.NODE_ENV === "development") {
    console.error("STACK TRACE:");
    console.error(err.stack);
  }
}

/**
 * ==========================
 * GLOBAL ERROR HANDLER
 * ==========================
 */
export function errorMiddleware(err, req, res, next) {
  let error = err;

  /**
   * ==========================
   * NORMALISATION
   * ==========================
   */
  if (!(error instanceof AppError)) {
    error = new AppError(
      err.message || "Unexpected Error",
      err.statusCode || 500,
      err.code || "UNEXPECTED_ERROR"
    );
  }

  /**
   * ==========================
   * LOGGING
   * ==========================
   */
  logError(error, req);

  /**
   * ==========================
   * RESPONSE SAFE
   * ==========================
   */
  const response = formatError(error);

  return res.status(error.statusCode || 500).json(response);
}

/**
 * ==========================
 * 404 HANDLER (SEPARATE CLEAN)
 * ==========================
 */
export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
    code: "NOT_FOUND",
    timestamp: new Date().toISOString(),
  });
}
