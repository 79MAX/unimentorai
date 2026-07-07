import { Certificate } from "../models/certificate.model.js";

/**
 * CERTIFICATE DB SERVICE V2
 * - single source of truth for database access
 * - scalable SaaS architecture
 * - anti-fake registry support
 */

export const certificateDB = {
  /**
   * 💾 CREATE CERTIFICATE
   */
  async create(data) {
    const certificate = await Certificate.create(data);
    return certificate;
  },

  /**
   * 🔍 FIND BY HASH (PRIMARY VERIFY METHOD)
   */
  async findByHash(hash) {
    return await Certificate.findOne({ hash });
  },

  /**
   * 🔍 FIND BY CERTIFICATE ID
   */
  async findById(certificateId) {
    return await Certificate.findOne({ certificateId });
  },

  /**
   * 👤 GET ALL USER CERTIFICATES
   */
  async findByUser(userId) {
    return await Certificate.find({ userId }).sort({ createdAt: -1 });
  },

  /**
   * 📚 GET ALL COURSE CERTIFICATES
   */
  async findByCourse(courseId) {
    return await Certificate.find({ courseId }).sort({ createdAt: -1 });
  },

  /**
   * 🚫 REVOKE CERTIFICATE (ANTI-FAKE CONTROL)
   */
  async revoke(certificateId) {
    return await Certificate.updateOne(
      { certificateId },
      {
        $set: {
          status: "REVOKED",
          revokedAt: new Date(),
        },
      }
    );
  },

  /**
   * 📊 COUNT TOTAL CERTIFICATES
   */
  async countAll() {
    return await Certificate.countDocuments();
  },

  /**
   * 📊 COUNT USER CERTIFICATES
   */
  async countByUser(userId) {
    return await Certificate.countDocuments({ userId });
  },

  /**
   * 🔐 VERIFY DIRECTLY FROM DB (FAST CHECK)
   */
  async verifyHash(hash) {
    const cert = await Certificate.findOne({ hash });

    if (!cert) {
      return {
        valid: false,
        reason: "CERTIFICATE_NOT_FOUND",
      };
    }

    return {
      valid: cert.status === "VALID",
      certificate: cert,
    };
  },
};
