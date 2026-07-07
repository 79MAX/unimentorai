// 📁 lib/modules/localization/verified_text_widget.dart

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'translation_service.dart';
import '../provider/locale_provider.dart';

class VerifiedTextWidget extends ConsumerWidget {
  final Map<String, dynamic> localizedData;
  final String fieldName; // e.g., 'body', 'title'
  final TextStyle? style;
  final TextAlign? textAlign;

  const VerifiedTextWidget({
    super.key,
    required this.localizedData,
    required this.fieldName,
    this.style,
    this.textAlign,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final locale = ref.watch(localeProvider) ?? TranslationService.resolve(Localizations.localeOf(context));
    final langCode = locale.languageCode;
    final field = localizedData[fieldName];
    final verifiedKey = '${langCode}_verified';

    String displayText = '';

    if (field != null && field[langCode] != null && field[verifiedKey] == true) {
      displayText = field[langCode];
    } else if (field != null && field['en'] != null) {
      displayText = field['en'];
    } else {
      displayText = '[Traduction non disponible]';
    }

    return Text(
      displayText,
      style: style,
      textAlign: textAlign,
    );
  }
}





