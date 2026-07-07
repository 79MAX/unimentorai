redirect: (context, state) String? async {
  final user = FirebaseAuth.instance.currentUser;

  final isLogin = state.matchedLocation == '/login';
  final isSignup = state.matchedLocation == '/signup';
  final isOnboarding = state.matchedLocation == '/onboarding';

  // 🔴 NOT LOGGED IN → FORCE LOGIN
  if (user == null) {
    return (isLogin || isSignup) ? null : '/login';
  }

  // 🟡 FETCH USER FROM FIRESTORE
  final doc = await FirebaseFirestore.instance
      .collection('users')
      .doc(user.uid)
      .get();

  final appUser = doc.exists
      ? AppUser.fromFirestore(doc)
      : AppUser.empty(user.uid);

  // 🔵 ONBOARDING NOT COMPLETED
  if (!appUser.onboardingCompleted) {
    return isOnboarding ? null : '/onboarding';
  }

  // 🟢 PREMIUM LOGIC (FUTURE PAYWALL READY)
  if (!appUser.isPremium) {
    // free user stays in home but limited features later
    return isLogin || isSignup ? '/home' : null;
  }

  // 🔥 PREMIUM USER FULL ACCESS
  return (isLogin || isSignup || isOnboarding) ? '/home' : null;
},