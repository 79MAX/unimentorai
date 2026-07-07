import 'dart:convert';
import 'package:crypto/crypto.dart';

class BlockchainHashEngine {

  /// GENERATE UNIQUE CERTIFICATE HASH
  static String generateCertificateHash({
    required String userId,
    required String certificateId,
    required String courseId,
    required DateTime issuedAt,
    required String secretKey,
  }) {
    final payload = {
      'userId': userId,
      'certificateId': certificateId,
      'courseId': courseId,
      'issuedAt': issuedAt.toIso8601String(),
      'secretKey': secretKey,
    };

    final jsonString = jsonEncode(payload);

    final bytes = utf8.encode(jsonString);
    final digest = sha256.convert(bytes);

    return digest.toString();
  }

  /// SIMULATED BLOCKCHAIN SIGNATURE LAYER V1
  static String signHash(String hash, String networkKey) {
    final combined = '$hash:$networkKey';
    final bytes = utf8.encode(combined);
    return sha256.convert(bytes).toString();
  }

  /// VERIFY INTEGRITY
  static bool verifyHash({
    required String originalHash,
    required String currentHash,
  }) => originalHash == currentHash;
}




