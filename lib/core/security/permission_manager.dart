import '../../features/user/models/app_user.dart';

enum Permission {
  viewDashboard,
  accessAdminPanel,
  manageUsers,
  manageCourses,
  viewAnalytics,
  editProfile,
  accessPremiumContent,
}

class PermissionManager {
  PermissionManager(this._user);

  final AppUser? _user;

  // =========================
  // 👤 USER STATE
  // =========================

  bool get isLoggedIn => _user != null;

  String get role => _user?.role ?? 'guest';

  bool get isAdmin => role == 'admin';
  bool get isMentor => role == 'mentor';
  bool get isStudent => role == 'student';

  bool get isPremiumUser => _user?.isPremium == true;

  // =========================
  // 🔐 CORE POLICY ENGINE
  // =========================

  bool has(Permission p) {
    if (!isLoggedIn) return false;

    switch (p) {
      // 🔴 ADMIN ONLY
      case Permission.accessAdminPanel:
      case Permission.manageUsers:
      case Permission.manageCourses:
      case Permission.viewAnalytics:
        return isAdmin;

      // 🟡 MENTOR + ADMIN
      case Permission.editProfile:
        return isMentor || isAdmin;

      // 🟢 ALL AUTH USERS
      case Permission.viewDashboard:
        return true;

      // 💎 PREMIUM LOGIC
      case Permission.accessPremiumContent:
        return isPremiumUser || isAdmin;
    }
  }

  // =========================
  // 🚀 FEATURE SHORTCUTS
  // =========================

  bool get canViewDashboard => has(Permission.viewDashboard);

  bool get canAccessAdmin => has(Permission.accessAdminPanel);

  bool get canManageUsers => has(Permission.manageUsers);

  bool get canManageCourses => has(Permission.manageCourses);

  bool get canViewAnalytics => has(Permission.viewAnalytics);

  bool get canEditProfile => has(Permission.editProfile);

  bool get canAccessPremium => has(Permission.accessPremiumContent);

  // =========================
  // 🧠 USER CAPABILITIES MAP (SAAS READY)
  // =========================

  Map<String, bool> get capabilities => {
        'dashboard': canViewDashboard,
        'admin': canAccessAdmin,
        'users': canManageUsers,
        'courses': canManageCourses,
        'analytics': canViewAnalytics,
        'profile': canEditProfile,
        'premium': canAccessPremium,
      };

  // =========================
  // 📦 ROLE PERMISSION SET (OPTIMIZED)
  // =========================

  List<Permission> get permissions {
    if (!isLoggedIn) return [];

    if (isAdmin) return Permission.values;

    if (isMentor) {
      return [
        Permission.viewDashboard,
        Permission.editProfile,
        Permission.accessPremiumContent,
      ];
    }

    if (isStudent) {
      return [
        Permission.viewDashboard,
        Permission.accessPremiumContent,
      ];
    }

    return [];
  }

  // =========================
  // 💎 PREMIUM ACCESS RULE
  // =========================

  bool get canAccessPremiumFeature =>
      isLoggedIn && (isPremiumUser || isAdmin);
}




