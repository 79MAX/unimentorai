/// Response model for certificate verification
class VerificationResponse {
  final bool isValid;
  final String certificateHash;
  final String message;
  final DateTime verifiedAt;

  VerificationResponse({
    required this.isValid,
    required this.certificateHash,
    required this.message,
    required this.verifiedAt,
  });

  factory VerificationResponse.empty() => VerificationResponse(
    isValid: false,
    certificateHash: '',
    message: 'Verification pending',
    verifiedAt: DateTime.now(),
  );

  factory VerificationResponse.valid(String hash) => VerificationResponse(
    isValid: true,
    certificateHash: hash,
    message: 'Certificate verified',
    verifiedAt: DateTime.now(),
  );

  Map<String, dynamic> toJson() => {
    'isValid': isValid,
    'certificateHash': certificateHash,
    'message': message,
    'verifiedAt': verifiedAt.toIso8601String(),
  };
}

