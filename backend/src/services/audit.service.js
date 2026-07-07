import crypto from "crypto";

/**
 * =====================================
 * UNI-MENTORAI AUDIT SYSTEM
 * (ENTERPRISE OBSERVABILITY ENGINE)
 * =====================================
 *
 * PURPOSE:
 * - Full system observability
 * - Security tracking
 * - User behavior monitoring
 * - Debug + production analytics
 *
 * READY FOR:
 * - Elasticsearch
 * - Kafka streams
 * - Redis logging
 * - CloudWatch / Datadog
 */

/**
 * =====================================
 * IN-MEMORY BUFFER (DEV MODE ONLY)
 * ⚠️ Replace with ELK / Kafka / DB in production
 * =====================================
 */
const AUDIT_STORE = [];

/**
 * =====================================
 * LOG LEVELS (ENTERPRISE STANDARD)
 * =====================================
 */
export const AUDIT_LEVEL = {
  INFO: "INFO",
  WARN: "WARN",
  ERROR: "ERROR",
  SECURITY: "SECURITY",
  ABUSE: "ABUSE",
  SYSTEM: "SYSTEM",
};

/**
 * =====================================
 * TRACE ID GENERATOR
 * =====================================
 */
const generateTraceId = () =>
  crypto.randomUUID();

/**
 * =====================================
 * BASE AUDIT LOGGER
 * =====================================
 */
export const auditLog = ({
  req,
  action,
  level = AUDIT_LEVEL.INFO,
  meta = {},
}) => {
  const entry = {
    traceId: generateTraceId(),

    timestamp: new Date().toISOString(),

    service: "UniMentorAI",

    level,
    action,

    request: {
      ip:
        req?.ip ||
        req?.headers?.["x-forwarded-for"] ||
        "unknown",

      method: req?.method || "unknown",

      path: req?.path || "unknown",

      userAgent:
        req?.headers?.["user-agent"] ||
        "unknown",
    },

    meta,
  };

  /**
   * =====================================
   * STORE LOG
   * =====================================
   */
  AUDIT_STORE.push(entry);

  /**
   * =====================================
   * REAL-TIME STREAM (DEV)
   * =====================================
   */
  console.log("📊 AUDIT EVENT:", entry);

  return entry;
};

/**
 * =====================================
 * SECURITY AUDIT (AUTH / JWT / POLICY)
 * =====================================
 */
export const securityAudit = (
  req,
  reason,
  extra = {}
) => {
  return auditLog({
    req,
    action: "SECURITY_EVENT",
    level: AUDIT_LEVEL.SECURITY,
    meta: {
      reason,
      ...extra,
    },
  });
};

/**
 * =====================================
 * ABUSE / FRAUD DETECTION LOGGING
 * =====================================
 */
export const abuseAudit = (
  req,
  riskScore,
  details = {}
) => {
  return auditLog({
    req,
    action: "ABUSE_DETECTED",
    level: AUDIT_LEVEL.ABUSE,
    meta: {
      riskScore,
      ...details,
    },
  });
};

/**
 * =====================================
 * USER ACTIVITY TRACKING
 * =====================================
 */
export const userActivity = (
  req,
  action,
  meta = {}
) => {
  return auditLog({
    req,
    action,
    level: AUDIT_LEVEL.INFO,
    meta,
  });
};

/**
 * =====================================
 * SYSTEM ERROR TRACKING
 * =====================================
 */
export const errorAudit = (
  req,
  error
) => {
  return auditLog({
    req,
    action: "SYSTEM_ERROR",
    level: AUDIT_LEVEL.ERROR,
    meta: {
      message: error?.message,
      stack: error?.stack,
    },
  });
};

/**
 * =====================================
 * SYSTEM EVENTS (STARTUP / DB / SERVICES)
 * =====================================
 */
export const systemAudit = (
  action,
  meta = {}
) => {
  const entry = {
    traceId: generateTraceId(),
    timestamp: new Date().toISOString(),
    service: "UniMentorAI",
    level: AUDIT_LEVEL.SYSTEM,
    action,
    meta,
  };

  AUDIT_STORE.push(entry);
  console.log("⚙️ SYSTEM EVENT:", entry);

  return entry;
};

/**
 * =====================================
 * FETCH AUDIT LOGS (ADMIN ONLY)
 * =====================================
 */
export const getAuditLogs = () => AUDIT_STORE;

/**
 * =====================================
 * FILTER AUDIT LOGS (ENTERPRISE DEBUG TOOL)
 * =====================================
 */
export const queryAuditLogs = ({
  level,
  action,
}) => {
  return AUDIT_STORE.filter((log) => {
    if (level && log.level !== level)
      return false;
    if (action && log.action !== action)
      return false;
    return true;
  });
};

/**
 * =====================================
 * EXPORT FOR ANALYTICS PIPELINE
 * =====================================
 */
export const exportAuditSnapshot = () => {
  return {
    totalLogs: AUDIT_STORE.length,
    logs: AUDIT_STORE,
    exportedAt: new Date().toISOString(),
  };
};

export default {
  auditLog,
  securityAudit,
  abuseAudit,
  userActivity,
  errorAudit,
  systemAudit,
  getAuditLogs,
  queryAuditLogs,
  exportAuditSnapshot,
};
