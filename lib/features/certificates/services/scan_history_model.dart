/// Model for certificate scan history
class ScanHistoryModel {
  final String scanId;
  final String certificateId;
  final DateTime scannedAt;
  final bool verified;

  ScanHistoryModel({
    required this.scanId,
    required this.certificateId,
    required this.scannedAt,
    required this.verified,
  });

  factory ScanHistoryModel.empty() => ScanHistoryModel(
    scanId: '',
    certificateId: '',
    scannedAt: DateTime.now(),
    verified: false,
  );
}

