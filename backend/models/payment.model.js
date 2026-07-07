
const mongoose = require("mongoose");

/**
 * ========================
 * 💰 PAYMENT MODEL - UniMentorAI
 * ========================
 * Handles all transactions:
 * - Course purchases
 * - Subscriptions
 * - AI services
 */

const paymentSchema = new mongoose.Schema(
  {

    // ========================
    // 👤 USER REFERENCE
    // ========================
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // ========================
    // 📦 PAYMENT TYPE
    // ========================
    type: {
      type: String,
      enum: ["course", "subscription", "ai_service"],
      required: true
    },

    // ========================
    // 📚 RELATED COURSE (OPTIONAL)
    // ========================
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course"
    },

    // ========================
    // 💳 PAYMENT DETAILS
    // ========================
    amount: {
      type: Number,
      required: true
    },

    currency: {
      type: String,
      default: "USD"
    },

    method: {
      type: String,
      enum: ["stripe", "paypal", "mobile_money", "manual"],
      required: true
    },

    // ========================
    // 📊 PAYMENT STATUS
    // ========================
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending"
    },

    // ========================
    // 🔐 TRANSACTION IDS
    // ========================
    transactionId: {
      type: String
    },

    reference: {
      type: String,
      unique: true
    },

    // ========================
    // 💰 SUBSCRIPTION DATA
    // ========================
    subscriptionPlan: {
      type: String,
      enum: ["free", "basic", "premium"]
    },

    // ========================
    // 🧠 AI CONTEXT (future AI billing)
    // ========================
    aiUsage: {
      tokensUsed: {
        type: Number,
        default: 0
      },
      costPerToken: {
        type: Number,
        default: 0
      }
    }

  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Payment", paymentSchema);
