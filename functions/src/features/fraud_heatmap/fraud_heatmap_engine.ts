import * as admin from "firebase-admin";
import { GeoResolver } from "./geo_resolver";
import { HeatmapAggregator } from "./heatmap_aggregator";

const db = admin.firestore();

export class FraudHeatmapEngine {

  static async buildHeatmap() {

    // 📡 GET SECURITY EVENTS
    const snapshot = await db
      .collection("security_events")
      .orderBy("createdAt", "desc")
      .limit(200)
      .get();

    const events = snapshot.docs.map(doc => {
      const data = doc.data();

      // 🌍 ENRICH WITH GEO
      const geo = GeoResolver.resolve(data.ip);

      return {
        ...data,
        geo,
      };
    });

    // 📊 AGGREGATE
    const points = HeatmapAggregator.aggregate(events);

    // 💾 STORE GLOBAL HEATMAP
    const heatmap = {
      updatedAt: Date.now(),
      points,
    };

    await db.collection("fraud_heatmap").doc("global").set(heatmap);

    return heatmap;
  }
}