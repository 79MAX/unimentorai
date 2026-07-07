import mongoose from "mongoose";
import dotenv from "dotenv";
import { AuditLog } from "../models/certificate.audit.model.js";

dotenv.config();

/**
 * 🌱 SEED AUDIT LOGS (DEV ONLY)
 */
const seedAuditLogs = async () => {
  try {
    console.log("🌱 Seeding audit logs...");

    await mongoose.connect(process.env.MONGO_URI);

    /**
     * ⚠️ CLEAN OLD DATA (OPTIONAL)
     */
    await AuditLog.deleteMany({});

    const actions = [
      "CERTIFICATE_GENERATED",
      "CERTIFICATE_REVOKED",
      "CERTIFICATE_VERIFIED",
      "CERTIFICATES_EXPORTED",
      "ADMIN_LOGIN",
    ];

    const statuses = ["SUCCESS", "FAILED"];

    const sampleUsers = [
      "user_001",
      "user_002",
      "admin_001",
      "superadmin_001",
    ];

    const sampleTargets = [
      "cert_1001",
      "cert_1002",
      "course_501",
      "course_502",
      null,
    ];

    const logs = [];

    /**
     * 🔁 GENERATE MOCK DATA
     */
    for (let i = 0; i < 50; i++) {
      logs.push({
        action: actions[Math.floor(Math.random() * actions.length)],
        userId: sampleUsers[Math.floor(Math.random() * sampleUsers.length)],
        targetId:
          sampleTargets[Math.floor(Math.random() * sampleTargets.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        metadata: {
          seed: true,
          index: i,
        },
        ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent: "Seed-Agent/1.0",
      });
    }

    await AuditLog.insertMany(logs);

    console.log(`✅ Seed completed: ${logs.length} logs inserted`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
    process.exit(1);
  }
};

seedAuditLogs();
