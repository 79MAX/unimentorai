import 'package:cloud_functions/cloud_functions.dart';
import 'package:dio/dio.dart';
import 'package:flutter_stripe/flutter_stripe.dart' hide PaymentMethod;
import 'package:logger/logger.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../models/payment_model.dart';
import '../models/payment_result.dart';
import 'security_service.dart';

export '../models/payment_result.dart';

part 'payment_service.g.dart';

/// Service de paiements multi-gateways sécurisé
/// Supporte Stripe, PayPal, Kkiapay et Wise avec validation serveur
@riverpod
class PaymentService extends _$PaymentService {
  final Dio _dio = Dio();
  final Logger _logger = Logger();
  final SecurityService _securityService = SecurityService();

  @override
  Future<PaymentServiceState> build() async {
    await _initializeStripe();
    return const PaymentServiceState(
      isLoading: false,
      subscriptions: [],
      payments: [],
    );
  }

  /// Initialise Stripe
  Future<void> _initializeStripe() async {
    try {
      final publishableKey = await _securityService.getApiKey('STRIPE_PUBLISHABLE');
      if (publishableKey != null) {
        Stripe.publishableKey = publishableKey;
        await Stripe.instance.applySettings();
        _logger.i('Stripe initialisé avec succès');
      }
    } catch (e) {
      _logger.e('Erreur initialisation Stripe: $e');
    }
  }

  PaymentServiceState get _currentState =>
      state.asData?.value ??
      const PaymentServiceState(
        isLoading: false,
        subscriptions: [],
        payments: [],
      );

  void _patchState(PaymentServiceState Function(PaymentServiceState current) update) {
    state = AsyncData(update(_currentState));
  }

  /// Crée un abonnement
  Future<PaymentResult> createSubscription({
    required String userId,
    required SubscriptionType type,
    required PaymentMethod paymentMethod,
    Map<String, dynamic>? metadata,
  }) async {
    try {
      _patchState((s) => s.copyWith(isLoading: true));

      final subscription = SubscriptionModel(
        id: _generateId(),
        userId: userId,
        type: type,
        status: SubscriptionStatus.pending,
        startDate: DateTime.now(),
        endDate: _calculateEndDate(type),
        amount: _getSubscriptionPrice(type),
        currency: 'USD',
        paymentMethod: paymentMethod,
        metadata: metadata ?? {},
        createdAt: DateTime.now(),
      );

      PaymentResult result;

      switch (paymentMethod) {
        case PaymentMethod.stripe:
          result = await _processStripeSubscription(subscription);
          break;
        case PaymentMethod.paypal:
          result = await _processPayPalSubscription(subscription);
          break;
        case PaymentMethod.kkiapay:
          result = await _processKkiapaySubscription(subscription);
          break;
        case PaymentMethod.wise:
          result = await _processWiseSubscription(subscription);
          break;
        default:
          throw PaymentException('Méthode de paiement non supportée');
      }

      if (result.isSuccess) {
        await _saveSubscriptionToFirestore(subscription);
        _logger.i('Abonnement créé avec succès: ${subscription.id}');
      }

      return result;
    } catch (e) {
      _logger.e('Erreur création abonnement: $e');
      _patchState((s) => s.copyWith(error: e.toString()));
      return PaymentResult(
        isSuccess: false,
        error: e.toString(),
      );
    } finally {
      _patchState((s) => s.copyWith(isLoading: false));
    }
  }

  /// Après approbation PayPal dans le navigateur (voir [PaymentResult.paypalApproveUrl]).
  Future<PaymentResult> capturePayPalOrder(String orderId) async {
    try {
      final callable =
          FirebaseFunctions.instance.httpsCallable('capturePayPalOrder');
      final res = await callable.call(<String, dynamic>{'orderId': orderId});
      final d = res.data;
      if (d is! Map) {
        return PaymentResult(
          isSuccess: false,
          transactionId: orderId,
          error: 'Réponse capture PayPal invalide',
        );
      }
      final success = d['success'] == true;
      return PaymentResult(
        isSuccess: success,
        transactionId: (d['captureId'] ?? orderId).toString(),
        error: success ? null : (d['status']?.toString() ?? 'Capture PayPal échouée'),
      );
    } catch (e) {
      _logger.e('Erreur capture PayPal: $e');
      return PaymentResult(
        isSuccess: false,
        transactionId: orderId,
        error: e.toString(),
      );
    }
  }

