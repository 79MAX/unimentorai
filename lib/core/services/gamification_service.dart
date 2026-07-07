import 'package:cloud_firestore/cloud_firestore.dart';

class GamificationService {
  final _db = FirebaseFirestore.instance;

  // Attribuer un badge à un utilisateur
  Future<void> addBadgeToUser({
    required String userId,
    required String badgeId,
    required String motif,
    String? source,
  }) async {
    await _db.collection('user_badges').add({
      'userId': userId,
      'badgeId': badgeId,
      'motif': motif,
      'source': source ?? '',
      'date': FieldValue.serverTimestamp(),
    });
  }

  // Attribuer un certificat à un utilisateur
  Future<void> addCertificateToUser({
    required String userId,
    required String certificateId,
    required String motif,
    String? sessionId,
  }) async {
    await _db.collection('user_certificates').add({
      'userId': userId,
      'certificateId': certificateId,
      'motif': motif,
      'sessionId': sessionId ?? '',
      'date': FieldValue.serverTimestamp(),
    });
  }

  // Récupérer les badges d’un utilisateur
  Stream<QuerySnapshot> getUserBadges(String userId) => _db.collection('user_badges').where('userId', isEqualTo: userId).orderBy('date', descending: true).snapshots();

  // Récupérer les certificats d’un utilisateur
  Stream<QuerySnapshot> getUserCertificates(String userId) => _db.collection('user_certificates').where('userId', isEqualTo: userId).orderBy('date', descending: true).snapshots();
} 




