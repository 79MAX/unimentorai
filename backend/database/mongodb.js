import mongoose from "mongoose";

// =========================
// 🧠 GLOBAL STATE
// =========================
let isConnected = false;

// =========================
// 🚀 CONNECT FUNCTION
// =========================
export const connectMongoDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error("MONGO_URI is missing in environment variables");
    }

    if (isConnected) {
      console.log("🟢 MongoDB already connected");
      return;
    }

    console.log("🔌 Connecting to MongoDB...");

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10
    });

    isConnected = true;

    console.log(`
🧠 MongoDB Connected Successfully
=================================
📦 DB Name : ${conn.connection.name}
🌐 Host    : ${conn.connection.host}
⚡ Status  : READY
    `);

    // =========================
    // EVENTS
    // =========================
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB Error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB Disconnected");
      isConnected = false;
    });

    mongoose.connection.on("reconnected", () => {
      console.log("🔁 MongoDB Reconnected");
      isConnected = true;
    });

  } catch (error) {
    console.error("💀 MongoDB Connection Failed:");
    console.error(error.message);

    isConnected = false;

    // ⚠️ IMPORTANT: ne pas crash en production SaaS (option safe)
    if (process.env.NODE_ENV === "production") {
      console.warn("⚠️ Running in degraded mode (no DB)");
      return;
    }

    process.exit(1);
  }
};

// =========================
// 🧠 SAFE GET CONNECTION
// =========================
export const getMongoStatus = () => {
  return {
    connected: isConnected,
    readyState: mongoose.connection.readyState
  };
};
