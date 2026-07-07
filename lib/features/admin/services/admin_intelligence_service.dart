import 'package:cloud_firestore/cloud_firestore.dart';

import '../models/admin_dashboard_stats.dart';

enum SystemHealthStatus {
  healthy,
  warning,
  critical,
}

class AdminIntelligenceService {
  AdminIntelligenceService({FirebaseFirestore? firestore})
      : _firestore = firestore ?? FirebaseFirestore.instance;

  final FirebaseFirestore _firestore;

  CollectionReference<Map<String, dynamic>> get _users =>
      _firestore.collection('users');

  CollectionReference<Map<String, dynamic>> get _courses =>
      _firestore.collection('courses');

  /// 🚀 SINGLE SOURCE OF TRUTH (PRO MAX)
  Stream<AdminDashboardStats> watchDashboardStats() => _firestore
        .collection('users')
        .snapshots()
        .asyncMap((usersSnap) async {
      final coursesSnap = await _courses.get();

      final users = usersSnap.docs;

      final now = DateTime.now();
      final cutoff = now.subtract(const Duration(days: 7));

      int activeUsers = 0;
      int premiumUsers = 0;
      int onboardingCompleted = 0;

      for (final doc in users) {
        final data = doc.data();

        // ACTIVE USERS
        final lastActive = data['lastActive'];
        if (lastActive is Timestamp &&
            lastActive.toDate().isAfter(cutoff)) {
          activeUsers++;
        }

        // PREMIUM USERS
        if (data['isPremium'] == true) {
          premiumUsers++;
        }

        // ONBOARDING
        if (data['onboardingCompleted'] == true) {
          onboardingCompleted++;
        }
      }

      final totalUsers = users.length;
      final totalCourses = coursesSnap.size;

      // 💰 placeholder revenue
      final revenue = premiumUsers * 9.99;

      return AdminDashboardStats(
        totalUsers: totalUsers,
        activeUsers: activeUsers,
        premiumUsers: premiumUsers,
        onboardingCompletedUsers: onboardingCompleted,
        totalCourses: totalCourses,
        revenue: revenue,
      );
    });

  /// ⚠️ SYSTEM HEALTH (derived from stats stream)
  Stream<SystemHealthStatus> watchSystemHealth() => watchDashboardStats().map((stats) {
      if (stats.totalUsers < 10) {
        return SystemHealthStatus.critical;
      }

      if (stats.totalUsers < 100) {
        return SystemHealthStatus.warning;
      }

      return SystemHealthStatus.healthy;
    });

  /// 🧠 INSIGHTS ENGINE (AI-ready logic layer)
  Stream<String> watchInsights() => watchDashboardStats().map((stats) {
      if (stats.totalUsers < 10) {
        return 'Growth is LOW → launch acquisition campaigns';
      }

      if (stats.activeRate < 30) {
        return 'Engagement is LOW → improve onboarding UX';
      }

      if (stats.premiumRate < 10) {
        return 'Monetization is LOW → optimize premium funnel';
      }

      return 'System is HEALTHY → scale infrastructure';
    });

  /// 💰 OPTIONAL REAL-TIME REVENUE ONLY (if needed separately)
  Stream<double> watchRevenueMock() => Stream.periodic(
      const Duration(seconds: 3),
      (i) => 1500 + (i * 42.0),
    );
}




