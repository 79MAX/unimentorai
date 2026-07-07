import { assertCleanV12 } from "./core/bootstrap/v12.guard.js";
import http from "http";
import app from "./bootstrap/app.js";
import dotenv from "dotenv";

dotenv.config();

/* =====================================================
   UNIMENTORAI BACKEND V12 SERVER
   HTTP API ENTRY POINT
===================================================== */

// Architecture protection
assertCleanV12();

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);


server.listen(PORT, () => {

  console.log("");

  console.log("🚀 UNIMENTORAI BACKEND V12");

  console.log(`HTTP: http://localhost:${PORT}`);

  console.log("STATUS: ONLINE");

});


/* =====================================================
   SAFE SHUTDOWN
===================================================== */

process.on("SIGINT", () => {

  console.log("\n🛑 Shutting down V12 server...");

  server.close(() => {

    console.log("✅ SERVER STOPPED");

    process.exit(0);

  });

});