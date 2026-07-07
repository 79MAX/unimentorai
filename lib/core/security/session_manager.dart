import 'package:firebase_auth/firebase_auth.dart';

import '../../features/user/models/app_user.dart';
import '../../features/user/services/user_service.dart';

class SessionManager {
  SessionManager(this._userService);

  final UserService _userService;

  AppUser? _user;

  bool _loading = false;
  bool _isInitialized = false;

  /// 👤 CURRENT FIREBASE USER
  User? get firebaseUser => FirebaseAuth.instance.currentUser;

  /// 🔐 LOGIN STATE
  bool get isLoggedIn => firebaseUser != null;

  /// 👤 CACHED USER
  AppUser? get user => _user;

  /// ⏳ LOADING STATE
  bool get isLoading => _loading;

  /// 🚀 INIT SESSION (SAFE SINGLE LOAD)
  Future<AppUser?> init() async {
    if (_isInitialized && _user != null) return _user;

    final uid = firebaseUser?.uid;
    if (uid == null) return null;

    _loading = true;

    try {
      _user = await _userService.getUser(uid);
      _isInitialized = true;
      return _user;
    } finally {
      _loading = false;
    }
  }

  /// 🔄 REFRESH SESSION (FORCE UPDATE)
  Future<AppUser?> refresh() async {
    final uid = firebaseUser?.uid;
    if (uid == null) return null;

    _loading = true;

    try {
      _user = await _userService.getUser(uid);
      return _user;
    } finally {
      _loading = false;
    }
  }

  /// 🚪 CLEAR SESSION (LOGOUT SAFE)
  void clear() {
    _user = null;
    _isInitialized = false;
    _loading = false;
  }

  /// 🎯 ROLE HELPERS
  bool get isAdmin => _user?.role == 'admin';

  bool get isMentor => _user?.role == 'mentor';

  bool get isStudent => _user?.role == 'student';

  /// 💎 PREMIUM CHECK
  bool get isPremium => _user?.isPremium == true;

  /// 🚀 ONBOARDING CHECK
  bool get needsOnboarding =>
      _user != null && _user!.onboardingCompleted == false;

  /// ⚡ HAS USER LOADED
  bool get hasUser => _user != null;
}




