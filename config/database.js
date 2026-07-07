import mongoose from "mongoose";

/**
 * ==========================
 * DB CONFIG (ENTERPRISE SAFE)
 * ==========================
 */
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI missing in environment");
  process.exit(1);
}

/**
 * ==========================
 * MONGOOSE OPTIONS (PROD READY)
 * ==========================
 */
const options = {
  maxPoolSize: 20,          // scaling requests
  minPoolSize: 5,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,                // force IPv4 (stable on Windows/Linux)
};

/**
 * ==========================
 * CONNECTION STATE TRACKER
 * ==========================
 */
let isConnected = false;

/**
 * ==========================
 * CONNECT FUNCTION (SAFE + RETRY)
 * ==========================
 */
export async function connectDB(retries = 5, delay = 3000) {
  if (isConnected) {
    console.log("🧠 DB already connected (reuse connection)");
    return;
  }

  for (let i = 1; i <= retries; i++) {
    try {
      await mongoose.connect(MONGO_URI, options);

      isConnected = true;

      console.log("🧠 MongoDB CONNECTED SUCCESSFULLY");
      console.log(`📦 Host: ${mongoose.connection.host}`);

      return;

    } catch (err) {
      console.error(`❌ DB attempt #${i} failed:`, err.message);

      if (i === retries) {
        console.error("💀 MongoDB connection failed permanently");
        process.exit(1);
      }

      await new Promise(res => setTimeout(res, delay));
    }
  }
}

/**
 * ==========================
 * DISCONNECT SAFE
 * ==========================
 */
export async function disconnectDB() {
  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log("📴 MongoDB disconnected safely");
  } catch (err) {
    console.error("⚠️ Disconnect error:", err.message);
  }
}

/**
 * ==========================
 * DB HEALTH CHECK
 * ==========================
 */
export function getDBStatus() {
  return {
    connected: mongoose.connection.readyState === 1,
    host: mongoose.connection.host || null,
    name: mongoose.connection.name || null,
  };
}

/**
 * ==========================
 * GRACEFUL EVENTS
 * ==========================
 */
mongoose.connection.on("connected", () => {
  console.log("🔗 Mongoose event: connected");
});

mongoose.connection.on("disconnected", () => {
  console.log("⚠️ Mongoose event: disconnected");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ Mongoose error:", err.message);
});
