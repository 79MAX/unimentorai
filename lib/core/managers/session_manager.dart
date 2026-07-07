import '../repositories/auth_repository.dart';

class SessionManager {
  final AuthRepository _repo;

  SessionManager(this._repo);

  /// CHECK LOCAL SESSION FAST
  bool hasLocalSession() => _repo.isLoggedIn();

  /// CHECK FULL SESSION (LOCAL + FIREBASE)
  Future<bool> validateSession() async => await _repo.isSessionValid();

  /// GET CURRENT USER ID (SAFE)
  String? getUserId() => _repo.getLocalUserId();

  /// AUTO CLEAN IF SESSION INVALID
  Future<bool> refreshSession() async {
    final isValid = await _repo.isSessionValid();

    if (!isValid) {
      await _repo.logout();
      return false;
    }

    return true;
  }

  /// ENTRY POINT (USED BY AUTHGATE)
  Future<bool> checkSession() async => await validateSession();
}

