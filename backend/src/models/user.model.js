import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    // =========================
    // IDENTITÉ
    // =========================
    firstName: {
      type: String,
      trim: true,
      maxlength: 100,
      required: true,
    },

    lastName: {
      type: String,
      trim: true,
      maxlength: 100,
      required: true,
    },

    fullName: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    avatar: {
      type: String,
      default: null,
    },

    phone: {
      type: String,
      default: null,
    },

    country: {
      type: String,
      default: "Benin",
    },

    language: {
      type: String,
      default: "fr",
    },

    // =========================
    // AUTH & SECURITY
    // =========================
    role: {
      type: String,
      enum: [
        "student",
        "mentor",
        "teacher",
        "admin",
        "super_admin",
      ],
      default: "student",
      index: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    refreshToken: {
      type: String,
      default: null,
      select: false,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },

    loginAttempts: {
      type: Number,
      default: 0,
    },

    lockUntil: {
      type: Date,
      default: null,
    },

    // =========================
    // FORMATION
    // =========================
    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],

    completedCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],

    certificates: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Certificate",
      },
    ],

    // =========================
    // MENTORAT
    // =========================
    mentorProfile: {
      enabled: {
        type: Boolean,
        default: false,
      },

      expertise: [String],

      rating: {
        type: Number,
        default: 0,
      },

      sessionsCount: {
        type: Number,
        default: 0,
      },
    },

    // =========================
    // ABONNEMENT
    // =========================
    subscription: {
      plan: {
        type: String,
        enum: ["free", "premium", "enterprise"],
        default: "free",
      },

      expiresAt: {
        type: Date,
        default: null,
      },
    },

    // =========================
    // IA PERSONNALISÉE
    // =========================
    aiProfile: {
      level: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
        default: "beginner",
      },

      learningScore: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// =========================
// AUTO FULL NAME
// =========================
userSchema.pre("save", function (next) {
  this.fullName = `${this.firstName} ${this.lastName}`.trim();
  next();
});

// =========================
// HASH PASSWORD
// =========================
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// =========================
// PASSWORD CHECK
// =========================
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// =========================
// ACCOUNT LOCK CHECK
// =========================
userSchema.methods.isLocked = function () {
  return this.lockUntil && this.lockUntil > Date.now();
};

// =========================
// INDEXES
// =========================
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });

const User = mongoose.model("User", userSchema);

export default User;
