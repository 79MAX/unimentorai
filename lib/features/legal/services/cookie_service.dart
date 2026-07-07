import 'package:shared_preferences/shared_preferences.dart';

/// 🍪 COOKIE CONSENT STATUS
enum CookieConsentStatus {
  accepted,
  rejected,
  notSet,
}

/// 🔐 COOKIE SERVICE (SaaS READY)
class CookieService {
  static const String _consentKey = 'cookie_consent_status';
  static const String _policyVersionKey = 'cookie_policy_version';

  /// CURRENT POLICY VERSION (important for GDPR updates)
  static const String currentPolicyVersion = '1.0';

  /// 🍪 SAVE USER CONSENT
  Future<void> setConsent(CookieConsentStatus status) async {
    final prefs = await SharedPreferences.getInstance();

    await prefs.setString(_consentKey, status.name);
    await prefs.setString(_policyVersionKey, currentPolicyVersion);
  }

  /// 📥 GET CONSENT STATUS
  Future<CookieConsentStatus> getConsentStatus() async {
    final prefs = await SharedPreferences.getInstance();

    final value = prefs.getString(_consentKey);

    if (value == null) {
      return CookieConsentStatus.notSet;
    }

    return CookieConsentStatus.values.firstWhere(
      (e) => e.name == value,
      orElse: () => CookieConsentStatus.notSet,
    );
  }

  /// 📌 CHECK IF COOKIES ARE ACCEPTED
  Future<bool> isAccepted() async {
    final status = await getConsentStatus();
    return status == CookieConsentStatus.accepted;
  }

  /// ❌ CHECK IF USER REJECTED
  Future<bool> isRejected() async {
    final status = await getConsentStatus();
    return status == CookieConsentStatus.rejected;
  }

  /// 🔄 RESET CONSENT (useful for policy updates)
  Future<void> resetConsent() async {
    final prefs = await SharedPreferences.getInstance();

    await prefs.remove(_consentKey);
    await prefs.remove(_policyVersionKey);
  }

  /// 📊 CHECK IF POLICY UPDATED (force re-consent)
  Future<bool> isPolicyOutdated() async {
    final prefs = await SharedPreferences.getInstance();

    final savedVersion = prefs.getString(_policyVersionKey);

    return savedVersion != currentPolicyVersion;
  }

  /// ⚠️ REQUIRE USER TO RECONFIRM CONSENT
  Future<bool> mustAskConsentAgain() async {
    final status = await getConsentStatus();
    final outdated = await isPolicyOutdated();

    return status == CookieConsentStatus.notSet || outdated;
  }
}