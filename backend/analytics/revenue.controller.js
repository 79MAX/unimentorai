
const RevenueService = require("./revenue.service");

/**
 * ========================
 * 📊 REVENUE CONTROLLER
 * UniMentorAI SaaS Analytics API Layer
 * ========================
 * ONLY HTTP HANDLING (NO BUSINESS LOGIC)
 */

class RevenueController {

  /**
   * ========================
   * 📊 FULL DASHBOARD
   * ========================
   */
  async getDashboard(req, res) {

    try {

      const data = await RevenueService.getDashboard();

      return res.status(200).json({
        success: true,
        message: "Revenue dashboard fetched successfully",
        data
      });

    } catch (err) {

      return res.status(500).json({
        success: false,
        message: "Failed to fetch revenue dashboard",
        error: err.message
      });
    }
  }

  /**
   * ========================
   * 💰 TOTAL REVENUE ONLY
   * ========================
   */
  async getTotalRevenue(req, res) {

    try {

      const total = await RevenueService.getTotalRevenue();

      return res.status(200).json({
        success: true,
        data: { totalRevenue: total }
      });

    } catch (err) {

      return res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }

  /**
   * ========================
   * 📆 MONTHLY REVENUE (MRR)
   * ========================
   */
  async getMonthlyRevenue(req, res) {

    try {

      const mrr = await RevenueService.getMonthlyRevenue();

      return res.status(200).json({
        success: true,
        data: { monthlyRevenue: mrr }
      });

    } catch (err) {

      return res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }

  /**
   * ========================
   * 📚 TOP COURSES
   * ========================
   */
  async getTopCourses(req, res) {

    try {

      const limit = req.query.limit || 5;

      const courses = await RevenueService.getTopCourses(limit);

      return res.status(200).json({
        success: true,
        data: courses
      });

    } catch (err) {

      return res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }

  /**
   * ========================
   * 👤 USER STATS
   * ========================
   */
  async getUserStats(req, res) {

    try {

      const stats = await RevenueService.getUserStats();

      return res.status(200).json({
        success: true,
        data: stats
      });

    } catch (err) {

      return res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }

}

module.exports = new RevenueController();
