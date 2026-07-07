import * as admin from "firebase-admin";
import { SecurityAction } from "./response_types";

const db = admin.firestore();

export class ResponseActions {

  static async banUser(userId: string, reason: string) {

    await db.collection("banned_users").doc(userId).set({
      reason,
      bannedAt: Date.now(),
      active: true,
    });

    console.log(`🚫 USER BANNED: ${userId}`);
  }

  static async flagDevice(deviceId: string, reason: string) {

    await db.collection("flagged_devices").add({
      deviceId,
      reason,
      flaggedAt: Date.now(),
    });

    console.log(`📱 DEVICE FLAGGED: ${deviceId}`);
  }

  static async rateLimit(userId: string) {

    await db.collection("rate_limits").doc(userId).set({
      limit: true,
      timestamp: Date.now(),
    });

    console.log(`⏳ RATE LIMITED: ${userId}`);
  }

  static async logAction(action: SecurityAction) {

    await db.collection("security_actions").add({
      ...action,
      createdAt: Date.now(),
    });
  }
}