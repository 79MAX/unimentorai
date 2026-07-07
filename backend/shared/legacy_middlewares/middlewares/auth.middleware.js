import jwt from "jsonwebtoken";

/* =========================
   ⚙️ CONFIG (FAIL-FAST)
========================= */
const JWT_SECRET = process.env.JWT_SECRET;

if (
  typeof JWT_SECRET !== "string" ||
  JWT_SECRET.trim().length < 16
) {
  throw new Error("❌ JWT_SECRET missing or too weak");
}

/* =========================
   🔐 AUTH PROTECT MIDDLEWARE
========================= */
export const protect = (req, res, next) => {

  try {

    const authHeader = req.headers.authorization;

    /* =========================
       ❌ NO AUTH HEADER
    ========================= */
    if (
      typeof authHeader !== "string" ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        code: "NO_TOKEN",
        message: "Authentication token required"
      });
    }

    /* =========================
       🔑 EXTRACT TOKEN
    ========================= */
    const token = authHeader.split(" ")[1]?.trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        code: "INVALID_TOKEN",
        message: "Malformed authentication token"
      });
    }

    /* =========================
       🔐 VERIFY TOKEN
    ========================= */
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: "UniMentorAI",
      audience: "UniMentorAI-Users"
    });

    /* =========================
       ❌ INVALID PAYLOAD
    ========================= */
    if (
      !decoded ||
      typeof decoded !== "object"
    ) {
      return res.status(401).json({
        success: false,
        code: "TOKEN_VERIFICATION_FAILED",
        message: "Invalid token payload"
      });
    }

    /* =========================
       🧠 SAFE USER INJECTION
    ========================= */
    req.user = Object.freeze({
      id: decoded.id || null,
      email: decoded.email || null,
      role: decoded.role || "user",
      plan: decoded.plan || "free"
    });

    return next();

  } catch (err) {

    console.error("🔐 AUTH_ERROR:", {
      message: err.message,
      path: req.originalUrl,
      method: req.method,
      ip: req.ip
    });

    const isExpired = err.name === "TokenExpiredError";

    return res.status(401).json({
      success: false,
      code: isExpired
        ? "TOKEN_EXPIRED"
        : "UNAUTHORIZED",
      message: isExpired
        ? "Session expired"
        : "Invalid authentication token"
    });
  }
};

