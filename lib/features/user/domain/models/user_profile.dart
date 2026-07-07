class UserProfile {
  final String uid;
  final String email;
  final String role;
  final bool emailVerified;
  final bool onboardingCompleted;
  final bool premium;

  const UserProfile({
    required this.uid,
    required this.email,
    required this.role,
    required this.emailVerified,
    required this.onboardingCompleted,
    required this.premium,
  });

  const UserProfile.empty()
      : uid = '',
        email = '',
        role = 'guest',
        emailVerified = false,
        onboardingCompleted = false,
        premium = false;

  bool get isAdmin => role == 'admin';
  bool get isPremium => premium;

  bool get isGuest => role == 'guest';
}
