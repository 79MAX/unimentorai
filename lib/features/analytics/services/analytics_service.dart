class AnalyticsService {

  int totalUsers = 0;
  int premiumUsers = 0;
  double revenue = 0;

  /// 📊 TRACK USER
  void trackUser(bool isPremium) {
    totalUsers++;
    if (isPremium) premiumUsers++;
  }

  /// 💰 TRACK REVENUE
  void trackRevenue(double amount) {
    revenue += amount;
  }

  /// 📈 CONVERSION RATE
  double getConversionRate() {
    if (totalUsers == 0) return 0;
    return (premiumUsers / totalUsers) * 100;
  }
}
