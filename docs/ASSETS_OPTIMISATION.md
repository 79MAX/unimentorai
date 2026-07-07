# Optimisation des assets – UniMentorAI

## 📦 Formats recommandés
- **Images** : WebP (prioritaire), PNG (si transparence), JPEG (photos)
- **Icônes** : SVG (vectoriel), PNG optimisé
- **Vidéos** : MP4 (H.264), compression via HandBrake
- **Animations** : Lottie (JSON), GIF compressé

## 🛠️ Outils de compression
- [TinyPNG](https://tinypng.com/) (PNG/JPEG)
- [Squoosh](https://squoosh.app/) (WebP, JPEG, PNG)
- [HandBrake](https://handbrake.fr/) (vidéo)
- [SVGOMG](https://jakearchibald.github.io/svgomg/) (SVG)

## 🚦 Procédure d’ajout d’asset
1. Compresser l’asset avec l’outil adapté
2. Vérifier la taille (max : 500 Ko pour images, 5 Mo pour vidéos courtes)
3. Ajouter l’asset dans le dossier approprié (`assets/images/`, `assets/icons/`, etc.)
4. Déclarer l’asset dans `pubspec.yaml`
5. Utiliser le lazy loading dans le code Flutter (`CachedNetworkImage`, `FadeInImage`, etc.)

## 🧹 Nettoyage des assets
- Supprimer les fichiers non utilisés ou trop volumineux
- Utiliser un script pour lister les assets non référencés (exemple ci-dessous)

### Exemple de script Dart pour lister les assets non référencés
```dart
// Placez ce script dans tools/find_unused_assets.dart
import 'dart:io';
void main() {
  final pubspec = File('pubspec.yaml').readAsStringSync();
  final assetDirs = [
    Directory('assets/images'),
    Directory('assets/icons'),
    Directory('assets/animations'),
    Directory('assets/documents'),
  ];
  for (final dir in assetDirs) {
    if (!dir.existsSync()) continue;
    for (final file in dir.listSync(recursive: true)) {
      if (file is File && !pubspec.contains(file.path.replaceAll('\\', '/')))
        print('Non référencé : ${file.path}');
    }
  }
}
```

## 💤 Lazy loading dans Flutter
- Utiliser `CachedNetworkImage` ou `FadeInImage` pour les images distantes
- Utiliser `ListView.builder` pour les listes longues

---
Respecter ces bonnes pratiques garantit une application rapide, légère et agréable à utiliser. 