import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class FirebaseAuthService {
  final FirebaseAuth _auth;
  final FirebaseFirestore _db;

  FirebaseAuthService({
    FirebaseAuth? auth,
    FirebaseFirestore? firestore,
  })  : _auth = auth ?? FirebaseAuth.instance,
        _db = firestore ?? FirebaseFirestore.instance;

  /// CURRENT USER
  User? get currentUser => _auth.currentUser;

  /// AUTH STATE STREAM
  Stream<User?> authStateChanges() => _auth.authStateChanges();

  /// LOGIN
  Future<UserCredential> login({
    required String email,
    required String password,
  }) async => await _auth.signInWithEmailAndPassword(
      email: email.trim(),
      password: password,
    );

  /// REGISTER
  Future<UserCredential> register({
    required String email,
    required String password,
  }) async {
    final cred = await _auth.createUserWithEmailAndPassword(
      email: email.trim(),
      password: password,
    );

    final user = cred.user;
    if (user == null) {
      throw Exception('User creation failed');
    }

    await user.sendEmailVerification();

    await _db.collection('users').doc(user.uid).set({
      'uid': user.uid,
      'email': email.trim(),
      'role': 'student',
      'isVerified': false,
      'createdAt': FieldValue.serverTimestamp(),
    });

    return cred;
  }

  /// LOGOUT
  Future<void> logout() async {
    await _auth.signOut();
  }

  /// RESET PASSWORD
  Future<void> resetPassword(String email) async {
    await _auth.sendPasswordResetEmail(email: email.trim());
  }

  /// RESEND VERIFICATION EMAIL
  Future<void> resendVerificationEmail() async {
    final user = _auth.currentUser;
    if (user != null && !user.emailVerified) {
      await user.sendEmailVerification();
    }
  }

  /// CHECK EMAIL VERIFIED
  bool get isEmailVerified => _auth.currentUser?.emailVerified ?? false;

  /// REFRESH USER (important Firebase bug fix)
  Future<void> reloadUser() async {
    await _auth.currentUser?.reload();
  }
}

