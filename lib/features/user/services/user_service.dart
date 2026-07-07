import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/user_model.dart';

class UserService {
  UserService({FirebaseFirestore? db})
      : _db = db ?? FirebaseFirestore.instance;

  final FirebaseFirestore _db;

  CollectionReference<Map<String, dynamic>> get _users =>
      _db.collection('users');

  /// 🔁 REALTIME USER STREAM (SAFE + CLEAN)
  Stream<AppUser?> watchUser(String uid) => _users.doc(uid).snapshots().map((doc) {
      if (!doc.exists || doc.data() == null) return null;
      return AppUser.fromFirestore(doc);
    }).handleError((_) => null);

  /// 👤 GET USER ONCE (SAFE)
  Future<AppUser?> getUser(String uid) async {
    try {
      final doc = await _users.doc(uid).get();
      if (!doc.exists || doc.data() == null) return null;

      return AppUser.fromFirestore(doc);
    } catch (_) {
      return null;
    }
  }

  /// 🆕 CREATE USER IF NOT EXISTS (ATOMIC SAFE)
  Future<void> createUserIfNotExists(AppUser user) async {
    final ref = _users.doc(user.uid);

    await _db.runTransaction((transaction) async {
      final snapshot = await transaction.get(ref);

      if (!snapshot.exists) {
        transaction.set(ref, user.toMap());
      }
    });
  }

  /// 🔄 UPDATE USER SAFE
  Future<void> updateUser(AppUser user) async {
    await _users.doc(user.uid).update(user.toMap());
  }

  /// 🧠 CHECK EXISTENCE FAST
  Future<bool> userExists(String uid) async {
    final doc = await _users.doc(uid).get();
    return doc.exists;
  }
}



