import dotenv from "dotenv";
import createApp from "../app.js";

dotenv.config();

/**
 * =====================================
 * ROOT RESOLVER (HARDENED)
 * =====================================
 */
function resolveRoot() {
  let cwd = process.cwd().replace(/\\/g, "/");

  return cwd
    .replace(/backend\/backend/g, "backend")
    .replace(/src\/src/g, "src");
}

const ROOT_DIR = resolveRoot();
const PORT = Number(process.env.PORT) || 5000;

let server = null;

/**
 * =====================================
 * SHUTDOWN ENGINE
 * =====================================
 */
function shutdown(signal) {
  console.log(`⚠️ SHUTDOWN: ${signal}`);

  if (server) {
    server.close(() => {
      console.log("✔ Server closed safely");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }

  setTimeout(() => process.exit(1), 5000);
}

/**
 * =====================================
 * GLOBAL ERROR GUARD
 * =====================================
 */
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err.message);
  shutdown("uncaughtException");
});

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
  shutdown("unhandledRejection");
});

/**
 * =====================================
 * BOOT V3 ULTRA AI
 * =====================================
 */
async function bootstrap() {
  try {
    console.log("🧠 BOOT V3 ULTRA AI START");
    console.log(`📁 ROOT: ${ROOT_DIR}`);

    /**
     * LAYER 1: ENV READY
     */
    if (!process.env.PORT) {
      console.log("⚠️ Default PORT used:", PORT);
    }

    /**
     * LAYER 2: APP INIT
     */
    const app = createApp();

    /**
     * LAYER 3: READY SIGNAL
     */
    server = app.listen(PORT, () => {
      console.log(`🚀 UniMentorAI ONLINE: ${PORT}`);
      console.log("🧠 SYSTEM STATUS: STABLE");
      console.log("⚡ BOOT V3 ACTIVE");
    });

    /**
     * LAYER 4: SIGNAL HANDLERS
     */
    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));

  } catch (err) {
    console.error("❌ BOOT V3 FAILED:", err.message);
    shutdown("bootstrap-error");
  }
}

bootstrap();
