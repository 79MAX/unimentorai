import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

/**
 * =====================================
 * UniMentorAI - APP CORE (CLEAN LAYER)
 * =====================================
 * ⚠️ NO MODULE LOADER HERE
 * ⚠️ ONLY EXPRESS SETUP
 */

export function createApp() {
  const app = express();

  // =========================
  // SECURITY LAYER
  // =========================
  app.use(helmet());

  app.use(
    cors({
      origin: process.env.CLIENT_URL || "*",
      credentials: true,
    })
  );

  // =========================
  // CORE MIDDLEWARES
  // =========================
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("dev"));

  // =========================
  // HEALTH CHECK
  // =========================
  app.get("/health", (req, res) => {
    res.status(200).json({
      status: "OK",
      system: "UniMentorAI",
      architecture: "BOOT ORCHESTRATOR V3",
      moduleSystem: "V5 AI (handled by orchestrator)",
      selfHealing: true,
      timestamp: new Date().toISOString(),
    });
  });

  // =========================
  // ROOT ROUTE
  // =========================
  app.get("/", (req, res) => {
    res.status(200).json({
      message: "UniMentorAI API is running",
      version: "V3 ORCHESTRATED",
    });
  });

  // =========================
  // 404 HANDLER
  // =========================
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: "Route not found",
      path: req.originalUrl,
    });
  });

  // =========================
  // GLOBAL ERROR HANDLER
  // =========================
  app.use((err, req, res, next) => {
    console.error("🔥 Global Error:", err);

    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  });

  return app;
}

export default createApp;
