import mongoose from "mongoose";

// =========================
// 🌍 USER LANGUAGE MODEL
// UniMentorAI - Multilingual Profile System
// =========================

const userLanguageSchema = new mongoose.Schema(
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
    // 🌍 PRIMARY LANGUAGE
    // =========================
    language: {
      type: String,
      default: "en",
      index: true
    },

    // =========================
    // 🌍 SECONDARY LANGUAGE (OPTIONAL)
    // =========================
    secondaryLanguage: {
      type: String,
      default: null
    },

    // =========================
    // 📊 LANGUAGE HISTORY (LEARNING AI)
    // =========================
    history: [
      {
        language: String,
        usedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

    // =========================
    // 🌍 REGION (FOR AFRICA-FIRST STRATEGY)
    // =========================
    region: {
      type: String,
      default: "unknown",
      index: true
    },

    // =========================
    // ⚙️ USER PREFERENCES
    // =========================
    autoTranslate: {
      type: Boolean,
      default: true
    },

    preferredResponseStyle: {
      type: String,
      enum: ["simple", "detailed", "educational"],
      default: "simple"
    }
  },
  {
    timestamps: true
  }
);

// =========================
// 📊 INDEXES (PERFORMANCE)
// =========================
userLanguage({ userId: 1, language: 1 });
userLanguage({ region: 1 });

// =========================
// 🧠 AUTO UPDATE LANGUAGE HISTORY
// =========================
userLanguageSchema.methods.updateLanguage = function (newLanguage) {
  if (newLanguage && newLanguage !== this.language) {
    this.language = newLanguage;

    this.history.push({
      language: newLanguage,
      usedAt: new Date()
    });
  }

  return this;
};

// =========================
// 🌍 SET LANGUAGE PREFERENCE
// =========================
userLanguageSchema.methods.setLanguage = function (lang) {
  this.language = lang;

  this.history.push({
    language: lang,
    usedAt: new Date()
  });

  return this;
};

// =========================
// 🧠 EXPORT MODEL
// =========================
const UserLanguageModel = mongoose.model(
  "UserLanguage",
  userLanguageSchema
);

export default UserLanguageModel;
