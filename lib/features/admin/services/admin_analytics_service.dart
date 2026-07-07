import 'package:cloud_firestore/cloud_firestore.dart';

class AdminAnalyticsService {
  AdminAnalyticsService({FirebaseFirestore? db})
      : _db = db ?? FirebaseFirestore.instance;

  final FirebaseFirestore _db;

  /// 👥 TOTAL USERS
  Stream<int> watchTotalUsers() => _db
        .collection('users')
        .snapshots()
        .map((snap) => snap.size)
        .handleError((_) => 0);

  /// 📚 TOTAL COURSES
  Stream<int> watchTotalCourses() => _db
        .collection('courses')
        .snapshots()
        .map((snap) => snap.size)
        .handleError((_) => 0);

  /// 💰 REVENUE (mock safe → Stripe later)
  Stream<double> watchRevenue() => Stream.periodic(
      const Duration(seconds: 3),
      (i) => 1250 + (i * 42.5),
    ).handleError((_) => 0.0);

  /// 📈 ACTIVE USERS (last 7 days)
  Stream<int> watchActiveUsers() {
    final cutoff = DateTime.now().subtract(const Duration(days: 7));

    return _db
        .collection('users')
        .where('lastActive', isGreaterThan: cutoff)
        .snapshots()
        .map((snap) => snap.size)
        .handleError((_) => 0);
  }

  /// 🔥 BONUS: HEALTH CHECK ADMIN (future AI monitoring)
  Stream<bool> watchSystemHealth() => Stream.periodic(
      const Duration(seconds: 10),
      (_) => true,
    );
}




