import mongoose from "mongoose";

/* =========================
   🔐 ENV CONFIG (SAFE)
========================= */
const MONGO_URL =
  process.env.MONGO_URL ||
  "mongodb://localhost:27017/unimentorai";

/* =========================
   🚀 DATABASE CONNECTION (ROBUST)
========================= */
export async function connectDB() {

  try {

    await mongoose.connect(MONGO_URL, {
      autoIndex: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000
    });

    console.log("🚀 MongoDB CONNECTED SUCCESSFULLY");

  } catch (error) {

    console.error("❌ MongoDB CONNECTION ERROR:", error.message);

    process.exit(1);
  }
}

/* =========================
   🧠 GLOBAL SCHEMA OPTIONS
========================= */
const schemaOptions = {
  timestamps: true,
  versionKey: false
};

/* =========================
   👤 USER MODEL (SAAS CORE)
========================= */
const userSchema = new mongoose.Schema({

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },

  role: {
    type: String,
    enum: ["student", "mentor", "company", "admin"],
    default: "student"
  },

  plan: {
    type: String,
    enum: ["FREE", "PRO"],
    default: "FREE"
  },

  passwordHash: {
    type: String,
    required: false
  }

}, schemaOptions);

/* =========================
   💰 PAYMENT MODEL
========================= */
const paymentSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    index: true
  },

  provider: {
    type: String,
    enum: ["STRIPE", "KKIAPAY", "FLUTTERWAVE"],
    required: true
  },

  amount: {
    type: Number,
    required: true,
    min: 0
  },

  currency: {
    type: String,
    default: "USD"
  },

  status: {
    type: String,
    enum: ["PENDING", "SUCCESS", "FAILED"],
    default: "PENDING",
    index: true
  }

}, schemaOptions);

/* =========================
   🎓 COURSE MODEL (LMS CORE)
========================= */
const courseSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true,
    trim: true
  },

  level: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    default: "beginner"
  },

  content: {
    type: String,
    required: true
  },

  quizzes: {
    type: Array,
    default: []
  }

}, schemaOptions);

/* =========================
   🤝 SESSION MODEL (MENTORING CORE)
========================= */
const sessionSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    index: true
  },

  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    index: true
  },

  type: {
    type: String,
    enum: ["mentoring", "class", "support"],
    default: "mentoring"
  },

  status: {
    type: String,
    enum: ["ACTIVE", "ENDED"],
    default: "ACTIVE"
  }

}, schemaOptions);

/* =========================
   🎥 WEBINAR MODEL (LIVE SYSTEM)
========================= */
const webinarSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  host: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    required: true,
    index: true
  },

  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],

  status: {
    type: String,
    enum: ["SCHEDULED", "LIVE", "ENDED"],
    default: "SCHEDULED",
    index: true
  }

}, schemaOptions);

/* =========================
   📦 EXPORT MODELS (SAFE INIT)
========================= */
export const User =
  mongoose.models.User || mongoose.model("User", userSchema);

export const Payment =
  mongoose.models.Payment || mongoose.model("Payment", paymentSchema);

export const Course =
  mongoose.models.Course || mongoose.model("Course", courseSchema);

export const Session =
  mongoose.models.Session || mongoose.model("Session", sessionSchema);

export const Webinar =
  mongoose.models.Webinar || mongoose.model("Webinar", webinarSchema);

