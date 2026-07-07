import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../services/app_bootstrap_service.dart';

/// ===============================
/// SPLASH SCREEN (PRO CLEAN VERSION)
/// ===============================
class SplashScreen extends ConsumerStatefulWidget {
  const SplashScreen({super.key});

  @override
  ConsumerState<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends ConsumerState<SplashScreen> {
  bool _hasNavigated = false;

  @override
  void initState() {
    super.initState();

    WidgetsBinding.instance.addPostFrameCallback((_) {
      _bootstrap();
    });
  }

  Future<void> _bootstrap() async {
    if (_hasNavigated || !mounted) return;

    try {
      final service = ref.read(appBootstrapServiceProvider);
      final result = await service.init();

      if (!mounted || _hasNavigated) return;

      _navigate(result.route);
    } catch (e, stack) {
      debugPrint('Splash bootstrap error: $e\n$stack');

      if (!mounted || _hasNavigated) return;

      _navigate('/error');
    }
  }

  void _navigate(String route) {
    if (_hasNavigated || !mounted) return;

    _hasNavigated = true;
    context.go(route);
  }

  @override
  Widget build(BuildContext context) => const Scaffold(
      body: Center(
        child: CircularProgressIndicator(),
      ),
    );
}