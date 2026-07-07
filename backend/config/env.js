import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// =========================
// 📦 PATH RESOLUTION (ESM SAFE)
// =========================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =========================
// 🌍 LOAD .ENV (BACKEND ROOT SAFE)
// =========================
const envPath = path.resolve(__dirname, "../../.env");

const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error("❌ Failed to load .env file", result.error);
  process.exit(1);
}

// =========================
// 🔐 ENV WRAPPER (CLEAN + SAFE)
// =========================
export const ENV = Object.freeze({
  MONGO_URI: process.env.MONGO_URI,
  PORT: Number(process.env.PORT || 5000),
  NODE_ENV: process.env.NODE_ENV || "development",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,

  // optional future scaling
  RATE_LIMIT_WINDOW: 15 * 60 * 1000,
  RATE_LIMIT_MAX: 500
});

// =========================
// 🛑 CRITICAL VALIDATION
// =========================
const required = ["MONGO_URI", "JWT_SECRET"];

for (const key of required) {
  if (!ENV[key]) {
    console.error(`❌ Missing ENV: ${key}`);
    process.exit(1);
  }
}

// =========================
// 🧠 DEBUG MODE (SAFE)
// =========================
if (ENV.NODE_ENV !== "production") {
  console.log("✅ ENV LOADED SUCCESSFULLY");
  console.log("🌐 CLIENT:", ENV.CLIENT_URL);
  console.log("🧠 NODE_ENV:", ENV.NODE_ENV);
}
