// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'payment_service.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$paymentServiceHash() => r'ba1aadcb4eb41586e91e3ba171660d456aef8172';

/// Service de paiements multi-gateways sécurisé
/// Supporte Stripe, PayPal, Kkiapay et Wise avec validation serveur
///
/// Copied from [PaymentService].
@ProviderFor(PaymentService)
final paymentServiceProvider = AutoDisposeAsyncNotifierProvider<PaymentService,
    PaymentServiceState>.internal(
  PaymentService.new,
  name: r'paymentServiceProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$paymentServiceHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$PaymentService = AutoDisposeAsyncNotifier<PaymentServiceState>;
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
