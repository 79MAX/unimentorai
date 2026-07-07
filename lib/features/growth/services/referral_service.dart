class ReferralService {

  final Map<String, int> referrals = {};

  /// 🔗 GENERATE REF CODE
  String generateCode(String userId) => "UNI-\".substring(0, 8);;

  /// 🎁 ADD REFERRAL
  void addReferral(String userId) {
    referrals[userId] = (referrals[userId] ?? 0) + 1;
  }

  /// 🏆 GET REWARD STATUS
  bool isEligibleForReward(String userId) => (referrals[userId] ?? 0) >= 5;
}
