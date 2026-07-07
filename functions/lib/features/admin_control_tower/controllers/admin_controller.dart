import 'package:flutter/foundation.dart';

class AdminController extends ChangeNotifier {

  int totalCertificates = 0;
  int fraudAlerts = 0;
  double verificationRate = 0.0;

  bool systemHealthy = true;

  void updateMetrics({
    required int certificates,
    required int frauds,
    required double rate,
  }) {
    totalCertificates = certificates;
    fraudAlerts = frauds;
    verificationRate = rate;

    notifyListeners();
  }

  void setSystemHealth(bool status) {
    systemHealthy = status;
    notifyListeners();
  }
}

