import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'app_bootstrap_service.dart';

/// ===============================
/// SPLASH STATE
/// ===============================
class SplashState {
  final bool isLoading;
  final String? route;
  final String? error;

  const SplashState({
    required this.isLoading,
    this.route,
    this.error,
  });

  factory SplashState.loading() => const SplashState(isLoading: true);

  factory SplashState.done(String route) => SplashState(isLoading: false, route: route);

  factory SplashState.error(String error) => SplashState(isLoading: false, error: error);
}

/// ===============================
/// SPLASH CONTROLLER
/// ===============================
class SplashController extends StateNotifier<SplashState> {
  SplashController(this._service) : super(SplashState.loading());

  final AppBootstrapService _service;

  /// ENTRY POINT
  Future<String> start() async {
    state = SplashState.loading();

    try {
      final result = await _service.initialize();

      final route = _resolveRoute(result);

      state = SplashState.done(route);
      return route;
    } catch (e) {
      state = SplashState.error(e.toString());
      return '/error';
    }
  }

  /// ROUTING LOGIC CLEAN
  String _resolveRoute(AppBootstrapResult result) {
    if (!result.success) {
      return '/error';
    }

    final message = result.message?.toLowerCase() ?? '';

    if (message.contains('maintenance')) {
      return '/maintenance';
    }

    if (message.contains('update')) {
      return '/update';
    }

    return '/home';
  }
}