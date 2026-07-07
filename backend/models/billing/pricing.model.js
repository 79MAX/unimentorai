import mongoose from "mongoose";

// =========================
// 💰 FEATURE SCHEMA
// =========================
const FeatureSchema = new mongoose.Schema(
  {
    aiAccess: { type: Boolean, default: false },
    advancedMentor: { type: Boolean, default: false },
    analytics: { type: Boolean, default: false },
    certificates: { type: Boolean, default: false },
    prioritySupport: { type: Boolean, default: false },
    unlimitedMessages: { type: Boolean, default: false }
  },
  { _id: false }
);

// =========================
// ⚡ LIMITS SCHEMA
// =========================
const LimitSchema = new mongoose.Schema(
  {
    dailyMessages: { type: Number, default: 10 },
    monthlyTokens: { type: Number, default: 1000 },
    aiRequestsPerMinute: { type: Number, default: 5 }
  },
  { _id: false }
);

// =========================
// 💰 MAIN PRICING SCHEMA
// =========================
const PricingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: ["FREE", "BASIC", "PRO", "PREMIUM"],
      required: true,
      unique: true,
      index: true
    },

    displayName: {
      type: String,
      default: ""
    },

    description: {
      type: String,
      default: ""
    },

    price: {
      type: Number,
      default: 0
    },

    currency: {
      type: String,
      default: "USD"
    },

    billingCycle: {
      type: String,
      enum: ["FREE", "MONTHLY", "YEARLY"],
      default: "FREE"
    },

    stripePriceId: {
      type: String,
      default: null
    },

    features: {
      type: FeatureSchema,
      default: () => ({})
    },

    limits: {
      type: LimitSchema,
      default: () => ({})
    },

    isActive: {
      type: Boolean,
      default: true
    },

    sortOrder: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// =========================
// ⚡ INDEXES (PERF SAAS)
// =========================
Pricing({ name: 1 });
Pricing({ price: 1 });

// =========================
// 🧠 HELPERS (BUSINESS LOGIC)
// =========================

// Check if plan is premium tier
PricingSchema.methods.isPremium = function () {
  return this.name === "PRO" || this.name === "PREMIUM";
};

// Check if AI is enabled
PricingSchema.methods.hasAIAccess = function () {
  return this.features?.aiAccess === true;
};

// Get formatted price
PricingSchema.methods.getFormattedPrice = function () {
  if (this.price === 0) return "Free";
  return `${this.currency} ${this.price}`;
};

// =========================
// 🚀 MODEL EXPORT
// =========================
const PricingModel = mongoose.model("Pricing", PricingSchema);

export default PricingModel;
