import mongoose from "mongoose";

/* =========================
   🏆 CERTIFICATE MODEL (PRODUCTION GRADE)
   - secure verification
   - scalable metadata
   - anti-fake system ready
   - audit + analytics ready
========================= */

const certificateSchema = new mongoose.Schema({

  /* =========================
     🔐 UNIQUE CERTIFICATE ID
  ========================= */
  certificateId: {
    type: String,
    unique: true,
    index: true,
    required: true,
    trim: true
  },

  /* =========================
     👤 USER LINK
  ========================= */
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  /* =========================
     📚 COURSE DATA
  ========================= */
  courseTitle: {
    type: String,
    required: true,
    trim: true
  },

  level: {
    type: String,
    enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
    default: "BEGINNER"
  },

  score: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },

  durationHours: {
    type: Number,
    default: 0
  },

  /* =========================
     🔐 SECURITY (ANTI FAKE)
  ========================= */
  verifyHash: {
    type: String,
    required: true,
    index: true
  },

  status: {
    type: String,
    enum: ["VALID", "REVOKED", "EXPIRED"],
    default: "VALID",
    index: true
  },

  /* =========================
     🌍 VISUAL + BRANDING
  ========================= */
  theme: {
    type: String,
    default: "AFRICAN_GOLD"
  },

  issuer: {
    type: String,
    default: "UniMentorAI Global Academy"
  },

  /* =========================
     📅 ISSUANCE INFO
  ========================= */
  issuedAt: {
    type: Date,
    default: Date.now,
    index: true
  },

  expiresAt: {
    type: Date,
    default: null
  }

}, {

  timestamps: true

});

/* =========================
   🚀 INDEX OPTIMIZATION (FAST QUERY)
========================= */
certificate({ userId: 1, createdAt: -1 });
certificate({ certificateId: 1 });
certificate({ verifyHash: 1 });

export default mongoose.model("Certificate", certificateSchema);
