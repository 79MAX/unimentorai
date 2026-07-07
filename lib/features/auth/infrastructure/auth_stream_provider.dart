import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_auth/firebase_auth.dart';

/// =====================================================
/// AUTH STATE PROVIDER (SAAS SOURCE OF TRUTH)
/// =====================================================
/// 👉 Reactive Firebase auth stream
/// 👉 Safe for GoRouter + web + mobile
/// 👉 No manual currentUser usage required
final authStateProvider = StreamProvider<User?>((ref) {
  final auth = FirebaseAuth.instance;

  return auth
      .authStateChanges()
      .handleError((error) {
        // 🔥 Prevent silent stream crash (important web fix)
        throw Exception('Auth stream error: $error');
      });
});
