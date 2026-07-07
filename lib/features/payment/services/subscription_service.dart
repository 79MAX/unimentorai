class SubscriptionService {

  /// 💰 PLAN DETECTION
  String getPlan(double price) {
    if (price <= 10) return 'basic';
    if (price <= 30) return 'standard';
    return 'premium';
  }

  /// 🔒 ACCESS CONTROL
  bool canAccessContent(String role, String plan) {
    if (role == 'admin') return true;
    if (plan == 'premium') return true;
    if (plan == 'standard') return true;
    return false;
  }

  /// 📊 UPGRADE SUGGESTION
  String suggestUpgrade(String currentPlan) {
    if (currentPlan == 'basic') return 'Upgrade to Standard for full access';
    if (currentPlan == 'standard') return 'Upgrade to Premium for certification';
    return 'You are on the best plan';
  }
}
