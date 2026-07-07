import 'package:firebase_core/firebase_core.dart';

class AppBootstrapResult {
  final bool success;
  final String? message;

  const AppBootstrapResult({
    required this.success,
    this.message,
  });
}

class AppBootstrapService {
  static Future<AppBootstrapResult> initialize() async {
    try {
      await Firebase.initializeApp();

      return const AppBootstrapResult(
        success: true,
        message: 'App initialized successfully',
      );
    } catch (e) {
      return AppBootstrapResult(
        success: false,
        message: e.toString(),
      );
    }
  }
}
