
const mongoose = require("mongoose");

/**
 * ========================
 * 📚 COURSE MODEL - UniMentorAI
 * ========================
 * Core learning structure for AI-driven education platform
 */

const lessonSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  content: {
    type: String,
    required: true
  },

  videoUrl: {
    type: String
  },

  duration: {
    type: Number, // in minutes
    default: 5
  },

  order: {
    type: Number,
    default: 0
  }
});

const moduleSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  lessons: [lessonSchema]
});

const courseSchema = new mongoose.Schema(
  {

    // ========================
    // 📘 BASIC INFO
    // ========================
    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    language: {
      type: String,
      default: "fr"
    },

    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner"
    },

    category: {
      type: String,
      required: true
    },

    // ========================
    // 🧠 COURSE STRUCTURE
    // ========================
    modules: [moduleSchema],

    // ========================
    // 👤 CREATOR / MENTOR
    // ========================
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    // ========================
    // 📊 COURSE METRICS
    // ========================
    studentsEnrolled: {
      type: Number,
      default: 0
    },

    rating: {
      type: Number,
      default: 0
    },

    totalLessons: {
      type: Number,
      default: 0
    },

    // ========================
    // 💰 MONETIZATION
    // ========================
    price: {
      type: Number,
      default: 0
    },

    isPremium: {
      type: Boolean,
      default: false
    },

    // ========================
    // 🧠 AI OPTIMIZATION
    // ========================
    aiTags: [
      {
        type: String
      }
    ],

    difficultyScore: {
      type: Number,
      default: 1
    }

  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Course", courseSchema);
