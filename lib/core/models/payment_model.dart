import 'package:equatable/equatable.dart';
import 'package:freezed_annotation/freezed_annotation.dart';

part 'payment_model.g.dart';
part 'payment_model.freezed.dart';

/// Modèle de paiement sécurisé
@freezed
class PaymentModel with _$PaymentModel, EquatableMixin {
  const factory PaymentModel({
    required String id,
    required String userId,
    required double amount,
    required String currency,
    required PaymentMethod method,
    required PaymentStatus status,
    required DateTime createdAt,
    String? transactionId,
    String? description,
    Map<String, dynamic>? metadata,
    DateTime? completedAt,
    String? errorMessage,
  }) = _PaymentModel;

  const PaymentModel._();

  factory PaymentModel.fromJson(Map<String, dynamic> json) => _$PaymentModelFromJson(json);

  bool get isCompleted => status == PaymentStatus.completed;
  bool get isPending => status == PaymentStatus.pending;
  bool get isFailed => status == PaymentStatus.failed;

  @override
  List<Object?> get props => [
    id, userId, amount, currency, method, status, createdAt,
    transactionId, description, metadata, completedAt, errorMessage
  ];
}

/// Modèle d'abonnement
@freezed
class SubscriptionModel with _$SubscriptionModel, EquatableMixin {
  const factory SubscriptionModel({
    required String id,
    required String userId,
    required SubscriptionType type,
    required SubscriptionStatus status,
    required DateTime startDate,
    required DateTime endDate,
    required double amount,
    required String currency,
    required PaymentMethod paymentMethod,
    required Map<String, dynamic> metadata,
    required DateTime createdAt,
    DateTime? updatedAt,
    String? transactionId,
    bool? autoRenew,
  }) = _SubscriptionModel;

  const SubscriptionModel._();

  factory SubscriptionModel.fromJson(Map<String, dynamic> json) => _$SubscriptionModelFromJson(json);

  bool get isActive => status == SubscriptionStatus.active;
  bool get isExpired => DateTime.now().isAfter(endDate);
  Duration get remainingDuration => endDate.difference(DateTime.now());

  @override
  List<Object?> get props => [
    id, userId, type, status, startDate, endDate, amount,
    currency, paymentMethod, metadata, createdAt, updatedAt,
    transactionId, autoRenew
  ];
}

/// Méthode de paiement
@JsonEnum()
enum PaymentMethod {
  @JsonValue('stripe')
  stripe,
  @JsonValue('paypal')
  paypal,
  @JsonValue('kkiapay')
  kkiapay,
  @JsonValue('wise')
  wise,
}

/// Statut de paiement
@JsonEnum()
enum PaymentStatus {
  @JsonValue('pending')
  pending,
  @JsonValue('processing')
  processing,
  @JsonValue('completed')
  completed,
  @JsonValue('failed')
  failed,
  @JsonValue('refunded')
  refunded,
}

/// Type d'abonnement
@JsonEnum()
enum SubscriptionType {
  @JsonValue('free')
  free,
  @JsonValue('premium')
  premium,
  @JsonValue('pro')
  pro,
  @JsonValue('enterprise')
  enterprise,
}

/// Statut d'abonnement
@JsonEnum()
enum SubscriptionStatus {
  @JsonValue('pending')
  pending,
  @JsonValue('active')
  active,
  @JsonValue('cancelled')
  cancelled,
  @JsonValue('expired')
  expired,
  @JsonValue('suspended')
  suspended,
}










