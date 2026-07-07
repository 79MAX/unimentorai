import mongoose from "mongoose";

/* =========================
   🧠 MEMORY NODE (VECTOR + RAG + AI CONTEXT ENGINE)
   Optimisé pour: Semantic Search + Long-term AI Memory + Personalization
========================= */

const memorySchema = new mongoose.Schema({

  /* =========================
     👤 USER LINK
  ========================= */
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    index: true,
    required: true
  },

  /* =========================
     🧠 CORE MEMORY CONTENT
  ========================= */
  content: {
    type: String,
    required: true,
    trim: true,
    index: true
  },

  /* =========================
     🔢 VECTOR EMBEDDING (AI BRAIN)
  ========================= */
  embedding: {
    type: [Number],
    default: [],
    index: false // vector search handled manually (cosine similarity)
  },

  /* =========================
     📊 IMPORTANCE ENGINE
     (what AI should remember first)
  ========================= */
  importanceScore: {
    type: Number,
    default: 1,
    index: true
  },

  /* =========================
     🏷️ INTELLIGENT METADATA
  ========================= */
  metadata: {

    topic: {
      type: String,
      index: true
    },

    level: {
      type: String,
      enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
      default: "BEGINNER"
    },

    sessionId: {
      type: String,
      index: true
    },

    source: {
      type: String,
      enum: ["user", "ai", "auto-extraction", "system"],
      default: "user"
    }

  },

  /* =========================
     🧠 MEMORY STATE (LIFECYCLE)
  ========================= */
  state: {
    type: String,
    enum: ["active", "compressed", "archived", "deleted"],
    default: "active",
    index: true
  },

  /* =========================
     🧠 USAGE TRACKING (SMART RANKING)
  ========================= */
  usageCount: {
    type: Number,
    default: 0
  },

  lastAccessedAt: {
    type: Date,
    default: Date.now
  }

}, {

  timestamps: true,

  /* =========================
     ⚡ PERFORMANCE BOOST
  ========================= */
  minimize: false
});

/* =========================
   🚀 INDEXES (CRITICAL FOR SCALE)
========================= */
memory({ userId: 1, importanceScore: -1 });
memory({ userId: 1, createdAt: -1 });
memory({ userId: 1, "metadata.topic": 1 });

/* =========================
   🧠 AUTO UPDATE HOOK (SMART MEMORY EVOLUTION)
========================= */
memorySchema.pre("save", function (next) {

  // boost importance if frequently accessed
  if (this.usageCount > 5) {
    this.importanceScore += 1;
  }

  next();
});

/* =========================
   📦 EXPORT MODEL
========================= */
export default mongoose.model("Memory", memorySchema);
