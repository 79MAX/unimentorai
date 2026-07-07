class AppMonitor {

  DateTime lastHealthCheck = DateTime.now();

  /// ❤️ SYSTEM HEALTH
  bool isSystemHealthy() => DateTime.now().difference(lastHealthCheck).inMinutes < 5;

  /// 📊 UPDATE HEARTBEAT
  void heartbeat() {
    lastHealthCheck = DateTime.now();
  }
}
