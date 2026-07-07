import 'package:flutter/material.dart';

import '../../../core/analytics/analytics_service.dart';
import '../../../core/onboarding/onboarding_storage.dart';

/// Après auth locale : onboarding si besoin, sinon tableau de bord.
class PostAuthGateScreen extends StatefulWidget {
  const PostAuthGateScreen({super.key});

  @override
  State<PostAuthGateScreen> createState() => _PostAuthGateScreenState();
}

class _PostAuthGateScreenState extends State<PostAuthGateScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _route());
  }

  Future<void> _route() async {
    final done = await OnboardingStorage().isCompleted();
    if (!mounted) return;
    if (done) {
      await AnalyticsService.logPostAuthGate(destination: 'home');
      if (!mounted) return;
      Navigator.pushReplacementNamed(context, '/home');
    } else {
      await AnalyticsService.logPostAuthGate(destination: 'onboarding');
      if (!mounted) return;
      Navigator.pushReplacementNamed(context, '/onboarding');
    }
  }

  @override
  Widget build(BuildContext context) => const Scaffold(
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            CircularProgressIndicator(),
            SizedBox(height: 16),
            Text('Préparation de votre espace…'),
          ],
        ),
      ),
    );
}





