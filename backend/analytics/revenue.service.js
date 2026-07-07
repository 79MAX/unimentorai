
const Payment = require("../models/payment.model");
const User = require("../models/user.model");
const Course = require("../models/course.model");

/**
 * ========================
 * 📊 REVENUE INTELLIGENCE ENGINE
 * UniMentorAI SaaS Analytics Core
 * ========================
 */

class RevenueService {

  /**
   * ========================
   * 💰 TOTAL REVENUE
   * ========================
   */
  async getTotalRevenue() {

    const result = await Payment.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" }
        }
      }
    ]);

    return result[0]?.totalRevenue || 0;
  }

  /**
   * ========================
   * 📆 MONTHLY REVENUE (MRR)
   * ========================
   */
  async getMonthlyRevenue() {

    const startOfMonth = new Date();
    startOfMonth.setDate(1);

    const result = await Payment.aggregate([
      {
        $match: {
          status: "completed",
          createdAt: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          mrr: { $sum: "$amount" }
        }
      }
    ]);

    return result[0]?.mrr || 0;
  }

  /**
   * ========================
   * 💎 REVENUE BY TYPE
   * ========================
   * course / subscription / ai_service
   */
  async getRevenueByType() {

    return await Payment.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      }
    ]);
  }

  /**
   * ========================
   * 📚 TOP COURSES BY REVENUE
   * ========================
   */
  async getTopCourses(limit = 5) {

    return await Payment.aggregate([
      {
        $match: {
          status: "completed",
          course: { $ne: null }
        }
      },
      {
        $group: {
          _id: "$course",
          revenue: { $sum: "$amount" },
          sales: { $sum: 1 }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: limit }
    ]);
  }

  /**
   * ========================
   * 👤 USER METRICS
   * ========================
   */
  async getUserStats() {

    const totalUsers = await User.countDocuments();

    const activeSubscribers = await User.countDocuments({
      "subscription.status": "active"
    });

    const freeUsers = await User.countDocuments({
      "subscription.plan": "free"
    });

    return {
      totalUsers,
      activeSubscribers,
      freeUsers
    };
  }

  /**
   * ========================
   * 📈 AVERAGE REVENUE PER USER (ARPU)
   * ========================
   */
  async getARPU() {

    const totalRevenue = await this.getTotalRevenue();
    const users = await User.countDocuments();

    return users === 0 ? 0 : totalRevenue / users;
  }

  /**
   * ========================
   * 💰 LIFETIME VALUE (PROXY)
   * ========================
   */
  async getLTV() {

    const revenue = await this.getTotalRevenue();
    const users = await User.countDocuments({ "subscription.status": "active" });

    return users === 0 ? 0 : revenue / users;
  }

  /**
   * ========================
   * 📊 FULL DASHBOARD
   * ========================
   */
  async getDashboard() {

    const [
      totalRevenue,
      monthlyRevenue,
      revenueByType,
      topCourses,
      userStats,
      arpu,
      ltv
    ] = await Promise.all([
      this.getTotalRevenue(),
      this.getMonthlyRevenue(),
      this.getRevenueByType(),
      this.getTopCourses(),
      this.getUserStats(),
      this.getARPU(),
      this.getLTV()
    ]);

    return {
      revenue: {
        total: totalRevenue,
        monthly: monthlyRevenue,
        byType: revenueByType
      },
      courses: {
        top: topCourses
      },
      users: userStats,
      metrics: {
        arpu,
        ltv
      }
    };
  }
}

module.exports = new RevenueService();
