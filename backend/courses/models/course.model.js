import mongoose from "mongoose";

/* =========================
   📚 COURSE MODEL (V1 PRODUCTION READY)
========================= */

const courseSchema = new mongoose.Schema(
  {

    /* =========================
       📌 CORE INFO
    ========================= */
    title: {
      type: String,
      required: true,
      trim: true,
      index: true
    },

    description: {
      type: String,
      default: "",
      trim: true
    },

    level: {
      type: String,
      enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
      default: "BEGINNER",
      index: true
    },

    category: {
      type: String,
      default: "GENERAL",
      index: true
    },

    duration: {
      type: String,
      default: "Self-paced"
    },

    /* =========================
       👥 STUDENTS ENROLLMENT
    ========================= */
    students: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true
        },

        progress: {
          type: Number,
          default: 0,
          min: 0,
          max: 100
        },

        completed: {
          type: Boolean,
          default: false
        },

        enrolledAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

    /* =========================
       ⚙️ STATUS
    ========================= */
    isPublished: {
      type: Boolean,
      default: true,
      index: true
    }

  },
  {
    timestamps: true
  }
);

/* =========================
   🚀 INDEXING (PERF V1)
========================= */
course({ title: 1, level: 1 });
course({ category: 1 });

export default mongoose.model("Course", courseSchema);
