import 'package:cloud_firestore/cloud_firestore.dart';
import '../../../core/blockchain/certificate_hash_service.dart';
import '../../../core/security/fraud_engine.dart';
import 'verification_response.dart';

class VerificationAPI {
  final FirebaseFirestore _db = FirebaseFirestore.instance;

  final CertificateHashService _hashService = CertificateHashService();
  final FraudEngine _fraudEngine = FraudEngine();

  /// 🌍 VERIFY CERTIFICATE GLOBALLY
  Future<VerificationResponse> verifyCertificate(String certificateId) async {

    final doc = await _db.collection('certificates').doc(certificateId).get();

    if (!doc.exists) {
      return VerificationResponse(
        valid: false,
        fraudDetected: true,
        trustScore: 0,
        message: 'Certificate not found',
      );
    }

    final data = doc.data()!;

    // 🔐 HASH VALIDATION
    final hashValid = _hashService.verifyHash(
      expectedHash: data['hash'],
      userId: data['userId'],
      courseId: data['courseId'],
      certificateId: certificateId,
      issuedAt: DateTime.parse(data['issuedAt']),
    );

    // 🧠 FRAUD ANALYSIS
    final fraud = _fraudEngine.analyze(
      certificateId: certificateId,
      userId: data['userId'],
      issuedAt: DateTime.parse(data['issuedAt']),
      existsInDatabase: true,
      hashValid: hashValid,
    );

    // 🚨 FINAL RESULT
    return VerificationResponse(
      valid: !fraud.isFraud && hashValid,
      fraudDetected: fraud.isFraud,
      trustScore: fraud.trustScore,
      message: fraud.isFraud
          ? 'Suspicious certificate detected'
          : 'Certificate verified successfully',
    );
  }
}






