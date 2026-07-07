import mongoose from "mongoose";

/**
 * 🛑 Gestion propre de l’arrêt du serveur
 * - ferme MongoDB
 * - arrête proprement Node.js
 * - évite corruption + connexions fantômes
 */

export const setupGracefulShutdown = (server) => {
  const shutdown = async (signal) => {
    console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);

    try {
      // 1. Stop accepting new requests
      if (server) {
        server.close(() => {
          console.log("🌐 HTTP server closed");
        });
      }

      // 2. Close MongoDB connection
      if (mongoose.connection.readyState === 1) {
        await mongoose.connection.close(false);
        console.log("📴 MongoDB connection closed");
      }

      console.log("✅ Shutdown completed successfully");
      process.exit(0);
    } catch (err) {
      console.error("❌ Error during shutdown:", err);
      process.exit(1);
    }
  };

  // 🔥 Signals système
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));

  // 💥 Crash fallback
  process.on("uncaughtException", (err) => {
    console.error("🔥 Uncaught Exception:", err);
    shutdown("UNCAUGHT_EXCEPTION");
  });

  process.on("unhandledRejection", (reason) => {
    console.error("🔥 Unhandled Rejection:", reason);
    shutdown("UNHANDLED_REJECTION");
  });
};
