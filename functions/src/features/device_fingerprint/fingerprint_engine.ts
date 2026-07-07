import * as admin from "firebase-admin";
import { DeviceProfiler } from "./device_profiler";

const db = admin.firestore();

export class FingerprintEngine {

  static async process(deviceData: any, userId?: string) {

    // 🧠 ANALYZE DEVICE
    const result = DeviceProfiler.analyze(deviceData);

    // 💾 STORE DEVICE PROFILE
    await db.collection("device_fingerprints").add({
      userId,
      ...result,
      createdAt: Date.now(),
      raw: deviceData,
    });

    return result;
  }
}