import { certificateAdminService } from "../services/certificate.admin.service.js";

/**
 * CERTIFICATE ADMIN CONTROLLER V2
 * - HTTP layer only
 * - delegates all logic to service layer
 */

export const certificateAdminController = {
  /**
   * 📊 GET DASHBOARD STATS
   */
  async getStats(req, res) {
    try {
      const stats = await certificateAdminService.getStats();

      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error("[ADMIN_STATS_ERROR]", error.message);

      return res.status(500).json({
        success: false,
        message: "FAILED_TO_FETCH_STATS",
      });
    }
  },

  /**
   * 🔍 SEARCH CERTIFICATES
   */
  async search(req, res) {
    try {
      const results = await certificateAdminService.searchCertificates(
        req.query
      );

      return res.status(200).json({
        success: true,
        count: results.length,
        data: results,
      });
    } catch (error) {
      console.error("[ADMIN_SEARCH_ERROR]", error.message);

      return res.status(500).json({
        success: false,
        message: "SEARCH_FAILED",
      });
    }
  },

  /**
   * 🚫 REVOKE CERTIFICATE
   */
  async revoke(req, res) {
    try {
      const { certificateId } = req.params;

      if (!certificateId) {
        return res.status(400).json({
          success: false,
          message: "CERTIFICATE_ID_REQUIRED",
        });
      }

      const result = await certificateAdminService.revokeCertificate(
        certificateId
      );

      return res.status(200).json({
        success: true,
        message: "CERTIFICATE_REVOKED",
        data: result,
      });
    } catch (error) {
      console.error("[ADMIN_REVOKE_ERROR]", error.message);

      return res.status(500).json({
        success: false,
        message: "REVOKE_FAILED",
      });
    }
  },

  /**
   * 👤 GET USER CERTIFICATES
   */
  async getUserCertificates(req, res) {
    try {
      const { userId } = req.params;

      const data = await certificateAdminService.getUserCertificates(userId);

      return res.status(200).json({
        success: true,
        count: data.length,
        data,
      });
    } catch (error) {
      console.error("[ADMIN_USER_CERTIFICATES_ERROR]", error.message);

      return res.status(500).json({
        success: false,
        message: "FAILED_TO_FETCH_USER_CERTIFICATES",
      });
    }
  },

  /**
   * 📚 GET COURSE CERTIFICATES
   */
  async getCourseCertificates(req, res) {
    try {
      const { courseId } = req.params;

      const data = await certificateAdminService.getCourseCertificates(
        courseId
      );

      return res.status(200).json({
        success: true,
        count: data.length,
        data,
      });
    } catch (error) {
      console.error("[ADMIN_COURSE_CERTIFICATES_ERROR]", error.message);

      return res.status(500).json({
        success: false,
        message: "FAILED_TO_FETCH_COURSE_CERTIFICATES",
      });
    }
  },

  /**
   * 📦 EXPORT CERTIFICATES DATA
   */
  async export(req, res) {
    try {
      const data = await certificateAdminService.exportCertificates(req.query);

      return res.status(200).json({
        success: true,
        exportedAt: data.exportedAt,
        count: data.count,
        data: data.data,
      });
    } catch (error) {
      console.error("[ADMIN_EXPORT_ERROR]", error.message);

      return res.status(500).json({
        success: false,
        message: "EXPORT_FAILED",
      });
    }
  },
};
