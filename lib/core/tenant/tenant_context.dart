import 'package:firebase_auth/firebase_auth.dart';

/// Tenant B2B : `organizationId` issu des custom claims (source de vérité serveur).
/// `null` = parcours B2C / catalogue global.
class TenantContext {
  TenantContext._();

  /// Lit le claim `organizationId` du dernier jeton ID (sans logique métier côté Firestore user doc).
  static Future<String?> resolveOrganizationId() async {
    final user = FirebaseAuth.instance.currentUser;
    if (user == null) return null;
    final token = await user.getIdTokenResult();
    final raw = token.claims?['organizationId'];
    if (raw is String && raw.trim().isNotEmpty) {
      return raw.trim();
    }
    return null;
  }
}




