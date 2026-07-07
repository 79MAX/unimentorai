import mongoose from "mongoose";

// =========================
// 📊 USAGE TRACKING
// =========================
const UsageSchema = new mongoose.Schema(
  {
    messagesUsed: { type: Number, default: 0 },
    tokensUsed: { type: Number, default: 0 },
    aiRequests: { type: Number, default: 0 },
    lastReset: { type: Date, default: Date.now }
  },
  { _id: false }
);

// =========================
// 💳 PAYMENT INFO
// =========================
const PaymentSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      enum: ["FREE", "STRIPE", "PAYPAL", "MTN", "ORANGE", "MOOV"],
      default: "FREE"
    },

    stripeCustomerId: {
      type: String,
      default: null
    },

    stripeSubscriptionId: {
      type: String,
      default: null
    }
  },
  { _id: false }
);

// =========================
// 👤 MAIN SUBSCRIPTION SCHEMA
// =========================
const SubscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true
    },

    plan: {
      type: String,
      enum: ["FREE", "BASIC", "PRO", "PREMIUM"],
      default: "FREE",
      index: true
    },

    status: {
      type: String,
      enum: ["ACTIVE", "TRIAL", "PAST_DUE", "CANCELED", "EXPIRED"],
      default: "ACTIVE",
      index: true
    },

    startDate: {
      type: Date,
      default: Date.now
    },

    endDate: {
      type: Date,
      default: null
    },

    renewalDate: {
      type: Date,
      default: null
    },

    autoRenew: {
      type: Boolean,
      default: true
    },

    usage: {
      type: UsageSchema,
      default: () => ({})
    },

    payment: {
      type: PaymentSchema,
      default: () => ({})
    }
  },
  {
    timestamps: true
  }
);

// =========================
// ⚡ INDEXES (SAAS PERFORMANCE)
// =========================
Subscription({ userId: 1 });
Subscription({ plan: 1 });
Subscription({ status: 1 });

// =========================
// 🧠 BUSINESS LOGIC HELPERS
// =========================

// Check if subscription is active
SubscriptionSchema.methods.isActive = function () {
  return this.status === "ACTIVE";
};

// Check if expired
SubscriptionSchema.methods.isExpired = function () {
  if (!this.endDate) return false;
  return new Date() > this.endDate;
};

// Reset usage (billing cycle reset)
SubscriptionSchema.methods.resetUsage = function () {
  this.usage.messagesUsed = 0;
  this.usage.tokensUsed = 0;
  this.usage.aiRequests = 0;
  this.usage.lastReset = new Date();
};

// Increase usage safely
SubscriptionSchema.methods.addUsage = function (type = "messages", amount = 1) {
  if (type === "messages") this.usage.messagesUsed += amount;
  if (type === "tokens") this.usage.tokensUsed += amount;
  if (type === "ai") this.usage.aiRequests += amount;
};

// Check quota
SubscriptionSchema.methods.hasQuota = function (limit) {
  if (!limit) return true;
  return this.usage.messagesUsed < limit;
};

// =========================
// 🚀 MODEL EXPORT
// =========================
const SubscriptionModel = mongoose.model(
  "Subscription",
  SubscriptionSchema
);

export default SubscriptionModel;
