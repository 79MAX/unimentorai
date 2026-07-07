// tool/create_verify_file.dart
import 'dart:io';

void main() async {
  const code = '''
import 'dart:io';

void main() {
  final projectRoot = Directory.current.path;
  final requiredFiles = [
    'lib/main.dart',
    'lib/screens/splash_screen.dart',
    'lib/screens/home_screen.dart',
    'lib/screens/dashboard_screen.dart',
    'lib/screens/profile_screen.dart',
  ];

  print('🔍 Vérification des fichiers essentiels dans \$projectRoot\\n');

  bool allExist = true;

  for (final filePath in requiredFiles) {
    final file = File(filePath);
    if (file.existsSync()) {
      print('✅ Fichier trouvé : \$filePath');
    } else {
      print('❌ Fichier manquant : \$filePath');
      allExist = false;
    }
  }

  if (allExist) {
    print('\\n🎉 Tous les fichiers requis sont présents.');
  } else {
    print('\\n⚠️ Certains fichiers sont absents. Veuillez régénérer les fichiers manquants.');
  }
}
''';

  final dir = Directory('tool');
  if (!dir.existsSync()) dir.createSync();

  final file = File('tool/verify_files.dart');
  await file.writeAsString(code);

  print('✅ Fichier "tool/verify_files.dart" créé avec succès.');
}


