class PaywallEngine {

  /// 🚪 BLOCK OR ALLOW ACCESS
  bool shouldBlockContent(bool isPremium, String contentType) {
    if (contentType == 'certificate' && !isPremium) {
      return true;
    }
    return false;
  }

  /// 💡 SHOW PAYWALL MESSAGE
  String getPaywallMessage() => 'Unlock full access with Premium plan';
}
