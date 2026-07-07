import mongoose from "mongoose";

// =========================
// 📊 SESSION SCHEMA
// =========================
const SessionSchema = new mongoose.Schema(
  {
    startedAt: { type: Date, default: Date.now },
    duration: { type: Number, default: 0 }, // en ms

    messagesCount: { type: Number, default: 0 },

    score: { type: Number, default: 50 },

    success: { type: Boolean, default: true }
  },
  { _id: false }
);

// =========================
// 📈 LEARNING METRICS
// =========================
const LearningSchema = new mongoose.Schema(
  {
    topic: { type: String, default: "general" },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "intermediate"
    },

    improvementRate: { type: Number, default: 0 }
  },
  { _id: false }
);

// =========================
// 🧠 MAIN ANALYTICS SCHEMA
// =========================
const AnalyticsSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true
    },

    session: {
      type: SessionSchema,
      default: () => ({})
    },

    learning: {
      type: LearningSchema,
      default: () => ({})
    },

    engagementScore: {
      type: Number,
      default: 50
    },

    interactionCount: {
      type: Number,
      default: 0
    },

    lastActive: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// =========================
// ⚡ INDEXES (PERFORMANCE)
// =========================
Analytics({ userId: 1 });
Analytics({ lastActive: -1 });

// =========================
// 🧠 AUTO UPDATE HOOK
// =========================
AnalyticsSchema.pre("save", function (next) {
  this.lastActive = new Date();

  // engagement recalculation simple
  if (this.interactionCount > 100) {
    this.engagementScore = 80;
  } else if (this.interactionCount > 50) {
    this.engagementScore = 60;
  } else {
    this.engagementScore = 40;
  }

  next();
});

const AnalyticsModel = mongoose.model("Analytics", AnalyticsSchema);

export default AnalyticsModel;
