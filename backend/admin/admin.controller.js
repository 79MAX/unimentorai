export const getAdminStats = async (req, res) => {
  try {
    const stats = {
      users: 1200,
      revenue: 5400,
      aiUsage: 320000,
      requests: 98000,
      timestamp: Date.now(),
    };

    return res.json({
      success: true,
      data: stats,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "STATS_ERROR",
    });
  }
};
