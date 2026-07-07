/// Résultat d’une opération de paiement (partagé entre services sans dépendre de Riverpod).
class PaymentResult {
  final bool isSuccess;
  final String? transactionId;
  final String? error;

  /// PayPal : `completePayPalPaymentInApp` ou capture serveur.
  final String? paypalApproveUrl;

  const PaymentResult({
    required this.isSuccess,
    this.transactionId,
    this.error,
    this.paypalApproveUrl,
  });

  bool get requiresPayPalBrowserApproval =>
      paypalApproveUrl != null &&
      paypalApproveUrl!.isNotEmpty &&
      transactionId != null &&
      transactionId!.isNotEmpty;
}




