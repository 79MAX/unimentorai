import mongoose from "mongoose";

/**
 * CERTIFICATE MODEL V2
 * - immutable record
 * - anti-fake system
 * - audit-ready SaaS structure
 */

const certificateSchema = new mongoose.Schema(
  {
    certificateId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    userId: {
      type: String,
      required: true,
      index: true,
    },

    userName: {
      type: String,
      required: true,
      trim: true,
    },

    courseId: {
      type: String,
      required: true,
      index: true,
    },

    courseName: {
      type: String,
      required: true,
      trim: true,
    },

    hash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    qrCode: {
      type: String,
      default: null,
    },

    pdfUrl: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["VALID", "REVOKED", "EXPIRED"],
      default: "VALID",
      index: true,
    },

    issuedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    metadata: {
      platform: { type: String, default: "UniMentorAI" },
      version: { type: String, default: "v2" },
      language: { type: String, default: "fr" },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/**
 * 🔐 SECURITY: prevent modification after creation
 */
certificateSchema.pre("save", function (next) {
  if (!this.isNew) {
    const err = new Error("CERTIFICATE_IS_IMMUTABLE");
    return next(err);
  }
  next();
});

export const Certificate = mongoose.model("Certificate", certificateSchema);