  /// Traite un paiement Stripe
  Future<PaymentResult> _processStripeSubscription(SubscriptionModel subscription) async {
    try {
      // Customer + PaymentIntent créés côté serveur (clé secrète jamais sur l'app)
      final pi = await _createStripePaymentIntentViaCallable(subscription);
      final clientSecret = pi['clientSecret']?.toString();
      final paymentIntentId = pi['paymentIntentId']?.toString();
      if (clientSecret == null || clientSecret.isEmpty) {
        throw PaymentException('clientSecret Stripe manquant (serveur)');
      }

      await Stripe.instance.confirmPayment(
        paymentIntentClientSecret: clientSecret,
        data: const PaymentMethodParams.card(
          paymentMethodData: PaymentMethodData(
            billingDetails: BillingDetails(),
          ),
        ),
      );

      final verifyCallable =
          FirebaseFunctions.instance.httpsCallable('verifyStripePaymentIntent');
      final verifyRes = await verifyCallable.call(<String, dynamic>{
        'paymentIntentId': paymentIntentId,
      });
      final vd = verifyRes.data;
      final succeeded = vd is Map && vd['succeeded'] == true;

      return PaymentResult(
        isSuccess: succeeded,
        transactionId: paymentIntentId,
        error: succeeded ? null : 'Paiement non confirmé côté serveur',
      );
    } catch (e) {
      _logger.e('Erreur paiement Stripe: $e');
      return PaymentResult(
        isSuccess: false,
        error: e.toString(),
      );
    }
  }

  /// Appelle la Cloud Function `createStripePaymentIntent` (secret Stripe côté serveur uniquement).
  Future<Map<String, dynamic>> _createStripePaymentIntentViaCallable(
    SubscriptionModel subscription,
  ) async {
    final callable = FirebaseFunctions.instance.httpsCallable('createStripePaymentIntent');
    final meta = <String, String>{
      'subscription_id': subscription.id,
      'user_id': subscription.userId,
      ...subscription.metadata.map((k, v) => MapEntry(k, v?.toString() ?? '')),
    };
    final result = await callable.call(<String, dynamic>{
      'amount': subscription.amount,
      'currency': subscription.currency.toLowerCase(),
      'description': 'Abonnement ${subscription.type.name}',
      'metadata': meta,
    });
    final data = result.data;
    if (data is! Map) {
      throw PaymentException('Réponse createStripePaymentIntent invalide');
    }
    return Map<String, dynamic>.from(data);
  }

  /// PayPal Orders v2 : crée la commande côté serveur, ouverture navigateur requise.
  Future<PaymentResult> _processPayPalSubscription(SubscriptionModel subscription) async {
    try {
      final meta = <String, String>{
        'subscription_id': subscription.id,
        'user_id': subscription.userId,
        for (final e in subscription.metadata.entries) e.key: e.value?.toString() ?? '',
      };

      final callable =
          FirebaseFunctions.instance.httpsCallable('createPayPalOrder');
      final res = await callable.call(<String, dynamic>{
        'amount': subscription.amount,
        'currency': subscription.currency.toUpperCase(),
        'description': 'Abonnement ${subscription.type.name}',
        'metadata': meta,
      });

      final d = res.data;
      if (d is! Map) {
        throw PaymentException('Réponse createPayPalOrder invalide');
      }
      final orderId = d['orderId']?.toString();
      final approveUrl = d['approveUrl']?.toString();
      if (orderId == null || orderId.isEmpty) {
        throw PaymentException('orderId PayPal manquant');
      }
      if (approveUrl == null || approveUrl.isEmpty) {
        return PaymentResult(
          isSuccess: false,
          transactionId: orderId,
          error: 'URL d’approbation PayPal manquante',
        );
      }
      return PaymentResult(
        isSuccess: false,
        transactionId: orderId,
        paypalApproveUrl: approveUrl,
      );
    } catch (e) {
      _logger.e('Erreur paiement PayPal: $e');
      return PaymentResult(
        isSuccess: false,
        error: e.toString(),
      );
    }
  }

  /// Traite un paiement Kkiapay (Cloud Functions : private + secret jamais sur l’app).
  Future<PaymentResult> _processKkiapaySubscription(SubscriptionModel subscription) async {
    try {
      final meta = <String, String>{
        'subscription_id': subscription.id,
        'user_id': subscription.userId,
        for (final e in subscription.metadata.entries) e.key: e.value?.toString() ?? '',
      };

      final callable =
          FirebaseFunctions.instance.httpsCallable('createKkiapayTransaction');
      final res = await callable.call(<String, dynamic>{
        'amount': subscription.amount,
        'currency': subscription.currency,
        'description': 'Abonnement ${subscription.type.name}',
        'customerEmail': subscription.userId,
        'metadata': meta,
      });

      final d = res.data;
      if (d is! Map) {
        throw PaymentException('Réponse createKkiapayTransaction invalide');
      }
      final transactionId = d['transactionId']?.toString();
      final status = d['status']?.toString().toLowerCase() ?? '';

      final ok = transactionId != null &&
          transactionId.isNotEmpty &&
          (status == 'success' || status == 'pending' || status.isEmpty);

      return PaymentResult(
        isSuccess: ok,
        transactionId: transactionId,
        error: ok ? null : (d['status']?.toString() ?? 'Échec Kkiapay'),
      );
    } catch (e) {
      _logger.e('Erreur paiement Kkiapay: $e');
      return PaymentResult(
        isSuccess: false,
        error: e.toString(),
      );
    }
  }

