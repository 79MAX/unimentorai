import mongoose from "mongoose";

/**
 * ==============================
 * 🧠 MONGODB CONNECTION LAYER
 * UniMentorAI - Production Grade
 * ==============================
 */

let isConnected = false;

const connectDB = async () => {
  try {
    // =========================
    // ENV VALIDATION
    // =========================
    const uri = process.env.MONGO_URI || process.env.DB_URL;

    if (!uri) {
      throw new Error("❌ MONGO_URI / DB_URL is not defined");
    }

    if (isConnected) {
      console.log("🧠 MongoDB already connected");
      return;
    }

    console.log("🔌 MongoDB connecting...");

    // =========================
    // CONNECTION OPTIONS (STABLE)
    // =========================
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
      retryWrites: true
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
    // EVENTS HANDLING
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
    console.error("💀 MongoDB Connection Failed");
    console.error(error.message);

    // =========================
    // RETRY STRATEGY (IMPORTANT)
    // =========================
    console.log("🔁 Retry in 3 seconds...");

    setTimeout(() => {
      connectDB();
    }, 3000);
  }
};

export default connectDB;