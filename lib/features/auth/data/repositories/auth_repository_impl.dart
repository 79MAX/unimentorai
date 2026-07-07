import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../../../user/models/app_user.dart';

class AuthRepositoryImpl {
  final FirebaseAuth _auth;
  final FirebaseFirestore _firestore;

  AuthRepositoryImpl({
    FirebaseAuth? auth,
    FirebaseFirestore? firestore,
  })  : _auth = auth ?? FirebaseAuth.instance,
        _firestore = firestore ?? FirebaseFirestore.instance;

  /// 🔐 CURRENT USER STREAM
  Stream<AppUser?> get user => _auth.authStateChanges().asyncMap((firebaseUser) async {
      if (firebaseUser == null) return null;

      final doc = await _firestore
          .collection('users')
          .doc(firebaseUser.uid)
          .get();

      if (!doc.exists) {
        return AppUser.empty(firebaseUser.uid);
      }

      return AppUser.fromFirestore(doc);
    });

  /// 🟢 SIGN IN
  Future<AppUser> signIn(String email, String password) async {
    final result = await _auth.signInWithEmailAndPassword(
      email: email,
      password: password,
    );

    final user = result.user!;
    return await _getUser(user.uid);
  }

  /// 🟢 SIGN UP
  Future<AppUser> signUp(String email, String password, String fullName) async {
    final result = await _auth.createUserWithEmailAndPassword(
      email: email,
      password: password,
    );

    final user = result.user!;

    final appUser = AppUser(
      uid: user.uid,
      email: email,
      fullName: fullName,
      role: 'student',
      isPremium: false,
      onboardingCompleted: false,
      createdAt: DateTime.now(),
    );

    await _firestore
        .collection('users')
        .doc(user.uid)
        .set(appUser.toMap());

    return appUser;
  }

  /// 🚪 SIGN OUT
  Future<void> signOut() async {
    await _auth.signOut();
  }

  /// 📦 GET USER FROM FIRESTORE
  Future<AppUser> _getUser(String uid) async {
    final doc = await _firestore.collection('users').doc(uid).get();

    if (!doc.exists) {
      return AppUser.empty(uid);
    }

    return AppUser.fromFirestore(doc);
  }
}