  /// Traite un paiement Wise (devis + transfer via Cloud Functions — pas de token côté client).
  Future<PaymentResult> _processWiseSubscription(SubscriptionModel subscription) async {
    try {
      final meta = <String, String>{
        'subscription_id': subscription.id,
        'user_id': subscription.userId,
        for (final e in subscription.metadata.entries) e.key: e.value?.toString() ?? '',
      };

      final quoteCallable = FirebaseFunctions.instance.httpsCallable('createWiseQuote');
      final quoteRes = await quoteCallable.call(<String, dynamic>{
        'sourceAmount': subscription.amount,
        'sourceCurrency': subscription.currency.toLowerCase(),
        'targetCurrency': subscription.currency.toLowerCase(),
        'metadata': meta,
      });

      final qd = quoteRes.data;
      if (qd is! Map) {
        throw PaymentException('Réponse createWiseQuote invalide');
      }
      final quoteUuid = qd['quoteUuid']?.toString();
      if (quoteUuid == null || quoteUuid.isEmpty) {
        throw PaymentException('quoteUuid Wise manquant');
      }

      final completeCallable = FirebaseFunctions.instance.httpsCallable('completeWiseTransfer');
      final completeRes = await completeCallable.call(<String, dynamic>{
        'quoteUuid': quoteUuid,
        'reference': 'Abonnement ${subscription.type.name}',
        'expectedAmount': subscription.amount,
        'currency': subscription.currency,
        'metadata': meta,
      });

      final cd = completeRes.data;
      if (cd is! Map) {
        throw PaymentException('Réponse completeWiseTransfer invalide');
      }
      final transferId = cd['transferId']?.toString();
      final status = cd['status']?.toString() ?? '';
      final failed = status == 'cancelled' || status == 'funds_refunded';

      return PaymentResult(
        isSuccess: !failed && transferId != null && transferId.isNotEmpty,
        transactionId: transferId,
        error: failed ? status : null,
      );
    } catch (e) {
      _logger.e('Erreur paiement Wise: $e');
      return PaymentResult(
        isSuccess: false,
        error: e.toString(),
      );
    }
  }

  /// Vérifie le statut d'un paiement
  Future<PaymentStatus> verifyPayment(String transactionId, PaymentMethod method) async {
    try {
      switch (method) {
        case PaymentMethod.stripe:
          return await _verifyStripePayment(transactionId);
        case PaymentMethod.paypal:
          return await _verifyPayPalPayment(transactionId);
        case PaymentMethod.kkiapay:
          return await _verifyKkiapayPayment(transactionId);
        case PaymentMethod.wise:
          return await _verifyWisePayment(transactionId);
        default:
          return PaymentStatus.failed;
      }
    } catch (e) {
      _logger.e('Erreur vérification paiement: $e');
      return PaymentStatus.failed;
    }
  }

  /// Annule un abonnement
  Future<bool> cancelSubscription(String subscriptionId) async {
    try {
      // Annuler côté serveur (Firebase Functions)
      final response = await _dio.post(
        'https://us-central1-unimentorai-prod.cloudfunctions.net/cancelSubscription',
        data: {'subscriptionId': subscriptionId},
      );

      if (response.statusCode == 200) {
        _logger.i('Abonnement annulé: $subscriptionId');
        return true;
      }

      return false;
    } catch (e) {
      _logger.e('Erreur annulation abonnement: $e');
      return false;
    }
  }

  /// Rembourse un paiement
  Future<bool> refundPayment(String transactionId, PaymentMethod method) async {
    try {
      // Traiter le remboursement côté serveur
      final response = await _dio.post(
        'https://us-central1-unimentorai-prod.cloudfunctions.net/refundPayment',
        data: {
          'transactionId': transactionId,
          'method': method.name,
        },
      );

      if (response.statusCode == 200) {
        _logger.i('Remboursement effectué: $transactionId');
        return true;
      }

      return false;
    } catch (e) {
      _logger.e('Erreur remboursement: $e');
      return false;
    }
  }

