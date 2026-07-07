import mongoose from "mongoose";

/* =========================
   🎓 UniMentorAI Certificate Model (PRODUCTION READY)
========================= */

const CertificateSchema = new mongoose.Schema(
  {
    /* =========================
       🔐 UNIQUE CERTIFICATE ID
    ========================= */
    certificateId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    /* =========================
       👤 USER DATA SNAPSHOT
    ========================= */
    user: {
      id: {
        type: String,
        required: true,
        index: true
      },
      name: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: false
      }
    },

    /* =========================
       📚 COURSE DATA SNAPSHOT
    ========================= */
    course: {
      id: {
        type: String,
        required: true,
        index: true
      },
      title: {
        type: String,
        required: true
      },
      level: {
        type: String,
        default: "standard"
      }
    },

    /* =========================
       🌍 LANGUAGE SYSTEM
    ========================= */
    language: {
      code: {
        type: String,
        default: "en"
      },
      name: {
        type: String,
        default: "English"
      },
      status: {
        type: String,
        enum: ["approved", "beta", "experimental"],
        default: "approved"
      }
    },

    /* =========================
       📊 CERTIFICATE STATUS
    ========================= */
    status: {
      type: String,
      enum: ["valid", "revoked", "suspended"],
      default: "valid",
      index: true
    },

    /* =========================
       🔗 VERIFICATION SYSTEM
    ========================= */
    verificationUrl: {
      type: String,
      required: true
    },

    qrCodeUrl: {
      type: String
    },

    /* =========================
       📅 TIMESTAMPS
    ========================= */
    issuedAt: {
      type: Date,
      default: Date.now,
      index: true
    },

    expiresAt: {
      type: Date,
      default: null
    },

    /* =========================
       🛡️ SECURITY / ANTI-FAKE
    ========================= */
    signatureHash: {
      type: String,
      required: false
    },

    issuer: {
      type: String,
      default: "UniMentorAI System"
    }
  },
  {
    timestamps: true
  }
);

/* =========================
   🚀 INDEXES (PERFORMANCE)
========================= */
Certificate({ certificateId: 1 });
Certificate({ "user.id": 1 });
Certificate({ "course.id": 1 });
Certificate({ status: 1 });
Certificate({ issuedAt: -1 });

/* =========================
   🔐 VIRTUAL (FOR QR SYSTEM)
========================= */
CertificateSchema.virtual("isValid").get(function () {
  return this.status === "valid";
});

/* =========================
   📦 EXPORT MODEL
========================= */
const Certificate = mongoose.model("Certificate", CertificateSchema);

export default Certificate;
