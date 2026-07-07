import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { secureVerificationRequest } from "../../security/api_security";

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * 🌍 FRAUD HEATMAP API (OPTIMIZED CTO VERSION)
 * - lightweight aggregation
 * - no realtime overload
 * - dashboard-friendly output
 */
export const fraudHeatmapAPI = functions.https.onRequest(
  async (req, res) => {

    // 🌍 CORS (safe for dashboard)
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      return res.status(204).send("");
    }

    // 🔐 SECURITY LAYER (reuse existing system)
    if (!secureVerificationRequest(req, res)) {
      return;
    }

    try {

      // 📊 FETCH RECENT LOGS ONLY (performance optimized)
      const snapshot = await db
        .collection("verification_logs")
        .orderBy("createdAt", "desc")
        .limit(300)
        .get();

      const logs = snapshot.docs.map(doc => doc.data());

      // 🌍 SIMPLE FRAUD CLUSTERING (NO ML OVERHEAD)
      const clusters: Record<string, number> = {};

      for (const log of logs) {

        const country = log.country || "UNKNOWN";

        if (!clusters[country]) {
          clusters[country] = 0;
        }

        if (log.status === "FRAUD") {
          clusters[country] += 1;
        }
      }

      // 📊 FORMAT FOR DASHBOARD
      const heatmap = Object.keys(clusters).map(country => {

        const fraudCount = clusters[country];

        return {
          country,
          fraudCount,
          intensity:
            fraudCount >= 20 ? "HIGH" :
            fraudCount >= 10 ? "MEDIUM" :
            "LOW",
        };
      });

      // 🚀 RESPONSE
      return res.status(200).json({
        success: true,
        data: heatmap,
        totalCountries: heatmap.length,
        timestamp: Date.now(),
      });

    } catch (error: any) {

      console.error("FRAUD_HEATMAP_ERROR:", error);

      return res.status(500).json({
        success: false,
        message: "Heatmap generation failed",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,
      });
    }
  }
);