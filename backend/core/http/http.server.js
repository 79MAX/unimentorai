const express = require("express");
const http = require("http");
const cors = require("cors");

/* =========================
   HTTP SERVER FACTORY
========================= */

function createHttpServer({ routes, middlewares = [], config = {} }) {

  const app = express();

  /* =========================
     CORE MIDDLEWARES
  ========================= */

  app.use(cors({
    origin: config.corsOrigins || ["http://localhost:5173"],
    credentials: true
  }));

  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true }));

  /* =========================
     CUSTOM MIDDLEWARES (PLUGIN SYSTEM)
  ========================= */

  middlewares.forEach((mw) => {
    if (typeof mw === "function") {
      app.use(mw);
    }
  });

  /* =========================
     HEALTH ROUTE (CORE)
  ========================= */

  app.get("/health", (req, res) => {
    res.status(200).json({
      status: "ok",
      uptime: process.uptime(),
      timestamp: Date.now()
    });
  });

  /* =========================
     ROUTES INJECTION (MODULAR)
  ========================= */

  if (routes && Array.isArray(routes)) {
    routes.forEach((route) => {
      if (route && route.path && route.router) {
        app.use(route.path, route.router);
      }
    });
  }

  /* =========================
     ERROR HANDLER (GLOBAL SAFETY NET)
  ========================= */

  app.use((err, req, res, next) => {

    console.error("❌ HTTP ERROR:", err);

    res.status(err.status || 500).json({
      error: true,
      message: err.message || "Internal Server Error"
    });
  });

  /* =========================
     HTTP SERVER WRAPPER
  ========================= */

  const server = http.createServer(app);

  return {
    app,
    server
  };
}

module.exports = createHttpServer;