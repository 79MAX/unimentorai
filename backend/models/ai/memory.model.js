import mongoose from "mongoose";

// =========================
// 🧠 MESSAGE HISTORY SCHEMA
// =========================
const MessageSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    response: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  },
  { _id: false }
);

// =========================
// 🧠 PROFILE SCHEMA
// =========================
const ProfileSchema = new mongoose.Schema(
  {
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "unknown"],
      default: "unknown"
    },
    topics: { type: [String], default: [] },
    lastActive: { type: Date, default: Date.now }
  },
  { _id: false }
);

// =========================
// 🧠 MAIN MEMORY SCHEMA
// =========================
const MemorySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true
    },

    history: {
      type: [MessageSchema],
      default: []
    },

    profile: {
      type: ProfileSchema,
      default: () => ({})
    }
  },
  {
    timestamps: true
  }
);

// =========================
// ⚡ INDEXES (PERFORMANCE)
// =========================
Memory({ userId: 1 });

// =========================
// 🧠 SAFE LIMITS (ANTI BLOAT)
// =========================
MemorySchema.pre("save", function (next) {
  if (this.history.length > 50) {
    this.history = this.history.slice(-50);
  }

  next();
});

const MemoryModel = mongoose.model("Memory", MemorySchema);

export default MemoryModel;
