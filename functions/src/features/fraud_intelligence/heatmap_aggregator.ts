import * as admin from "firebase-admin";
import { FraudClustering } from "./fraud_clustering";

const db = admin.firestore();

export class HeatmapAggregator {

  static async build() {

    const snapshot = await db
      .collection("verification_logs")
      .orderBy("createdAt", "desc")
      .limit(500)
      .get();

    const logs = snapshot.docs.map(d => d.data());

    const clusters = FraudClustering.cluster(logs);

    const heatmapData = Object.keys(clusters).map(country => ({
      country,
      fraudCount: clusters[country],
    }));

    return heatmapData;
  }
}