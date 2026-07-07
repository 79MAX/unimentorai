require("dotenv").config();
const crypto = require("crypto");

/* =========================
   ENV INTELLIGENT V12
========================= */

function generateSecret() {
  return crypto.randomBytes(48).toString("hex");
}

function getEnv(key, fallback = null, options = {}) {

  const { required = false, secure = false } = options;

  let value = process.env[key];

  if (!value || value === "") {

    if (process.env.NODE_ENV !== "production") {

      if (secure) {
        value = generateSecret();
        console.warn(`⚠️ AUTO-GENERATED SECRET: ${key}`);
      } else {
        value = fallback;
      }

    } else if (required) {
      throw new Error(`❌ Missing required env variable: ${key}`);
    }
  }

  return value;
}

/* =========================
   ENV CONFIG
========================= */

const env = {

  NODE_ENV: getEnv("NODE_ENV", "development"),
  PORT: Number(getEnv("PORT", 3001)),
  HOST: getEnv("HOST", "127.0.0.1"),

  DB_URL: getEnv(
    "DB_URL",
    "mongodb://127.0.0.1:27017/unimentorai"
  ),

  JWT_SECRET: getEnv("JWT_SECRET", null, {
    required: true,
    secure: true
  }),

  JWT_REFRESH_SECRET: getEnv("JWT_REFRESH_SECRET", null, {
    secure: true
  }),

  CLIENT_URL: getEnv("CLIENT_URL", "http://localhost:5173"),

  STRIPE_SECRET_KEY: getEnv("STRIPE_SECRET_KEY", null),
  STRIPE_WEBHOOK_SECRET: getEnv("STRIPE_WEBHOOK_SECRET", null),

  PAYPAL_CLIENT_ID: getEnv("PAYPAL_CLIENT_ID", null),
  PAYPAL_CLIENT_SECRET: getEnv("PAYPAL_CLIENT_SECRET", null),

  KKIAPAY_PUBLIC_KEY: getEnv("KKIAPAY_PUBLIC_KEY", null),
  KKIAPAY_PRIVATE_KEY: getEnv("KKIAPAY_PRIVATE_KEY", null),

  AI_MODEL: getEnv("AI_MODEL", "gpt-4o-mini"),
  AI_TEMPERATURE: Number(getEnv("AI_TEMPERATURE", 0.7)),
  AI_MAX_TOKENS: Number(getEnv("AI_MAX_TOKENS", 2000)),

  ENABLE_AI: getEnv("ENABLE_AI", "true") === "true",
  ENABLE_PAYMENTS: getEnv("ENABLE_PAYMENTS", "true") === "true"
};

/* =========================
   ENV VALIDATION
========================= */

function validateEnv() {

  const warnings = [];

  if (!env.STRIPE_SECRET_KEY) warnings.push("STRIPE missing");
  if (!env.PAYPAL_CLIENT_ID) warnings.push("PAYPAL missing");

  if (warnings.length > 0) {
    console.warn("⚠️ ENV WARNINGS:", warnings);
  } else {
    console.log("✅ ENV READY");
  }
}

module.exports = {
  env,
  validateEnv
};
