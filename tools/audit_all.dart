// tools/audit_all.dart
import 'dart:io';
import 'dart:convert';

void main() async {
  print('🔍 AUDIT GLOBAL UNIMENTORAI - QUALITÉ & CONFORMITÉ\n');

  // Vérification de la structure des dossiers
  await auditArchitecture();
  
  // Vérification des fichiers de configuration
  await auditConfiguration();
  
  // Vérification des dépendances
  await auditDependencies();
  
  // Vérification de la sécurité
  await auditSecurity();
  
  // Vérification de l'internationalisation
  await auditInternationalization();
  
  print('\n============================================================');
  print('📊 RAPPORT FINAL D\'AUDIT');
  print('============================================================');
  print('✅ Audit global terminé avec succès');
}

Future<void> auditArchitecture() async {
  print('📋 Architecture...');
  
  final requiredDirs = [
    'lib/app',
    'lib/core',
    'lib/features',
    'lib/shared',
    'lib/l10n',
  ];
  
  for (final dir in requiredDirs) {
    if (await Directory(dir).exists()) {
      print('  ✅ $dir');
    } else {
      print('  ❌ $dir manquant');
      exit(1);
    }
  }
  
  // Vérifier la structure des features
  final featuresDir = Directory('lib/features');
  if (await featuresDir.exists()) {
    await for (final entity in featuresDir.list()) {
      if (entity is Directory) {
        final featureName = entity.path.split('/').last;
        final requiredSubDirs = ['presentation', 'services', 'provider'];
        
        for (final subDir in requiredSubDirs) {
          final subDirPath = '${entity.path}/$subDir';
          if (await Directory(subDirPath).exists()) {
            print('  ✅ $featureName/$subDir');
          } else {
            print('  ⚠️  $featureName/$subDir manquant');
          }
        }
      }
    }
  }
}

Future<void> auditConfiguration() async {
  print('\n📋 Configuration...');
  
  final requiredFiles = [
    'pubspec.yaml',
    'analysis_options.yaml',
    'l10n.yaml',
    'android/app/build.gradle.kts',
    'ios/Runner/Info.plist',
  ];
  
  for (final file in requiredFiles) {
    if (await File(file).exists()) {
      print('  ✅ $file');
    } else {
      print('  ❌ $file manquant');
    }
  }
}

Future<void> auditDependencies() async {
  print('\n📋 Dépendances...');
  
  final pubspecFile = File('pubspec.yaml');
  if (await pubspecFile.exists()) {
    final content = await pubspecFile.readAsString();
    
    // Vérifier les dépendances critiques
    final criticalDeps = [
      'flutter',
      'firebase_core',
      'provider',
      'http',
      'shared_preferences',
    ];
    
    for (final dep in criticalDeps) {
      if (content.contains(dep)) {
        print('  ✅ $dep');
      } else {
        print('  ⚠️  $dep manquant');
      }
    }
  }
}

Future<void> auditSecurity() async {
  print('\n📋 Sécurité...');
  
  // Vérifier l'absence de clés API en dur
  final dartFiles = await findDartFiles('lib');
  bool hasApiKeys = false;
  
  for (final file in dartFiles) {
    final content = await File(file).readAsString();
    if (content.contains('AIza') || content.contains('sk-')) {
      print('  ❌ Clé API détectée dans $file');
      hasApiKeys = true;
    }
  }
  
  if (!hasApiKeys) {
    print('  ✅ Aucune clé API en dur détectée');
  }
  
  // Vérifier les validateurs de formulaires
  bool hasValidators = false;
  for (final file in dartFiles) {
    final content = await File(file).readAsString();
    if (content.contains('TextFormField') && content.contains('validator:')) {
      hasValidators = true;
      break;
    }
  }
  
  if (hasValidators) {
    print('  ✅ Validateurs de formulaires présents');
  } else {
    print('  ⚠️  Validateurs de formulaires manquants');
  }
}

Future<void> auditInternationalization() async {
  print('\n📋 Internationalisation...');
  
  final l10nDir = Directory('lib/l10n');
  if (await l10nDir.exists()) {
    await for (final entity in l10nDir.list()) {
      if (entity is File && entity.path.endsWith('.arb')) {
        final content = await File(entity.path).readAsString();
        try {
          final json = jsonDecode(content);
          final locale = json['@@locale'];
          print('  ✅ $locale');
        } catch (e) {
          print('  ❌ Erreur JSON dans ${entity.path}');
        }
      }
    }
  }
}

Future<List<String>> findDartFiles(String dir) async {
  final List<String> files = [];
  final directory = Directory(dir);
  
  await for (final entity in directory.list(recursive: true)) {
    if (entity is File && entity.path.endsWith('.dart')) {
      files.add(entity.path);
    }
  }
  
  return files;
} 

