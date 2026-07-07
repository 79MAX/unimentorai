import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';

import '../../user/services/user_service.dart';
import '../../user/models/app_user.dart';
import '../../dashboard/presentation/dashboard_screen.dart';
import 'login_screen.dart';
import '../../onboarding/onboarding_screen.dart';

class AuthWrapper extends StatefulWidget {
  const AuthWrapper({super.key});

  @override
  State<AuthWrapper> createState() => _AuthWrapperState();
}

class _AuthWrapperState extends State<AuthWrapper> {
  final UserService _userService = UserService();

  AppUser? _user;
  bool _loading = false;
  String? _lastUid;

  Future<void> _fetchUser(String uid) async {
    if (_loading || _lastUid == uid) return;

    _loading = true;
    _lastUid = uid;

    final user = await _userService.getUser(uid);

    if (!mounted) return;

    setState(() {
      _user = user;
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) => StreamBuilder<User?>(
      stream: FirebaseAuth.instance.authStateChanges(),
      builder: (context, snapshot) {
        final firebaseUser = snapshot.data;

        // 🔴 Not logged in
        if (firebaseUser == null) {
          _user = null;
          _lastUid = null;
          return const LoginScreen();
        }

        // 🔄 Load user once
        if (_user == null || _lastUid != firebaseUser.uid) {
          _fetchUser(firebaseUser.uid);

          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        final user = _user!;

        // onboarding
        if (!user.onboardingCompleted) {
          return const OnboardingScreen();
        }

        // role routing
        if (user.role == 'admin') {
          return const DashboardScreen();
        }

        return const DashboardScreen();
      },
    );
}