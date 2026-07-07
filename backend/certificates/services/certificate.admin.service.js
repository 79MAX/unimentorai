import { certificateDB } from "./certificate.db.service.js";

/**
 * ADMIN CERTIFICATE SERVICE V2
 * - business logic layer for admin operations
 * - keeps routes clean
 * - scalable SaaS admin core
 */

export const certificateAdminService = {
  /**
   * 📊 DASHBOARD STATS
   */
  async getStats() {
    const total = await certificateDB.countAll();

    const valid = await certificateDB.findByStatus("VALID");
    const revoked = await certificateDB.findByStatus("REVOKED");
    const expired = await certificateDB.findByStatus("EXPIRED");

    return {
      total,
      valid: valid.length,
      revoked: revoked.length,
      expired: expired.length,
    };
  },

  /**
   * 🔍 SEARCH CERTIFICATES (ADVANCED FILTERS)
   */
  async searchCertificates(filters = {}) {
    const query = {};

    if (filters.userId) query.userId = filters.userId;
    if (filters.courseId) query.courseId = filters.courseId;
    if (filters.status) query.status = filters.status;
    if (filters.certificateId) query.certificateId = filters.certificateId;

    return await certificateDB.search(query);
  },

  /**
   * 🚫 REVOKE CERTIFICATE
   */
  async revokeCertificate(certificateId) {
    if (!certificateId) {
      throw new Error("CERTIFICATE_ID_REQUIRED");
    }

    return await certificateDB.revoke(certificateId);
  },

  /**
   * 👤 GET USER CERTIFICATES (ADMIN VIEW)
   */
  async getUserCertificates(userId) {
    if (!userId) {
      throw new Error("USER_ID_REQUIRED");
    }

    return await certificateDB.findByUser(userId);
  },

  /**
   * 📚 GET COURSE CERTIFICATES (ADMIN VIEW)
   */
  async getCourseCertificates(courseId) {
    if (!courseId) {
      throw new Error("COURSE_ID_REQUIRED");
    }

    return await certificateDB.findByCourse(courseId);
  },

  /**
   * 📦 EXPORT DATA (future analytics / CSV)
   */
  async exportCertificates(filters = {}) {
    const data = await this.searchCertificates(filters);

    return {
      count: data.length,
      exportedAt: new Date(),
      data,
    };
  },
};
