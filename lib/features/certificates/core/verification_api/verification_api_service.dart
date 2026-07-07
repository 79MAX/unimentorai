import 'package:cloud_firestore/cloud_firestore.dart';
import '../../../../core/blockchain/blockchain_hash_engine.dart';
import '../../../../core/security/fraud_engine.dart';

class VerificationApiService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  /// GLOBAL VERIFICATION ENTRY POINT
  Future<Map<String, dynamic>> verifyCertificate({
    required String certificateId,
    required String providedHash,
  }) async {

    try {
      final doc = await _firestore
          .collection('certificates')
          .doc(certificateId)
          .get();

      if (!doc.exists) {
        return {
          'status': 'invalid',
          'reason': 'CERTIFICATE_NOT_FOUND'
        };
      }

      final data = doc.data()!;

      final storedHash = data['hash'];
      final isBlockchainValid = BlockchainHashEngine.verifyHash(
        originalHash: storedHash,
        currentHash: providedHash,
      );

      final fraudCheck = FraudDetectionEngine.analyze(
        certificateId: certificateId,
        userId: data['userId'],
        qrHash: providedHash,
        issuedAt: DateTime.parse(data['issuedAt']),
        scanHistory: List<String>.from(data['scanHistory'] ?? []),
        isBlockchainValid: isBlockchainValid,
      );

      return {
        'status': fraudCheck.isTrusted ? 'valid' : 'suspicious',
        'certificateId': certificateId,
        'userId': data['userId'],
        'courseId': data['courseId'],
        'trustScore': fraudCheck.score,
        'flags': fraudCheck.flags,
        'isBlockchainValid': isBlockchainValid,
      };

    } catch (e) {
      return {
        'status': 'error',
        'message': e.toString()
      };
    }
  }
}






