import 'fraud_detection_engine.dart';

class FraudEvaluationResponse {
  final FraudResult result;
  final String certificateId;

  FraudEvaluationResponse({
    required this.result,
    required this.certificateId,
  });
}




