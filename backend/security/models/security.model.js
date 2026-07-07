import mongoose from "mongoose";

const securitySchema = new mongoose.Schema(
  {
    /**
     * USER / IP / SYSTEM
     */
    entityType: {
      type: String,
      enum: ["USER", "IP", "SYSTEM"],
      required: true,
      index: true,
    },

    /**
     * User ID ou adresse IP
     */
    entityId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },

    /**
     * Score 0-100
     */
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 0,
    },

    /**
     * Niveau de risque
     */
    level: {
      type: String,
      enum: [
        "LOW",
        "MEDIUM",
        "HIGH",
        "CRITICAL",
      ],
      required: true,
      index: true,
    },

    /**
     * Type d'incident
     */
    incidentType: {
      type: String,
      enum: [
        "FAILED_ACTIVITY_SPIKE",
        "SUSPICIOUS_BEHAVIOR",
        "RISK_DETECTED",
        "CRITICAL_RISK",
        "MULTIPLE_REVOKES",
        "IP_ABUSE",
        "SYSTEM_ALERT",
      ],
      required: true,
      index: true,
    },

    /**
     * Description lisible
     */
    message: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    /**
     * Données d'analyse
     */
    metrics: {
      totalEvents: {
        type: Number,
        default: 0,
      },

      failedEvents: {
        type: Number,
        default: 0,
      },

      recentEvents: {
        type: Number,
        default: 0,
      },

      failureRatio: {
        type: Number,
        default: 0,
      },
    },

    /**
     * État de traitement
     */
    status: {
      type: String,
      enum: [
        "OPEN",
        "INVESTIGATING",
        "RESOLVED",
        "IGNORED",
      ],
      default: "OPEN",
      index: true,
    },

    /**
     * Blocage automatique
     */
    autoBlocked: {
      type: Boolean,
      default: false,
      index: true,
    },

    /**
     * Admin responsable
     */
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    /**
     * Résolution
     */
    resolvedAt: {
      type: Date,
      default: null,
    },

    /**
     * Notes internes
     */
    notes: [
      {
        content: String,

        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/**
 * ==========================
 * INDEXES
 * ==========================
 */

security({
  entityType: 1,
  entityId: 1,
});

security({
  level: 1,
  createdAt: -1,
});

security({
  incidentType: 1,
  createdAt: -1,
});

security({
  status: 1,
  createdAt: -1,
});

security({
  autoBlocked: 1,
});

const SecurityIncident = mongoose.model(
  "SecurityIncident",
  securitySchema
);

export default SecurityIncident;
