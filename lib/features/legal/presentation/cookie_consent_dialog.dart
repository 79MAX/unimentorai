import 'package:flutter/material.dart';
import '../services/cookie_service.dart';

class CookieConsentDialog {

  /// 🍪 SHOW CONSENT BANNER (SMART + GDPR READY)
  static Future<void> show(BuildContext context) async {
    final accepted = await CookieService.hasAcceptedAll();

    if (accepted) return;

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => const _CookieConsentView(),
    );
  }
}

class _CookieConsentView extends StatefulWidget {
  const _CookieConsentView();

  @override
  State<_CookieConsentView> createState() => _CookieConsentViewState();
}

class _CookieConsentViewState extends State<_CookieConsentView> {

  bool analytics = true;
  bool personalization = true;
  bool marketing = false;

  /// 🍪 ACCEPT ALL COOKIES
  Future<void> _acceptAll() async {
    await CookieService.acceptAll();
    if (mounted) Navigator.pop(context);
  }

  /// ❌ REJECT NON-ESSENTIAL
  Future<void> _rejectAll() async {
    await CookieService.rejectAll();
    if (mounted) Navigator.pop(context);
  }

  /// ⚙️ SAVE CUSTOM SETTINGS
  Future<void> _saveCustom() async {
    await CookieService.setCookie(CookieType.analytics, analytics);
    await CookieService.setCookie(CookieType.personalization, personalization);
    await CookieService.setCookie(CookieType.marketing, marketing);

    if (mounted) Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) => AlertDialog(
      title: const Text('🍪 Cookie Preferences'),

      content: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [

            const Text(
              'We use cookies to improve your learning experience, personalize AI tutoring, and ensure platform security.',
            ),

            const SizedBox(height: 20),

            /// 📊 ANALYTICS
            SwitchListTile(
              title: const Text('Analytics Cookies'),
              subtitle: const Text('Help us improve performance and learning insights.'),
              value: analytics,
              onChanged: (v) => setState(() => analytics = v),
            ),

            /// 🤖 PERSONALIZATION
            SwitchListTile(
              title: const Text('Personalization Cookies'),
              subtitle: const Text('AI recommendations and adaptive learning.'),
              value: personalization,
              onChanged: (v) => setState(() => personalization = v),
            ),

            /// 📢 MARKETING
            SwitchListTile(
              title: const Text('Marketing Cookies'),
              subtitle: const Text('Ads and promotional content.'),
              value: marketing,
              onChanged: (v) => setState(() => marketing = v),
            ),
          ],
        ),
      ),

      actions: [

        /// ❌ REJECT ALL
        TextButton(
          onPressed: _rejectAll,
          child: const Text('Reject All'),
        ),

        /// ⚙️ SAVE CUSTOM
        TextButton(
          onPressed: _saveCustom,
          child: const Text('Save'),
        ),

        /// ✅ ACCEPT ALL
        ElevatedButton(
          onPressed: _acceptAll,
          child: const Text('Accept All'),
        ),
      ],
    );
}