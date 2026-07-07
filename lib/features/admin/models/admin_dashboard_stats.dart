class AdminDashboardStats {
  final int totalUsers;
  final int activeUsers;
  final int premiumUsers;
  final int onboardingCompletedUsers;
  final int totalCourses;
  final double revenue;

  const AdminDashboardStats({
    required this.totalUsers,
    required this.activeUsers,
    required this.premiumUsers,
    required this.onboardingCompletedUsers,
    required this.totalCourses,
    required this.revenue,
  });

  /// EMPTY STATE
  factory AdminDashboardStats.empty() => const AdminDashboardStats(
      totalUsers: 0,
      activeUsers: 0,
      premiumUsers: 0,
      onboardingCompletedUsers: 0,
      totalCourses: 0,
      revenue: 0,
    );

  /// FIRESTORE / API -> OBJECT
  factory AdminDashboardStats.fromMap(Map<String, dynamic> map) => AdminDashboardStats(
      totalUsers: (map['totalUsers'] ?? 0) as int,
      activeUsers: (map['activeUsers'] ?? 0) as int,
      premiumUsers: (map['premiumUsers'] ?? 0) as int,
      onboardingCompletedUsers:
          (map['onboardingCompletedUsers'] ?? 0) as int,
      totalCourses: (map['totalCourses'] ?? 0) as int,
      revenue: (map['revenue'] ?? 0).toDouble(),
    );

  /// OBJECT -> FIRESTORE / API
  Map<String, dynamic> toMap() => {
      'totalUsers': totalUsers,
      'activeUsers': activeUsers,
      'premiumUsers': premiumUsers,
      'onboardingCompletedUsers': onboardingCompletedUsers,
      'totalCourses': totalCourses,
      'revenue': revenue,
    };

  /// IMMUTABLE UPDATE
  AdminDashboardStats copyWith({
    int? totalUsers,
    int? activeUsers,
    int? premiumUsers,
    int? onboardingCompletedUsers,
    int? totalCourses,
    double? revenue,
  }) => AdminDashboardStats(
      totalUsers: totalUsers ?? this.totalUsers,
      activeUsers: activeUsers ?? this.activeUsers,
      premiumUsers: premiumUsers ?? this.premiumUsers,
      onboardingCompletedUsers:
          onboardingCompletedUsers ?? this.onboardingCompletedUsers,
      totalCourses: totalCourses ?? this.totalCourses,
      revenue: revenue ?? this.revenue,
    );

  /// ===== KPI =====

  double get premiumRate =>
      totalUsers == 0 ? 0 : (premiumUsers / totalUsers) * 100;

  double get activeRate =>
      totalUsers == 0 ? 0 : (activeUsers / totalUsers) * 100;

  double get onboardingRate =>
      totalUsers == 0
          ? 0
          : (onboardingCompletedUsers / totalUsers) * 100;

  /// ARRONDI POUR UI
  String get premiumRateLabel =>
      '${premiumRate.toStringAsFixed(1)}%';

  String get activeRateLabel =>
      '${activeRate.toStringAsFixed(1)}%';

  String get onboardingRateLabel =>
      '${onboardingRate.toStringAsFixed(1)}%';

  /// BUSINESS INTELLIGENCE

  bool get isGrowing => activeRate >= 40;

  bool get hasStrongPremiumBase => premiumRate >= 20;

  bool get onboardingHealthy => onboardingRate >= 70;

  @override
  String toString() => '''
AdminDashboardStats(
totalUsers: $totalUsers,
activeUsers: $activeUsers,
premiumUsers: $premiumUsers,
onboardingCompletedUsers: $onboardingCompletedUsers,
totalCourses: $totalCourses,
revenue: $revenue
)
''';
}




