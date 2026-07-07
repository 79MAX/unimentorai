import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';

class AuthController extends ChangeNotifier {
  final FirebaseAuth _firebaseAuth = FirebaseAuth.instance;

  bool _isLoading = false;
  String? _errorMessage;

  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  User? get currentUser => _firebaseAuth.currentUser;

  // =========================
  // LOGIN
  // =========================
  Future<bool> login({
    required String email,
    required String password,
  }) async {
    try {
      _setLoading(true);
      _clearError();

      await _firebaseAuth.signInWithEmailAndPassword(
        email: email.trim(),
        password: password.trim(),
      );

      return true;
    } on FirebaseAuthException catch (e) {
      _setError(_handleFirebaseError(e));
      return false;
    } catch (e) {
      _setError('Une erreur inattendue est survenue.');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  // =========================
  // REGISTER
  // =========================
  Future<bool> register({
    required String email,
    required String password,
  }) async {
    try {
      _setLoading(true);
      _clearError();

      await _firebaseAuth.createUserWithEmailAndPassword(
        email: email.trim(),
        password: password.trim(),
      );

      return true;
    } on FirebaseAuthException catch (e) {
      _setError(_handleFirebaseError(e));
      return false;
    } catch (e) {
      _setError('Une erreur inattendue est survenue.');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  // =========================
  // LOGOUT
  // =========================
  Future<void> logout() async {
    await _firebaseAuth.signOut();
    notifyListeners();
  }

  // =========================
  // RESET PASSWORD
  // =========================
  Future<bool> resetPassword(String email) async {
    try {
      _setLoading(true);
      _clearError();

      await _firebaseAuth.sendPasswordResetEmail(
        email: email.trim(),
      );

      return true;
    } on FirebaseAuthException catch (e) {
      _setError(_handleFirebaseError(e));
      return false;
    } catch (e) {
      _setError('Une erreur inattendue est survenue.');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  // =========================
  // HELPERS
  // =========================
  void _setLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }

  void _setError(String message) {
    _errorMessage = message;
    notifyListeners();
  }

  void _clearError() {
    _errorMessage = null;
  }

  String _handleFirebaseError(FirebaseAuthException e) {
    switch (e.code) {
      case 'user-not-found':
        return 'Utilisateur introuvable.';

      case 'wrong-password':
        return 'Mot de passe incorrect.';

      case 'email-already-in-use':
        return 'Cet email est déjà utilisé.';

      case 'invalid-email':
        return 'Adresse email invalide.';

      case 'weak-password':
        return 'Mot de passe trop faible.';

      case 'network-request-failed':
        return 'Problème de connexion Internet.';

      default:
        return e.message ?? 'Erreur d’authentification.';
    }
  }
}




