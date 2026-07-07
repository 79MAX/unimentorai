import http from "http";
import express from "express";
import { WebSocketServer } from "ws";

const app = express();
const server = http.createServer(app);

/* =========================
   HTTP ROUTE
========================= */

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

/* =========================
   WS ATTACHED TO HTTP SERVER
========================= */

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("🟢 WS CLIENT CONNECTED");

  ws.send(JSON.stringify({
    type: "WELCOME",
    message: "connected"
  }));
});

/* =========================
   START SERVER
========================= */

server.listen(3001, () => {
  console.log("🚀 SERVER RUNNING ON 3001");
});