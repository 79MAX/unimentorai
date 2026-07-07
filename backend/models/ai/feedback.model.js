import mongoose from "mongoose";

// =========================
// 🧠 FEEDBACK DETAIL SCHEMA
// =========================
const FeedbackDetailSchema = new mongoose.Schema(
  {
    helpful: { type: Boolean, default: true },

    rating: {
      type: Number,
      min: 0,
      max: 100,
      default: 50
    },

    comment: { type: String, default: "" },

    category: {
      type: String,
      enum: [
        "accuracy",
        "clarity",
        "difficulty",
        "engagement",
        "relevance"
      ],
      default: "clarity"
    }
  },
  { _id: false }
);

// =========================
// 🧠 MAIN FEEDBACK SCHEMA
// =========================
const FeedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true
    },

    message: {
      type: String,
      required: true
    },

    response: {
      type: String,
      required: true
    },

    feedback: {
      type: FeedbackDetailSchema,
      default: () => ({})
    },

    score: {
      type: Number,
      default: 50
    },

    improvementFlag: {
      type: Boolean,
      default: false
    },

    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// =========================
// ⚡ INDEXES (PERFORMANCE)
// =========================
Feedback({ userId: 1, createdAt: -1 });
Feedback({ score: -1 });

// =========================
// 🧠 AUTO SCORE ENGINE
// =========================
FeedbackSchema.pre("save", function (next) {
  // recalcul automatique du score si feedback donné
  let score = 50;

  if (this.feedback?.helpful) score += 20;
  else score -= 20;

  if (this.feedback?.rating) {
    score = (score + this.feedback.rating) / 2;
  }

  if (this.response?.length > 300) score += 10;
  if (this.response?.length < 50) score -= 10;

  this.score = Math.max(0, Math.min(100, score));

  this.improvementFlag = this.score < 40;

  next();
});

const FeedbackModel = mongoose.model("Feedback", FeedbackSchema);

export default FeedbackModel;
