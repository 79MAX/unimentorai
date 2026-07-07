
const Payment = require("../models/payment.model");

/**
 * ========================
 * 📊 REVENUE AGGREGATION ENGINE
 * UniMentorAI SaaS Batch Analytics Layer
 * ========================
 * Handles heavy computations for dashboard caching
 */

class RevenueAggregator {

  /**
   * ========================
   * 💰 DAILY REVENUE AGGREGATION
   * ========================
   */
  async getDailyRevenue() {

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const result = await Payment.aggregate([
      {
        $match: {
          status: "completed",
          createdAt: { $gte: startOfDay }
        }
      },
      {
        $group: {
          _id: null,
          dailyRevenue: { $sum: "$amount" },
          transactions: { $sum: 1 }
        }
      }
    ]);

    return result[0] || { dailyRevenue: 0, transactions: 0 };
  }

  /**
   * ========================
   * 📆 WEEKLY REVENUE
   * ========================
   */
  async getWeeklyRevenue() {

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - 7);

    const result = await Payment.aggregate([
      {
        $match: {
          status: "completed",
          createdAt: { $gte: startOfWeek }
        }
      },
      {
        $group: {
          _id: null,
          weeklyRevenue: { $sum: "$amount" },
          transactions: { $sum: 1 }
        }
      }
    ]);

    return result[0] || { weeklyRevenue: 0, transactions: 0 };
  }

  /**
   * ========================
   * 📊 MONTHLY TREND (GROUP BY DAY)
   * ========================
   */
  async getMonthlyTrend() {

    const startOfMonth = new Date();
    startOfMonth.setDate(1);

    return await Payment.aggregate([
      {
        $match: {
          status: "completed",
          createdAt: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$createdAt" }
          },
          revenue: { $sum: "$amount" },
          transactions: { $sum: 1 }
        }
      },
      { $sort: { "_id.day": 1 } }
    ]);
  }

  /**
   * ========================
   * 📚 COURSE PERFORMANCE SNAPSHOT
   * ========================
   */
  async getCoursePerformanceSnapshot() {

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
          totalRevenue: { $sum: "$amount" },
          salesCount: { $sum: 1 },
          avgRevenuePerSale: { $avg: "$amount" }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);
  }

  /**
   * ========================
   * 👤 USER REVENUE SEGMENTATION
   * ========================
   */
  async getUserRevenueSegments() {

    return await Payment.aggregate([
      {
        $match: { status: "completed" }
      },
      {
        $group: {
          _id: "$user",
          totalSpent: { $sum: "$amount" },
          transactions: { $sum: 1 }
        }
      },
      {
        $bucket: {
          groupBy: "$totalSpent",
          boundaries: [0, 10, 50, 100, 500, 1000],
          default: "1000+",
          output: {
            count: { $sum: 1 }
          }
        }
      }
    ]);
  }

  /**
   * ========================
   * 📊 FULL CACHE SNAPSHOT
   * ========================
   */
  async buildDashboardCache() {

    const [
      daily,
      weekly,
      monthlyTrend,
      coursePerf
    ] = await Promise.all([
      this.getDailyRevenue(),
      this.getWeeklyRevenue(),
      this.getMonthlyTrend(),
      this.getCoursePerformanceSnapshot()
    ]);

    return {
      daily,
      weekly,
      monthlyTrend,
      coursePerformance: coursePerf,
      generatedAt: new Date()
    };
  }
}

module.exports = new RevenueAggregator();
