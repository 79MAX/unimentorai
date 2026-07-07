import 'package:cloud_firestore/cloud_firestore.dart';
import '../../user/models/user_model.dart';

class AdminService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;

  /// 👥 GET ALL USERS
  Stream<List<AppUser>> getAllUsers() => _db.collection('users').snapshots().map((snapshot) => snapshot.docs.map(AppUser.fromFirestore).toList());

  /// 🎯 UPDATE USER ROLE
  Future<void> updateUserRole(String uid, String role) async {
    await _db.collection('users').doc(uid).update({
      'role': role,
    });
  }

  /// 🚀 TOGGLE PREMIUM
  Future<void> togglePremium(String uid, bool value) async {
    await _db.collection('users').doc(uid).update({
      'isPremium': value,
    });
  }

  /// 🧾 GET STATS
  Future<Map<String, int>> getStats() async {
    final users = await _db.collection('users').get();

    final int total = users.docs.length;
    final int admins = users.docs.where((u) => u['role'] == 'admin').length;
    final int students = users.docs.where((u) => u['role'] == 'student').length;

    return {
      'totalUsers': total,
      'admins': admins,
      'students': students,
    };
  }
}




