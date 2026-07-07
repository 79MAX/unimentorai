class CertificateHashModel {
  final String certificateId;
  final String userId;
  final String hash;
  final String signature;
  final DateTime createdAt;

  CertificateHashModel({
    required this.certificateId,
    required this.userId,
    required this.hash,
    required this.signature,
    required this.createdAt,
  });

  Map<String, dynamic> toMap() => {
      'certificateId': certificateId,
      'userId': userId,
      'hash': hash,
      'signature': signature,
      'createdAt': createdAt.toIso8601String(),
    };
}




