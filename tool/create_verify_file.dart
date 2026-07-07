import 'dart:io';

void main() {
  final List<String> pathsToCheck = [
    'lib/main.dart',
    'lib/screens/login_screen.dart',
    'lib/screens/home_screen.dart',
    'lib/widgets/custom_button.dart',
    'assets/images/',
    'assets/icons/',
    'assets/logos/',
    'pubspec.yaml',
    'build.yaml',
  ];

  print('\n🔍 [VÉRIFICATION DES FICHIERS ET DOSSIERS CRITIQUES UNI-MENTORAI]\n');

  for (final path in pathsToCheck) {
    final isDirectory = path.endsWith('/');
    final exists = isDirectory
        ? Directory(path).existsSync()
        : File(path).existsSync();

    final status = exists ? '✅ OK' : '❌ MANQUANT';
    final type = isDirectory ? '📁 Dossier' : '📄 Fichier';

    print('$status - $type : $path');
  }

  print('\n✅ Vérification terminée.');
}


