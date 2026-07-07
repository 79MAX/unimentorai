class VerificationResultModel {
  final String status;
  final String certificateId;
  final int trustScore;
  final List<String> flags;
  final bool isBlockchainValid;

  VerificationResultModel({
    required this.status,
    required this.certificateId,
    required this.trustScore,
    required this.flags,
    required this.isBlockchainValid,
  });

  factory VerificationResultModel.fromMap(Map<String, dynamic> map) => VerificationResultModel(
      status: map['status'],
      certificateId: map['certificateId'] ?? '',
      trustScore: map['trustScore'] ?? 0,
      flags: List<String>.from(map['flags'] ?? []),
      isBlockchainValid: map['isBlockchainValid'] ?? false,
    );
}




