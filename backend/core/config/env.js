require("dotenv").config();

/* =========================
   ENV VALIDATION CORE
   FAIL FAST STRATEGY
========================= */

function getEnv(key, defaultValue = undefined, required = false) {

  const value = process.env[key] || defaultValue;

  if (required && (value === undefined || value === "")) {
    throw new Error(`❌ Missing required env variable: ${key}`);
  }

  return value;
}

/* =========================
   ENV PARSER HELPERS
========================= */

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return isNaN(parsed) ? fallback : parsed;
};

const toBoolean = (value, fallback = false) => {
  if (value === undefined) return fallback;
  return value === "true" || value === true;
};

/* =========================
   CONFIG OBJECT (SINGLE SOURCE OF TRUTH)
========================= */

const env = {

  /* =========================
     SERVER CONFIG
  ========================= */

  NODE_ENV: getEnv("NODE_ENV", "development"),
  PORT: toNumber(getEnv("PORT", 3001)),

  HOST: getEnv("HOST", "127.0.0.1"),

  /* =========================
     CORS CONFIG
  ========================= */

  CORS_ORIGINS: getEnv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173"
  ).split(","),

  /* =========================
     DATABASE
  ========================= */

  DB_URL: getEnv("DB_URL", "", true),

  DB_POOL_SIZE: toNumber(getEnv("DB_POOL_SIZE", 10)),

  /* =========================
     JWT SECURITY
  ========================= */

  JWT_SECRET: getEnv("JWT_SECRET", "", true),

  JWT_EXPIRES_IN: getEnv("JWT_EXPIRES_IN", "7d"),

  /* =========================
     WS CONFIG
  ========================= */

  WS_HEARTBEAT_INTERVAL: toNumber(getEnv("WS_HEARTBEAT_INTERVAL", 30000)),

  WS_RECONNECT_LIMIT: toNumber(getEnv("WS_RECONNECT_LIMIT", 5)),

  /* =========================
     AI CONFIG (future-ready)
  ========================= */

  AI_ENABLED: toBoolean(getEnv("AI_ENABLED", true)),

  AI_MODEL: getEnv("AI_MODEL", "gpt-v12-mini"),

  AI_TIMEOUT_MS: toNumber(getEnv("AI_TIMEOUT_MS", 8000)),

  /* =========================
     SECURITY FLAGS
  ========================= */

  RATE_LIMIT_ENABLED: toBoolean(getEnv("RATE_LIMIT_ENABLED", true)),

  DEBUG_MODE: toBoolean(getEnv("DEBUG_MODE", false)),

  /* =========================
     METADATA
  ========================= */

  APP_NAME: getEnv("APP_NAME", "UniMentorAI"),
  VERSION: getEnv("VERSION", "V12"),

};

/* =========================
   SANITY CHECK (BOOT VALIDATION)
========================= */

function validateEnv() {

  const required = [
    "DB_URL",
    "JWT_SECRET"
  ];

  required.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`❌ ENV ERROR: ${key} is required`);
    }
  });

  console.log("✅ ENV validated successfully");
}

/* =========================
   EXPORT
========================= */

module.exports = {
  env,
  validateEnv
};