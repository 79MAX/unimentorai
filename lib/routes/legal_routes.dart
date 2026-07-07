import 'package:flutter/material.dart';

import 'package:unimentorai/features/legal/presentation/legal_settings_screen.dart';
import 'package:unimentorai/features/legal/presentation/privacy_policy_screen.dart';
import 'package:unimentorai/features/legal/presentation/terms_of_service_screen.dart';
import 'package:unimentorai/features/legal/presentation/refund_policy_screen.dart';
import 'package:unimentorai/features/legal/presentation/cookie_policy_screen.dart';

class LegalRoutes {
  static const String settings = '/legal/settings';
  static const String privacy = '/legal/privacy';
  static const String terms = '/legal/terms';
  static const String refund = '/legal/refund';
  static const String cookies = '/legal/cookies';

  static Route<dynamic> generate(RouteSettings settingsRoute) {
    final name = settingsRoute.name ?? '';

    switch (name) {
      case settings:
        return MaterialPageRoute(
          builder: (_) => const LegalSettingsScreen(),
        );

      case privacy:
        return MaterialPageRoute(
          builder: (_) => const PrivacyPolicyScreen(),
        );

      case terms:
        return MaterialPageRoute(
          builder: (_) => const TermsOfServiceScreen(),
        );

      case refund:
        return MaterialPageRoute(
          builder: (_) => const RefundPolicyScreen(),
        );

      case cookies:
        return MaterialPageRoute(
          builder: (_) => const CookiePolicyScreen(),
        );

      default:
        return MaterialPageRoute(
          builder: (_) => Scaffold(
            body: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.warning, size: 50, color: Colors.red),
                  const SizedBox(height: 10),
                  const Text('Route inconnue'),
                  Text(name),
                ],
              ),
            ),
          ),
        );
    }
  }
}