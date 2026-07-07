import 'package:firebase_auth/firebase_auth.dart';

/// =====================================================
/// AUTH REPOSITORY CONTRACT
/// =====================================================
///
/// Couche Domain
/// Ne dépend pas de Firebase dans le reste de l'application.
///
/// Implémentations possibles :
/// - FirebaseAuthRepository
/// - MockAuthRepository
/// - ApiAuthRepository
///
abstract class AuthRepository {
/// Etat authentification
Stream<User?> authStateChanges();

/// Utilisateur connecté
User? currentUser();

/// Connexion email/password
Future<UserCredential> signIn({
required String email,
required String password,
});

/// Création compte
Future<UserCredential> signUp({
required String email,
required String password,
});

/// Déconnexion
Future<void> signOut();

/// Vérification email
Future<void> sendEmailVerification();

/// Réinitialisation mot de passe
Future<void> sendPasswordResetEmail(
String email,
);

/// Rechargement utilisateur
Future<void> reloadUser();

/// Suppression compte
Future<void> deleteAccount();
}

