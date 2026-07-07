/**
 * 🔐 RBAC CORE — UNIMENTORAI
 */

export const checkRole = (user, allowedRoles = []) => {
  if (!user) return false;

  const role = user.role || "user";
  return allowedRoles.includes(role);
};

/**
 * 🔐 RBAC MIDDLEWARE FACTORY
 */
export const rbac = (config = {}) => {
  const {
    roles = [],
    plans = ["FREE", "PRO", "ENTERPRISE"],
    maxRequestsPerDay,
    maxTokensPerDay,
    enableFraudCheck = true,
  } = config;

  return (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        return deny(res, 401, "UNAUTHORIZED", "Authentication required");
      }

      const role = user.role ?? "guest";
      const plan = user.plan ?? "FREE";
      const usage = user.usage ?? {};

      const requests = Number(usage.requestsToday ?? 0);
      const tokens = Number(usage.tokensToday ?? 0);

      const risk = enableFraudCheck
        ? computeRiskScore(user, requests, tokens)
        : { score: 0, level: "LOW", reason: [] };

      if (risk.level === "CRITICAL") {
        return deny(res, 403, "FRAUD_SUSPECTED", "Security block", risk);
      }

      if (roles.length && !roles.includes(role)) {
        return deny(res, 403, "FORBIDDEN_ROLE", "Role not allowed");
      }

      if (plans.length && !plans.includes(plan)) {
        return deny(res, 402, "UPGRADE_REQUIRED", "Upgrade required");
      }

      if (maxRequestsPerDay && requests >= maxRequestsPerDay) {
        return deny(res, 429, "REQUEST_LIMIT", "Limit reached");
      }

      if (maxTokensPerDay && tokens >= maxTokensPerDay) {
        return deny(res, 429, "TOKEN_LIMIT", "Limit reached");
      }

      req.access = { role, plan, usage, risk };

      next();
    } catch (error) {
      return deny(res, 500, "RBAC_ERROR", error.message);
    }
  };
};

/**
 * 🧠 FRAUD ENGINE
 */
function computeRiskScore(user, requests, tokens) {
  let score = 0;
  const reason = [];

  if (requests > 500) {
    score += 40;
    reason.push("HIGH_REQUESTS");
  }

  if (tokens > 200000) {
    score += 40;
    reason.push("HIGH_TOKENS");
  }

  if (user.plan === "FREE" && requests > 200) {
    score += 25;
    reason.push("FREE_ABUSE");
  }

  if (!user.id || !user.email) {
    score += 30;
    reason.push("MISSING_ID");
  }

  let level = "LOW";
  if (score >= 80) level = "CRITICAL";
  else if (score >= 50) level = "HIGH";
  else if (score >= 25) level = "MEDIUM";

  return { score, level, reason };
}

/**
 * ❌ RESPONSE HELPER
 */
function deny(res, status, code, message, meta = {}) {
  return res.status(status).json({
    success: false,
    code,
    message,
    ...meta,
    timestamp: Date.now(),
  });
}
