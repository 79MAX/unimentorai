import { Server } from "socket.io";

let io = null;

export const initSocket = (server) => {
  if (io) return io;

  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("🔥 CLIENT CONNECTED =>", socket.id);

    socket.on("disconnect", () => {
      console.log("❌ CLIENT DISCONNECTED =>", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket not initialized");
  return io;
};