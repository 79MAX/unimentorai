import crypto from "crypto";

/**
 * =====================================
 * UNI-MENTORAI ABUSE INTELLIGENCE ENGINE
 * (ENTERPRISE BEHAVIOR RISK SYSTEM)
 * =====================================
 *
 * Features:
 * - Risk scoring (0–100)
 * - Behavioral tracking
 * - Bot detection
 * - Request velocity analysis
 * - Payload anomaly detection
 * - Adaptive blocking
 */

/**
 * =====================================
 * MEMORY STORE (DEV MODE)
 * ⚠️ Production → Redis / DynamoDB
 * =====================================
 */
const store = new Map();

/**
 * =====================================
 * CONFIGURATION
 * =====================================
 */
const CONFIG = {
  maxRequestsPerMinute: 120,
  burstThreshold: 40,
  riskBlockThreshold: 80,
  suspiciousUserAgents: [
    "python",
    "axios",
    "curl",
    "postman",
    "wget",
  ],
};

/**
 * =====================================
 * GET USER KEY
 * =====================================
 */
const getKey = (req) =>
  req.ip ||
  req.headers["x-forwarded-for"] ||
  "unknown";

/**
 * =====================================
 * INIT USER PROFILE
 * =====================================
 */
const initUser = (key) => {
  if (!store.has(key)) {
    store.set(key, {
      requests: [],
      payloads: [],
      risk: 0,
      lastSeen: Date.now(),
    });
  }
  return store.get(key);
};

/**
 * =====================================
 * HASH PAYLOAD (ANTI-REPLAY)
 * =====================================
 */
const hash = (data) =>
  crypto
    .createHash("sha256")
    .update(JSON.stringify(data || {}))
    .digest("hex");

/**
 * =====================================
 * RISK ENGINE
 * =====================================
 */
const addRisk = (user, value, reason) => {
  user.risk += value;
  if (user.risk > 100) user.risk = 100;

  console.warn("⚠️ RISK EVENT:", {
    reason,
    risk: user.risk,
    time: new Date().toISOString(),
  });
};

/**
 * =====================================
 * ABUSE MIDDLEWARE
 * =====================================
 */
export const abuseMiddleware = (
  req,
  res,
  next
) => {
  try {
    const key = getKey(req);
    const user = initUser(key);

    const now = Date.now();
    user.lastSeen = now;

    /**
     * =====================================
     * TRACK REQUESTS (1 MIN WINDOW)
     * =====================================
     */
    user.requests.push(now);

    user.requests = user.requests.filter(
      (t) => now - t < 60000
    );

    const reqCount = user.requests.length;

    /**
     * =====================================
     * 1. REQUEST FLOODING DETECTION
     * =====================================
     */
    if (
      reqCount > CONFIG.maxRequestsPerMinute
    ) {
      addRisk(user, 35, "REQUEST_FLOOD");
    }

    /**
     * =====================================
     * 2. BURST DETECTION
     * =====================================
     */
    const burst = reqCount > CONFIG.burstThreshold;

    if (burst) {
      addRisk(user, 20, "BURST_ACTIVITY");
    }

    /**
     * =====================================
     * 3. PAYLOAD REPLAY / SPAM DETECTION
     * =====================================
     */
    const payloadHash = hash(req.body);

    user.payloads.push(payloadHash);
    user.payloads = user.payloads.slice(-30);

    const repeats =
      user.payloads.filter(
        (p) => p === payloadHash
      ).length;

    if (repeats > 5) {
      addRisk(user, 25, "REPEATED_PAYLOAD");
    }

    /**
     * =====================================
     * 4. BOT / AUTOMATION DETECTION
     * =====================================
     */
    const ua =
      req.headers["user-agent"]?.toLowerCase() ||
      "";

    if (
      CONFIG.suspiciousUserAgents.some((b) =>
        ua.includes(b)
      )
    ) {
      addRisk(user, 20, "BOT_SIGNATURE");
    }

    /**
     * =====================================
     * 5. SUSPICIOUS PATH PATTERNS
     * =====================================
     */
    if (
      req.path.includes("admin") ||
      req.path.includes("internal") ||
      req.path.includes("system")
    ) {
      addRisk(user, 30, "SUSPICIOUS_PATH");
    }

    /**
     * =====================================
     * FINAL DECISION ENGINE
     * =====================================
     */
    if (user.risk >= CONFIG.riskBlockThreshold) {
      return res.status(403).json({
        success: false,
        code: "ABUSE_BLOCKED",
        risk: user.risk,
        message:
          "Access blocked due to abnormal behavior.",
        traceId: crypto.randomUUID(),
      });
    }

    next();
  } catch (err) {
    console.error(
      "❌ ABUSE ENGINE ERROR:",
      err.message
    );

    return res.status(500).json({
      success: false,
      code: "ABUSE_ENGINE_FAILURE",
      message:
        "Abuse detection system error",
    });
  }
};

export default abuseMiddleware;
