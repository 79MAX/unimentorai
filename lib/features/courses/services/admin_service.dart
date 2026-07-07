class AdminService {
  static final AdminService _instance = AdminService._internal();
  factory AdminService() => _instance;
  AdminService._internal();

  Future<Map<String, dynamic>> getDashboardStats() async => {
    'totalUsers': 0,
    'activeUsers': 0,
    'revenue': 0.0,
  };

  Future<void> updateUserRole(String userId, String role) async {}
}

