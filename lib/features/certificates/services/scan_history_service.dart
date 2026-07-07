import 'package:cloud_firestore/cloud_firestore.dart';
import 'models/scan_history_model.dart';

class ScanHistoryServices {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  /// 💾 SAVE SCAN
  Future<void> saveScan({
    required String userId,
    required String certificateId,
    required String status,
    required String courseName,
  }) async {

    final scan = ScanHistoryModel(
      userId: userId,
      certificateId: certificateId,
      status: status,
      courseName: courseName,
    );

    await _firestore
        .collection('scan_history')
        .add(scan.toMap());
  }

  /// 📊 GET HISTORY USER
  Stream<QuerySnapshot> getUserHistory(String userId) => _firestore
        .collection('scan_history')
        .where('userId', isEqualTo: userId)
        .orderBy('scannedAt', descending: true)
        .snapshots();
}




