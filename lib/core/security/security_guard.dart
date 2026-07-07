import 'package:firebase_auth/firebase_auth.dart';

import '../../features/user/models/app_user.dart';

class SecurityGuard {
  SecurityGuard(this._user);

  final AppUser? _user;

  // =========================
  // 🔐 AUTH STATE
  // =========================

  User? get _firebaseUser => FirebaseAuth.instance.currentUser;

  bool get isAuthenticated => _firebaseUser != null;

  bool get isGuest => !isAuthenticated;

  // =========================
  // 👤 PROFILE STATE
  // =========================

  bool get hasProfile => _user != null;

  bool get isProfileLoaded => _user != null;

  // =========================
  // 🎯 ROLE SYSTEM
  // =========================

  String get role => _user?.role ?? 'guest';

  bool get isAdmin => role == 'admin';

  bool get isMentor => role == 'mentor';

  bool get isStudent => role == 'student';

  // =========================
  // 🚀 ACCESS RULES (CORE)
  // =========================

  bool get canAccessDashboard => isAuthenticated && hasProfile;

  bool get canAccessAdmin => isAuthenticated && isAdmin;

  bool get needsOnboarding =>
      isAuthenticated && hasProfile && _user!.onboardingCompleted == false;

  bool get mustLogin => !isAuthenticated;

  // =========================
  // 🌐 ROUTE SECURITY ENGINE
  // =========================

  bool canAccessRoute(String route) {
    switch (route) {
      case '/login':
        return mustLogin;

      case '/onboarding':
        return isAuthenticated;

      case '/home':
        return canAccessDashboard;

      case '/admin':
        return canAccessAdmin;

      default:
        return isAuthenticated;
    }
  }

  // =========================
  // 📊 STATUS ENGINE
  // =========================

  String get status {
    if (!isAuthenticated) return 'unauthenticated';
    if (!hasProfile) return 'no_profile';
    if (needsOnboarding) return 'onboarding_required';
    return 'active';
  }

  // =========================
  // 🧹 SAFE HELPERS
  // =========================

  bool requireAuth() => isAuthenticated;

  bool requireAdmin() => canAccessAdmin;
}




