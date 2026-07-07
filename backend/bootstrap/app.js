import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { moduleRegistry } from "./module.registry.js";

dotenv.config();

/**
 * ==================================================
 * UNIMENTORAI APP BOOTSTRAP (LOCKED ARCHITECTURE)
 * ==================================================
 *
 * 🎯 ROLE:
 * - Initialize Express app
 * - Load modules dynamically from registry
 * - Ensure zero hardcoded routes
 */

const app = express();

/**
 * ==========================
 * GLOBAL MIDDLEWARES
 * ==========================
 */
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/**
 * ==========================
 * HEALTH CHECK
 * ==========================
 */
app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "🚀 UniMentorAI API running (LOCKED ARCHITECTURE)",
    version: "1.0.0",
  });
});

/**
 * ==========================
 * MODULE LOADER (CORE ENGINE)
 * ==========================
 */
moduleRegistry.forEach((module) => {
  app.use(module.path, module.handler);
});

/**
 * ==========================
 * GLOBAL ERROR HANDLER
 * ==========================
 */
app.use((err, req, res, next) => {
  console.error("❌ GLOBAL ERROR:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    code: err.code || "SERVER_ERROR",
  });
});

export default app;
