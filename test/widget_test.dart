import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:unimentorai/main.dart';

void main() {
  testWidgets('App démarre sans crash', (WidgetTester tester) async {
    await tester.pumpWidget(const MyApp());
    expect(find.text('UniMentorAI'), findsOneWidget);
  });
}
