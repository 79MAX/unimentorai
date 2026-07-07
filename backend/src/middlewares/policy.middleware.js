import crypto from "crypto";

/**
 * =====================================
 * UNI-MENTORAI POLICY ENGINE (ENTERPRISE)
 * =====================================
 * - Input validation
 * - Abuse prevention
 * - Business rules enforcement
 * - Safe AI / SaaS protection layer
 */

/**
 * =====================================
 * POLICY CONFIG (SCALABLE)
 * =====================================
 */
const POLICY = {
  maxPayloadSize: 50000,

  forbiddenKeywords: [
    "hack",
    "exploit",
    "crack",
    "ddos",
    "fraud",
    "phishing",
    "malware",
    "inject",
    "bypass",
    "illegal",
  ],

  botSignatures: ["bot", "crawler", "spider"],

  blockedPaths: [
    "/admin",
    "/internal",
    "/system",
  ],
};

/**
 * =====================================
 * DETECT MALICIOUS CONTENT
 * =====================================
 */
const containsForbiddenContent = (input) => {
  const text = input.toLowerCase();

  return POLICY.forbiddenKeywords.some((k) =>
    text.includes(k)
  );
};

/**
 * =====================================
 * BOT DETECTION (BASIC LAYER)
 * =====================================
 */
const isBot = (req) => {
  const ua =
    req.headers["user-agent"]?.toLowerCase() ||
    "";

  return POLICY.botSignatures.some((sig) =>
    ua.includes(sig)
  );
};

/**
 * =====================================
 * PATH PROTECTION
 * =====================================
 */
const isBlockedPath = (req) => {
  return POLICY.blockedPaths.some((path) =>
    req.path.includes(path)
  );
};

/**
 * =====================================
 * POLICY AUDIT LOG (OPTIONAL)
 * =====================================
 */
const auditLog = (req, reason) => {
  console.warn("🚨 POLICY BLOCK:", {
    id: crypto.randomUUID(),
    ip: req.ip,
    path: req.path,
    reason,
    time: new Date().toISOString(),
  });
};

/**
 * =====================================
 * MAIN POLICY MIDDLEWARE
 * =====================================
 */
export const policyMiddleware = (
  req,
  res,
  next
) => {
  try {
    const payload = JSON.stringify(
      req.body || {}
    );

    /**
     * =====================================
     * 1. BLOCK SYSTEM PATHS
     * =====================================
     */
    if (isBlockedPath(req)) {
      auditLog(req, "BLOCKED_PATH");

      return res.status(403).json({
        success: false,
        code: "POLICY_BLOCKED_PATH",
        message: "Access denied.",
      });
    }

    /**
     * =====================================
     * 2. PAYLOAD SIZE LIMIT
     * =====================================
     */
    if (payload.length > POLICY.maxPayloadSize) {
      auditLog(req, "PAYLOAD_TOO_LARGE");

      return res.status(413).json({
        success: false,
        code: "PAYLOAD_LIMIT_EXCEEDED",
        message: "Payload too large.",
      });
    }

    /**
     * =====================================
     * 3. FORBIDDEN CONTENT CHECK
     * =====================================
     */
    if (containsForbiddenContent(payload)) {
      auditLog(req, "FORBIDDEN_CONTENT");

      return res.status(403).json({
        success: false,
        code: "POLICY_VIOLATION",
        message:
          "Request blocked by UniMentorAI policy engine.",
      });
    }

    /**
     * =====================================
     * 4. BOT DETECTION
     * =====================================
     */
    if (isBot(req)) {
      auditLog(req, "BOT_DETECTED");

      return res.status(403).json({
        success: false,
        code: "BOT_BLOCKED",
        message: "Automated access denied.",
      });
    }

    /**
     * =====================================
     * 5. REQUEST PASSED POLICY
     * =====================================
     */
    next();
  } catch (err) {
    console.error("❌ POLICY ENGINE ERROR:", err);

    return res.status(500).json({
      success: false,
      code: "POLICY_ENGINE_FAILURE",
      message: "Policy system error",
    });
  }
};

export default policyMiddleware;
