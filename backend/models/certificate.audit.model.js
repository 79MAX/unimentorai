import mongoose from "mongoose";

/**
 * 🔐 AUDIT LOG MODEL V2 (PRODUCTION GRADE)
 */
const auditSchema = new mongoose.Schema(
  {
    /**
     * 📌 ACTION TYPE
     */
    action: {
      type: String,
      required: true,
      index: true,
      enum: [
        "CERTIFICATE_GENERATED",
        "CERTIFICATE_REVOKED",
        "CERTIFICATE_VERIFIED",
        "CERTIFICATES_EXPORTED",
        "ADMIN_LOGIN",
        "ADMIN_LOGOUT",
      ],
    },

    /**
     * 👤 ACTOR (ADMIN / USER)
     */
    userId: {
      type: String,
      required: true,
      index: true,
    },

    /**
     * 🎯 TARGET (certificate, course, etc.)
     */
    targetId: {
      type: String,
      default: null,
      index: true,
    },

    /**
     * 📦 CONTEXT DATA
     * → reason, payload changes, etc.
     */
    metadata: {
      type: Object,
      default: {},
    },

    /**
     * 🌐 NETWORK INFO
     */
    ip: {
      type: String,
      default: null,
    },

    userAgent: {
      type: String,
      default: null,
    },

    /**
     * 🔐 RESULT STATUS
     */
    status: {
      type: String,
      enum: ["SUCCESS", "FAILED"],
      default: "SUCCESS",
      index: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

/**
 * ⚡ PERFORMANCE INDEXES
 */
audit({ createdAt: -1 });
audit({ action: 1, createdAt: -1 });

export const AuditLog = mongoose.model("AuditLog", auditSchema);
