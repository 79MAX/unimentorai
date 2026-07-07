import 'dart:convert';
import 'package:crypto/crypto.dart';

class CertificateHashService {

  /// 🔐 Génère un hash unique pour un certificat
  String generateHash({
    required String userId,
    required String courseId,
    required String certificateId,
    required DateTime issuedAt,
  }) {
    final rawData = '$userId|$courseId|$certificateId|${issuedAt.toIso8601String()}';

    final bytes = utf8.encode(rawData);
    final digest = sha256.convert(bytes);

    return digest.toString();
  }

  /// 🔎 Vérifie si un hash correspond aux données
  bool verifyHash({
    required String expectedHash,
    required String userId,
    required String courseId,
    required String certificateId,
    required DateTime issuedAt,
  }) {
    final generatedHash = generateHash(
      userId: userId,
      courseId: courseId,
      certificateId: certificateId,
      issuedAt: issuedAt,
    );

    return generatedHash == expectedHash;
  }
}




