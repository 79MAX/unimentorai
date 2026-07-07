class PaymentModel {
  final String id;
  final String userId;
  final String courseId;
  final double amount;
  final String currency; // USD / XOF
  final String method; // stripe / paypal / mtn / orange / moov
  final String status; // pending / success / failed
  final DateTime createdAt;

  PaymentModel({
    required this.id,
    required this.userId,
    required this.courseId,
    required this.amount,
    required this.currency,
    required this.method,
    required this.status,
    required this.createdAt,
  });

  factory PaymentModel.fromMap(String id, Map<String, dynamic> data) => PaymentModel(
      id: id,
      userId: data['userId'] ?? '',
      courseId: data['courseId'] ?? '',
      amount: (data['amount'] ?? 0).toDouble(),
      currency: data['currency'] ?? 'USD',
      method: data['method'] ?? 'stripe',
      status: data['status'] ?? 'pending',
      createdAt: DateTime.tryParse(data['createdAt'] ?? '') ?? DateTime.now(),
    );

  Map<String, dynamic> toMap() => {
      'userId': userId,
      'courseId': courseId,
      'amount': amount,
      'currency': currency,
      'method': method,
      'status': status,
      'createdAt': createdAt.toIso8601String(),
    };
}
