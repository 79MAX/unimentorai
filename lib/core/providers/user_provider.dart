import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../features/user/models/app_user.dart';
import '../../features/auth/services/auth_service.dart';

/// 🔥 GLOBAL USER STATE (SINGLE SOURCE OF TRUTH)
final authServiceProvider = Provider<AuthService>((ref) => AuthService());

final userStreamProvider = StreamProvider<AppUser?>((ref) {
  final authService = ref.read(authServiceProvider);
  return authService.userStream;
});

final currentUserProvider = Provider<AppUser?>((ref) {
  final asyncUser = ref.watch(userStreamProvider);
  return asyncUser.when(
    data: (user) => user,
    loading: () => null,
    error: (_, __) => null,
  );
});
