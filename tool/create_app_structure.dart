import 'dart:io';

void main() {
  final filesToGenerate = <String, String>{
    'lib/main.dart': _mainDartContent,
    'lib/screens/splash_screen.dart': _splashScreenContent,
    'lib/screens/home_screen.dart': _homeScreenContent,
    'lib/screens/dashboard_screen.dart': _dashboardScreenContent,
    'lib/screens/profile_screen.dart': _profileScreenContent,
  };

  for (final entry in filesToGenerate.entries) {
    final filePath = entry.key;
    final content = entry.value;

    final file = File(filePath);
    final dir = file.parent;

    if (!dir.existsSync()) {
      dir.createSync(recursive: true);
      print('📁 Dossier créé : ${dir.path}');
    }

    if (file.existsSync()) {
      file.deleteSync();
      print('🗑️ Fichier supprimé : $filePath');
    }

    file.writeAsStringSync(content);
    print('✅ Fichier généré : $filePath');
  }
}

/// === FICHIERS ===

const _mainDartContent = '''import 'package:flutter/material.dart';
import 'screens/splash_screen.dart';

void main() => runApp(const UniMentorApp());

class UniMentorApp extends StatelessWidget {
  const UniMentorApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'UniMentorAI',
      theme: ThemeData(primarySwatch: Colors.deepPurple),
      home: const SplashScreen(),
    );
  }
}
''';

const _splashScreenContent = '''import 'package:flutter/material.dart';
import 'home_screen.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(seconds: 2), () {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const HomeScreen()),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Text('Chargement de UniMentorAI...', style: TextStyle(fontSize: 18)),
      ),
    );
  }
}
''';

const _homeScreenContent = '''import 'package:flutter/material.dart';
import 'dashboard_screen.dart';
import 'profile_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;
  final List<Widget> _screens = [const DashboardScreen(), const ProfileScreen()];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.dashboard), label: 'Tableau de bord'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profil'),
        ],
      ),
    );
  }
}
''';

const _dashboardScreenContent = '''import 'package:flutter/material.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(child: Text('Bienvenue dans le tableau de bord')),
    );
  }
}
''';

const _profileScreenContent = '''import 'package:flutter/material.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(child: Text('Profil utilisateur')),
    );
  }
}
''';


