class UserProfile {
final String uid;
final String email;
final String displayName;
final String role;

final bool emailVerified;
final bool onboardingCompleted;
final bool premium;

final DateTime? createdAt;
final DateTime? updatedAt;

const UserProfile({
required this.uid,
required this.email,
required this.displayName,
required this.role,
required this.emailVerified,
required this.onboardingCompleted,
required this.premium,
this.createdAt,
this.updatedAt,
});

factory UserProfile.empty() => const UserProfile(
uid: '',
email: '',
displayName: '',
role: 'guest',
emailVerified: false,
onboardingCompleted: false,
premium: false,
);

bool get isAdmin => role == 'admin';

bool get isMentor => role == 'mentor';

bool get isAuthenticated => uid.isNotEmpty;

UserProfile copyWith({
String? uid,
String? email,
String? displayName,
String? role,
bool? emailVerified,
bool? onboardingCompleted,
bool? premium,
DateTime? createdAt,
DateTime? updatedAt,
}) => UserProfile(
uid: uid ?? this.uid,
email: email ?? this.email,
displayName: displayName ?? this.displayName,
role: role ?? this.role,
emailVerified: emailVerified ?? this.emailVerified,
onboardingCompleted:
onboardingCompleted ?? this.onboardingCompleted,
premium: premium ?? this.premium,
createdAt: createdAt ?? this.createdAt,
updatedAt: updatedAt ?? this.updatedAt,
);

factory UserProfile.fromMap(
Map<String, dynamic> map,
) => UserProfile(
uid: map['uid'] ?? '',
email: map['email'] ?? '',
displayName: map['displayName'] ?? '',
role: map['role'] ?? 'user',
emailVerified: map['emailVerified'] ?? false,
onboardingCompleted:
map['onboardingCompleted'] ?? false,
premium: map['premium'] ?? false,
createdAt: map['createdAt'],
updatedAt: map['updatedAt'],
);

Map<String, dynamic> toMap() => {
'uid': uid,
'email': email,
'displayName': displayName,
'role': role,
'emailVerified': emailVerified,
'onboardingCompleted': onboardingCompleted,
'premium': premium,
'createdAt': createdAt,
'updatedAt': updatedAt,
};
}

