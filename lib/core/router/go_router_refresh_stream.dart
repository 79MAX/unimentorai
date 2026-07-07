import 'dart:async';
import 'package:flutter/foundation.dart';

class GoRouterRefreshStream extends ChangeNotifier {
  final StreamSubscription<dynamic> _subscription;

  GoRouterRefreshStream(Stream<dynamic> stream)
      : _subscription = stream.listen(
          (_) {},
          onError: (Object error, StackTrace _) {
            debugPrint('GoRouterRefreshStream error: $error');
          },
        ) {
    _subscription.onData((_) {
      notifyListeners();
    });
  }

  @override
  void dispose() {
    _subscription.cancel();
    super.dispose();
  }
}
