console.log("❌ LEGACY USER MODEL LOADED");
const mongoose = require("mongoose");

/**
 * ========================
 * 👤 USER MODEL - UniMentorAI
 * ========================
 * Core identity system for authentication,
 * AI personalization, payments, and roles
 */

const userSchema = new mongoose.Schema(
  {

    // ========================
    // 🔐 AUTH BASIC INFO
    // ========================
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    // ========================
    // 🧠 USER ROLE SYSTEM
    // ========================
    role: {
      type: String,
      enum: ["user", "mentor", "admin"],
      default: "user"
    },

    // ========================
    // 📊 AI PERSONALIZATION
    // ========================
    aiProfile: {
      learningStyle: { type: String, default: "adaptive" },
      level: { type: String, default: "beginner" },
      interests: [{ type: String }]
    },

    // ========================
    // 💰 SUBSCRIPTION / PAYMENT
    // ========================
    subscription: {
      plan: {
        type: String,
        enum: ["free", "basic", "premium"],
        default: "free"
      },
      status: {
        type: String,
        enum: ["active", "inactive", "canceled"],
        default: "active"
      }
    },

    // ========================
    // 📈 PROGRESS SYSTEM
    // ========================
    progress: {
      coursesCompleted: { type: Number, default: 0 },
      totalXP: { type: Number, default: 0 }
    },

    // ========================
    // 🔐 SECURITY FLAGS
    // ========================
    isVerified: {
      type: Boolean,
      default: false
    },

    lastLogin: {
      type: Date
    }

  },
  {
    timestamps: true // createdAt + updatedAt
  }
);

module.exports = mongoose.model("User", userSchema);
