import '../../course/domain/models/course_model.dart';
import '../../user/models/app_user.dart';

class PaywallService {

  /// 🔥 CHECK IF USER CAN ACCESS COURSE
  bool canAccessCourse(AppUser user, CourseModel course) {

    // 🟢 ADMIN FULL ACCESS
    if (user.role == 'admin') return true;

    // 🟢 FREE COURSE
    if (!course.isPremium) return true;

    // 🔴 PREMIUM REQUIRED
    if (course.isPremium && user.isPremium) return true;

    return false;
  }

  /// 💰 COURSE LOCK STATUS
  bool isLocked(AppUser user, CourseModel course) => !canAccessCourse(user, course);

}
