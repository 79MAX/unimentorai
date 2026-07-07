import 'package:cloud_firestore/cloud_firestore.dart';

class ScanHistoryModel {
  final String userId;
  final String certificateId;
  final String status;
  final String courseName;

  ScanHistoryModel({
    required this.userId,
    required this.certificateId,
    required this.status,
    required this.courseName,
  });

  Map<String, dynamic> toMap() => {
      'userId': userId,
      'certificateId': certificateId,
      'status': status,
      'courseName': courseName,
      'scannedAt': FieldValue.serverTimestamp(),
    };
}




