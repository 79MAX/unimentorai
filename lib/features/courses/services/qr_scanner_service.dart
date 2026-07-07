import 'package:cloud_firestore/cloud_firestore.dart';
import '../../../core/blockchain/certificate_hash_service.dart';
import '../../../core/security/fraud_engine.dart';

class QRScannerService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;
  final CertificateHashService _hashService = CertificateHashService();
  final FraudEngine _fraudEngine = FraudEngine();

  Future<Map<String, dynamic>> verifyCertificateById(String certificateId) async {

    final doc = await _db.collection('certificates').doc(certificateId).get();

    if (!doc.exists) {
      return {
        'valid': false,
        'fraud': true,
        'message': 'Certificate not found',
      };
    }

    final data = doc.data()!;

    final hashValid = _hashService.verifyHash(
      expectedHash: data['hash'],
      userId: data['userId'],
      courseId: data['courseId'],
      certificateId: certificateId,
      issuedAt: DateTime.parse(data['issuedAt']),
    );

    final fraud = _fraudEngine.analyze(
      certificateId: certificateId,
      userId: data['userId'],
      issuedAt: DateTime.parse(data['issuedAt']),
      existsInDatabase: true,
      hashValid: hashValid,
    );

    return {
      'valid': !fraud.isFraud && hashValid,
      'fraud': fraud.isFraud,
      'trustScore': fraud.trustScore,
      'data': data,
    };
  }
}