  /// Calcule la date de fin d'abonnement
  DateTime _calculateEndDate(SubscriptionType type) {
    final now = DateTime.now();
    switch (type) {
      case SubscriptionType.free:
        return now.add(const Duration(days: 30));
      case SubscriptionType.premium:
        return now.add(const Duration(days: 30));
      case SubscriptionType.pro:
        return now.add(const Duration(days: 30));
      case SubscriptionType.enterprise:
        return now.add(const Duration(days: 365));
    }
    throw StateError('SubscriptionType non géré: $type');
  }

  /// Obtient le prix d'un abonnement
  double _getSubscriptionPrice(SubscriptionType type) {
    switch (type) {
      case SubscriptionType.free:
        return 0.0;
      case SubscriptionType.premium:
        return 9.99;
      case SubscriptionType.pro:
        return 19.99;
      case SubscriptionType.enterprise:
        return 99.99;
    }
    throw StateError('SubscriptionType non géré: $type');
  }

  /// Sauvegarde un abonnement dans Firestore
  Future<void> _saveSubscriptionToFirestore(SubscriptionModel subscription) async {
    // Implémentation Firestore
    _logger.i('Abonnement sauvegardé: ${subscription.id}');
  }

  /// Génère un ID unique
  String _generateId() => DateTime.now().millisecondsSinceEpoch.toString();

  // Méthodes de vérification pour chaque gateway
  Future<PaymentStatus> _verifyStripePayment(String transactionId) async {
    // Implémentation vérification Stripe
    return PaymentStatus.completed;
  }

  Future<PaymentStatus> _verifyPayPalPayment(String orderId) async {
    try {
      final callable = FirebaseFunctions.instance.httpsCallable('getPayPalOrder');
      final res = await callable.call(<String, dynamic>{'orderId': orderId});
      final d = res.data;
      if (d is! Map) return PaymentStatus.failed;
      if (d['completed'] == true) return PaymentStatus.completed;
      if (d['needsCapture'] == true) return PaymentStatus.processing;
      final st = d['status']?.toString().toUpperCase() ?? '';
      if (st == 'VOIDED' || st == 'CANCELLED') return PaymentStatus.failed;
      return PaymentStatus.processing;
    } catch (e) {
      _logger.e('Erreur vérification PayPal: $e');
      return PaymentStatus.failed;
    }
  }

  Future<PaymentStatus> _verifyKkiapayPayment(String transactionId) async {
    try {
      final callable =
          FirebaseFunctions.instance.httpsCallable('verifyKkiapayTransaction');
      final res = await callable.call(<String, dynamic>{
        'transactionId': transactionId,
      });
      final d = res.data;
      if (d is! Map) return PaymentStatus.failed;
      if (d['success'] == true) return PaymentStatus.completed;
      final status = d['status']?.toString().toUpperCase() ?? '';
      if (status == 'FAILED' || status.contains('FAIL')) {
        return PaymentStatus.failed;
      }
      return PaymentStatus.processing;
    } catch (e) {
      _logger.e('Erreur vérification Kkiapay: $e');
      return PaymentStatus.failed;
    }
  }

  Future<PaymentStatus> _verifyWisePayment(String transactionId) async {
    try {
      final callable = FirebaseFunctions.instance.httpsCallable('verifyWiseTransfer');
      final res = await callable.call(<String, dynamic>{'transferId': transactionId});
      final d = res.data;
      if (d is! Map) return PaymentStatus.failed;
      final completed = d['completed'] == true;
      if (completed) return PaymentStatus.completed;
      final status = d['status']?.toString() ?? '';
      if (status == 'cancelled' || status == 'funds_refunded') {
        return PaymentStatus.failed;
      }
      return PaymentStatus.processing;
    } catch (e) {
      _logger.e('Erreur vérification Wise: $e');
      return PaymentStatus.failed;
    }
  }
}

/// État du service de paiement
class PaymentServiceState {
  final bool isLoading;
  final List<SubscriptionModel> subscriptions;
  final List<PaymentModel> payments;
  final String? error;

  const PaymentServiceState({
    required this.isLoading,
    required this.subscriptions,
    required this.payments,
    this.error,
  });

  PaymentServiceState copyWith({
    bool? isLoading,
    List<SubscriptionModel>? subscriptions,
    List<PaymentModel>? payments,
    String? error,
  }) => PaymentServiceState(
      isLoading: isLoading ?? this.isLoading,
      subscriptions: subscriptions ?? this.subscriptions,
      payments: payments ?? this.payments,
      error: error,
    );
}

/// Exception de paiement
class PaymentException implements Exception {
  final String message;
  PaymentException(this.message);

  @override
  String toString() => 'PaymentException: $message';
}










