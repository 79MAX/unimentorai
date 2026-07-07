import mongoose from "mongoose";

// =========================
// 💰 USER USAGE MODEL
// UniMentorAI - AI Billing & Metering System
// =========================

const userUsageSchema = new mongoose.Schema(
  {
    // =========================
    // 👤 USER REFERENCE
    // =========================
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      index: true
    },

    // =========================
    // 💳 SUBSCRIPTION PLAN
    // =========================
    plan: {
      type: String,
      enum: ["FREE", "PRO", "PREMIUM"],
      default: "FREE",
      index: true
    },

    // =========================
    // 📊 USAGE METRICS
    // =========================
    usage: {
      messages: { type: Number, default: 0 },
      tokens: { type: Number, default: 0 },
      aiRequests: { type: Number, default: 0 },

      // 💰 estimated cost (future billing)
      estimatedCost: { type: Number, default: 0 }
    },

    // =========================
    // 🚦 LIMITS (PER PLAN)
    // =========================
    limits: {
      messages: {
        FREE: 50,
        PRO: 1000,
        PREMIUM: -1 // unlimited
      },
      tokens: {
        FREE: 10000,
        PRO: 500000,
        PREMIUM: -1
      }
    },

    // =========================
    // 🔄 RESET SYSTEM
    // =========================
    billingCycle: {
      type: String,
      default: "monthly" // future: weekly / yearly
    },

    lastReset: {
      type: Date,
      default: Date.now
    },

    nextReset: {
      type: Date,
      default: null
    },

    // =========================
    // 📡 TRACKING META
    // =========================
    metadata: {
      lastActivity: Date,
      lastAIModel: String,
      region: String
    }
  },
  {
    timestamps: true
  }
);

// =========================
// ⚡ INDEXES (PERFORMANCE)
// =========================
userUsage({ userId: 1, plan: 1 });
userUsage({ "metadata.lastActivity": -1 });

// =========================
// 🧠 PLAN LIMIT CHECK HELPERS
// =========================
userUsageSchema.methods.hasReachedLimit = function () {
  const limit = this.limits.messages[this.plan];

  if (limit === -1) return false;

  return this.usage.messages >= limit;
};

// =========================
// 📊 INCREMENT USAGE
// =========================
userUsageSchema.methods.incrementUsage = function ({
  messages = 0,
  tokens = 0,
  cost = 0
}) {
  this.usage.messages += messages;
  this.usage.tokens += tokens;
  this.usage.aiRequests += 1;
  this.usage.estimatedCost += cost;

  this.metadata.lastActivity = new Date();

  return this;
};

// =========================
// 🔄 RESET CYCLE (CRON READY)
// =========================
userUsageSchema.methods.resetUsage = function () {
  this.usage.messages = 0;
  this.usage.tokens = 0;
  this.usage.aiRequests = 0;
  this.usage.estimatedCost = 0;

  this.lastReset = new Date();

  return this;
};

// =========================
// 🧠 MODEL EXPORT
// =========================
const UserUsage = mongoose.model("UserUsage", userUsageSchema);

export default UserUsage;
