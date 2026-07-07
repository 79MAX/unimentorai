import 'package:firebase_auth/firebase_auth.dart';

import '../domain/auth_repository.dart';

/// =====================================================
/// FIREBASE AUTH REPOSITORY (PRODUCTION SAAS)
/// =====================================================
///
/// 👉 Implémentation Firebase officielle
/// 👉 Compatible GoRouter + Riverpod + Stripe SaaS
/// 👉 Extensible (Google / Apple / SSO future)
///
class FirebaseAuthRepository implements AuthRepository {
final FirebaseAuth auth;

FirebaseAuthRepository(this.auth);

/// =====================================================
/// AUTH STREAM
/// =====================================================
@override
Stream<User?> authStateChanges() => auth.authStateChanges().handleError((error) {
throw Exception('Auth stream error: $error');
});

/// =====================================================
/// CURRENT USER
/// =====================================================
@override
User? currentUser() => auth.currentUser;

/// =====================================================
/// SIGN IN
/// =====================================================
@override
Future<UserCredential> signIn({
required String email,
required String password,
}) async => await auth.signInWithEmailAndPassword(
email: email.trim(),
password: password.trim(),
);

/// =====================================================
/// SIGN UP
/// =====================================================
@override
Future<UserCredential> signUp({
required String email,
required String password,
}) async => await auth.createUserWithEmailAndPassword(
email: email.trim(),
password: password.trim(),
);

/// =====================================================
/// SIGN OUT
/// =====================================================
@override
Future<void> signOut() async {
await auth.signOut();
}

/// =====================================================
/// EMAIL VERIFICATION
/// =====================================================
@override
Future<void> sendEmailVerification() async {
final user = auth.currentUser;
if (user != null && !user.emailVerified) {
await user.sendEmailVerification();
}
}

/// =====================================================
/// PASSWORD RESET
/// =====================================================
@override
Future<void> sendPasswordResetEmail(String email) async {
await auth.sendPasswordResetEmail(email: email.trim());
}

/// =====================================================
/// RELOAD USER (IMPORTANT FOR EMAIL VERIFIED STATE)
/// =====================================================
@override
Future<void> reloadUser() async {
await auth.currentUser?.reload();
}

/// =====================================================
/// DELETE ACCOUNT
/// =====================================================
@override
Future<void> deleteAccount() async {
final user = auth.currentUser;
if (user != null) {
await user.delete();
}
}
}

