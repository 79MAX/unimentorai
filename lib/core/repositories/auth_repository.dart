import '../services/auth/firebase_auth_service.dart';
import '../services/auth/local_auth_service.dart';

class AuthRepository {
  final FirebaseAuthService firebase;
  final LocalAuthService local;

  AuthRepository({
    required this.firebase,
    required this.local,
  });

  /// LOGIN
  Future<String> login(String email, String password) async {
    final cred = await firebase.login(
      email: email.trim(),
      password: password.trim(),
    );

    final uid = cred.user?.uid;

    if (uid == null) {
      throw Exception('Login failed: user is null');
    }

    await local.saveUserId(uid);

    return uid;
  }

  /// REGISTER
  Future<String> register(String email, String password) async {
    final cred = await firebase.register(
      email: email.trim(),
      password: password,
    );

    final user = cred.user;

    if (user == null) {
      throw Exception('Register failed: user is null');
    }

    await local.saveUserId(user.uid);

    return user.uid;
  }

  /// LOGOUT
  Future<void> logout() async {
    await Future.wait([
      firebase.logout(),
      local.clear(),
    ]);
  }

  /// CHECK LOCAL SESSION (FAST)
  bool isLoggedIn() => local.getUserId() != null;

  /// GET CURRENT USER ID (SAFE)
  String? getLocalUserId() => local.getUserId();

  /// SYNC CHECK (FIREBASE + LOCAL)
  Future<bool> isSessionValid() async {
    final user = firebase.currentUser;

    if (user == null) {
      await local.clear();
      return false;
    }

    if (!user.emailVerified) {
      return false;
    }

    await local.saveUserId(user.uid);
    return true;
  }
}

