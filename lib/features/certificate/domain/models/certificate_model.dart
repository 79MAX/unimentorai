class CertificateModel {
  final String id;
  final String userId;
  final String courseId;
  final String courseTitle;
  final DateTime issuedAt;
  final String language;

  CertificateModel({
    required this.id,
    required this.userId,
    required this.courseId,
    required this.courseTitle,
    required this.issuedAt,
    required this.language,
  });

  Map<String, dynamic> toMap() => {
      'userId': userId,
      'courseId': courseId,
      'courseTitle': courseTitle,
      'issuedAt': issuedAt.toIso8601String(),
      'language': language,
    };

  factory CertificateModel.fromMap(String id, Map<String, dynamic> data) => CertificateModel(
      id: id,
      userId: data['userId'] ?? '',
      courseId: data['courseId'] ?? '',
      courseTitle: data['courseTitle'] ?? '',
      issuedAt: DateTime.tryParse(data['issuedAt'] ?? '') ?? DateTime.now(),
      language: data['language'] ?? 'en',
    );
}
