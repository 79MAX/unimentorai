const WebSocket = require("ws");

const PORT = process.env.PORT || 3001;

const wss = new WebSocket.Server({ port: PORT });

const clients = new Map();
const rooms = new Map();

function send(ws, data) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  }
}

function broadcastRoom(room, data) {
  const members = rooms.get(room);
  if (!members) return;

  for (const id of members) {
    const ws = clients.get(id);
    if (ws) send(ws, data);
  }
}

wss.on("connection", (ws) => {
  const id = Date.now() + "-" + Math.random().toString(36).slice(2);

  ws.id = id;
  ws.room = "global";

  clients.set(id, ws);

  if (!rooms.has("global")) rooms.set("global", new Set());
  rooms.get("global").add(id);

  console.log("🔥 CONNECTED =>", clients.size);

  send(ws, {
    type: "WELCOME",
    clientId: id,
    room: "global"
  });

  ws.on("message", (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw);
    } catch {
      return;
    }

    switch (msg.type) {
      case "JOIN_ROOM": {
        const oldRoom = ws.room;
        const newRoom = msg.room || "global";

        rooms.get(oldRoom)?.delete(id);

        if (!rooms.has(newRoom)) rooms.set(newRoom, new Set());
        rooms.get(newRoom).add(id);

        ws.room = newRoom;

        send(ws, {
          type: "ROOM_JOINED",
          room: newRoom
        });

        break;
      }

      case "EVENT": {
        broadcastRoom(ws.room, {
          type: "EVENT",
          from: id,
          data: msg.data
        });
        break;
      }

      case "PING": {
        send(ws, { type: "PONG", t: msg.t });
        break;
      }
    }
  });

  ws.on("close", () => {
    clients.delete(id);
    rooms.get(ws.room)?.delete(id);

    console.log("❌ DISCONNECTED =>", clients.size);
  });
});

wss.on("listening", () => {
  console.log("\n🚀 WS CLUSTER SAAS MODE");
  console.log("👉 ws://localhost:" + PORT);
});
