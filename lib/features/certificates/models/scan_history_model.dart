class ScanHistoryModel {
  final String id;
  final String certificateId;
  final DateTime scannedAt;
  final String scannedBy;
  final bool verified;

  const ScanHistoryModel({
    required this.id,
    required this.certificateId,
    required this.scannedAt,
    required this.scannedBy,
    required this.verified,
  });

  factory ScanHistoryModel.empty() => ScanHistoryModel(
    id: '',
    certificateId: '',
    scannedAt: DateTime.now(),
    scannedBy: '',
    verified: false,
  );
}

