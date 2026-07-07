// tool/create_missing_files.dart
import 'dart:io';

void main() {
  final filesToCreate = {
    'lib/main.dart': _mainDartContent,
    'lib/screens/splash_screen.dart': _splashScreenContent,
    'lib/screens/home_screen.dart': _homeScreenContent,
    'lib/screens/dashboard_screen.dart': _dashboardScreenContent,
    'lib/screens/profile_screen.dart': _profileScreenContent,
  };

  for (final path in filesToCreate.keys) {
    final file = File(path);
    if (!file.existsSync()) {
      file.createSync(recursive: true);
      file.writeAsStringSync(filesToCreate[path]!);
      print('✅ Fichier créé : $path');
    } else {
      print('✔️ Fichier déjà existant : $path');
    }
  }

  print('\n🎉 Tous les fichiers manquants ont été créés avec succès.');
}

const _mainDartContent = '''
import 'package:flutter/material.dart';
import 'screens/splash_screen.dart';

void main() {
  runApp(UniMentorApp());
}

class UniMentorApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'UniMentorAI',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(primarySwatch: Colors.indigo),
      home: SplashScreen(),
    );
  }
}
''';

const _splashScreenContent = '''
import 'package:flutter/material.dart';
import 'home_screen.dart';

class SplashScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    Future.delayed(Duration(seconds: 2), () {
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (_) => HomeScreen()),
      );
    });

    return Scaffold(
      body: Center(
        child: Text(
          'Bienvenue sur UniMentorAI',
          style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }
}
''';

const _homeScreenContent = '''
import 'package:flutter/material.dart';
import 'dashboard_screen.dart';
import 'profile_screen.dart';

class HomeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: Text('Accueil'),
          bottom: TabBar(tabs: [
            Tab(icon: Icon(Icons.dashboard), text: 'Dashboard'),
            Tab(icon: Icon(Icons.person), text: 'Profil'),
          ]),
        ),
        body: TabBarView(
          children: [
            DashboardScreen(),
            ProfileScreen(),
          ],
        ),
      ),
    );
  }
}
''';

const _dashboardScreenContent = '''
import 'package:flutter/material.dart';

class DashboardScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Text('Tableau de bord'),
    );
  }
}
''';

const _profileScreenContent = '''
import 'package:flutter/material.dart';

class ProfileScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Text('Profil utilisateur'),
    );
  }
}
''';


