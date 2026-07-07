/// ===============================
/// STARTUP STATE (BOOTSTRAP CORE)
/// ===============================
/// 👉 Single source of truth for app startup flow
library;

enum StartupStatus {
  loading,
  unauthenticated,
  unverified,
  maintenance,
  authenticated,
  error,
}

class StartupState {
  final StartupStatus status;
  final String? route;
  final String? role;
  final String? error;

  const StartupState._({
    required this.status,
    this.route,
    this.role,
    this.error,
  });

  /// ===============================
  /// LOADING
  /// ===============================
  factory StartupState.loading() => const StartupState._(
      status: StartupStatus.loading,
      route: '/',
    );

  /// ===============================
  /// UNAUTHENTICATED
  /// ===============================
  factory StartupState.unauthenticated() => const StartupState._(
      status: StartupStatus.unauthenticated,
      route: '/login',
    );

  /// ===============================
  /// EMAIL VERIFICATION REQUIRED
  /// ===============================
  factory StartupState.unverified() => const StartupState._(
      status: StartupStatus.unverified,
      route: '/verify-email',
    );

  /// ===============================
  /// MAINTENANCE MODE
  /// ===============================
  factory StartupState.maintenance() => const StartupState._(
      status: StartupStatus.maintenance,
      route: '/maintenance',
    );

  /// ===============================
  /// AUTHENTICATED (ROLE ROUTING)
  /// ===============================
  factory StartupState.authenticated({
    required String role,
  }) {
    final normalizedRole = role.trim().toLowerCase();

    final route = switch (normalizedRole) {
      'admin' => '/admin',
      'mentor' => '/mentor',
      _ => '/home',
    };

    return StartupState._(
      status: StartupStatus.authenticated,
      route: route,
      role: normalizedRole,
    );
  }

  /// ===============================
  /// ERROR STATE
  /// ===============================
  factory StartupState.error(String message) => StartupState._(
      status: StartupStatus.error,
      route: '/error',
      error: message,
    );

  /// ===============================
  /// HELPERS (CLEAN UI / ROUTING)
  /// ===============================
  bool get isLoading => status == StartupStatus.loading;
  bool get isAuthenticated => status == StartupStatus.authenticated;
  bool get needsLogin => status == StartupStatus.unauthenticated;
  bool get needsVerification => status == StartupStatus.unverified;
  bool get isMaintenance => status == StartupStatus.maintenance;
  bool get hasError => status == StartupStatus.error;

  /// ===============================
  /// COPY WITH (SAAS SCALABILITY)
  /// ===============================
  StartupState copyWith({
    StartupStatus? status,
    String? route,
    String? role,
    String? error,
  }) => StartupState._(
      status: status ?? this.status,
      route: route ?? this.route,
      role: role ?? this.role,
      error: error ?? this.error,
    );
}

