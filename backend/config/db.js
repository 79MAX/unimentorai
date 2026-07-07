import mongoose from "mongoose";

/**
 * ==================================================
 * DATABASE CORE ENGINE V3
 * UniMentorAI Infrastructure Layer
 * ==================================================
 */

const connectDB = async () => {
  try {
    const mongoURI = process.env.DB_URL;

    if (!mongoURI) {
      throw new Error("DB_URL is not defined in environment variables");
    }

    const conn = await mongoose.connect(mongoURI, {
      // Modern Mongo options (safe for production)
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log("================================");
    console.log("🗄️ MongoDB Connected Successfully");
    console.log("================================");
    console.log(`📡 Host: ${conn.connection.host}`);
    console.log(`📦 DB: ${conn.connection.name}`);
    console.log("================================");

    return conn;
  } catch (error) {
    console.error("❌ MongoDB Connection Failed");
    console.error(error.message);

    // Stop app if DB fails (critical SaaS rule)
    process.exit(1);
  }
};

/**
 * ==================================================
 * HANDLE CONNECTION EVENTS
 * ==================================================
 */
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected");
});

mongoose.connection.on("reconnected", () => {
  console.log("🔄 MongoDB reconnected");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB runtime error:", err);
});

export default connectDB;
