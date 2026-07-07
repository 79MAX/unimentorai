import dotenv from "dotenv";
import http from "http";
import app from "./app.js";
import { connectDB, disconnectDB } from "./config/database.js";

/**
 * ==========================
 * ENV LOAD (SAFE FIRST)
 * ==========================
 */
dotenv.config();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

/**
 * ==========================
 * SERVER INSTANCE
 * ==========================
 */
const server = http.createServer(app);

/**
 * ==========================
 * START BOOT SEQUENCE
 * ==========================
 */
async function startServer() {
  try {
    console.log("🚀 Boot sequence started...");
    console.log("🧠 NODE ENV:", NODE_ENV);
    console.log("📡 PORT:", PORT);

    // 1. Database first (critical)
    await connectDB();

    // 2. Start HTTP server
    server.listen(PORT, () => {
      console.log("================================");
      console.log("🚀 UniMentorAI SERVER ONLINE");
      console.log(`🌍 http://localhost:${PORT}`);
      console.log("================================");
    });

  } catch (err) {
    console.error("❌ SERVER BOOT FAILED:", err.message);
    process.exit(1);
  }
}

/**
 * ==========================
 * GRACEFUL SHUTDOWN (ENTERPRISE)
 * ==========================
 */
async function shutdown(signal) {
  console.log(`\n🛑 Received ${signal}, shutting down...`);

  server.close(async () => {
    console.log("📴 HTTP server closed");

    await disconnectDB();

    console.log("✅ Shutdown completed safely");
    process.exit(0);
  });

  // force kill after timeout
  setTimeout(() => {
    console.error("💀 Forced shutdown");
    process.exit(1);
  }, 10000);
}

/**
 * ==========================
 * PROCESS EVENTS
 * ==========================
 */
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

process.on("unhandledRejection", (err) => {
  console.error("❌ UNHANDLED REJECTION:", err);
});

process.on("uncaughtException", (err) => {
  console.error("❌ UNCAUGHT EXCEPTION:", err);
  process.exit(1);
});

/**
 * ==========================
 * START
 * ==========================
 */
startServer();
