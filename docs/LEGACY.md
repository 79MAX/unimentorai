# LEGACY – UniMentorAI

Ce document décrit les parties **legacy** de la codebase qui ne doivent plus être utilisées pour les nouveaux développements.

## Architecture officielle Flutter

L’architecture moderne et supportée de l’application est la suivante :

```text
lib/
  app/        # Point d’entrée, theming, navigation globale
  core/       # Services partagés, modèles, configuration, sécurité
  features/   # Fonctionnalités métier (auth, courses, pricing, mentoring, chatbot, etc.)
  shared/     # Widgets / utilitaires réutilisables (présent ou à compléter)
```

Toute **nouvelle fonctionnalité** doit être créée dans `features/*` en suivant le schéma :

```text
lib/features/<domaine>/
  presentation/   # UI, écrans, widgets
  services/       # Services métier liés à la feature
  provider/       # State management (Provider / Riverpod)
```

## Dossiers legacy (read‑only)

Les dossiers suivants sont considérés comme **legacy** :

```text
lib/screens/
lib/modules/
```

- Ils correspondent à des itérations plus anciennes de l’architecture (avant la refonte `features/*`).  
- Ils restent présents pour compatibilité et pour référence historique, mais **ne doivent pas être modifiés pour ajouter de nouvelles fonctionnalités**.  
- Les corrections **de sécurité** peuvent encore être appliquées si nécessaire, mais tout nouvel écran / service doit être créé dans `features/*`.

## Règle de contribution

- ✅ Nouveau code : créer dans `lib/features/*` (et éventuellement `lib/shared/*` pour les éléments transverses).  
- ✅ Migration progressive : lorsqu’une feature legacy est refactorisée, la nouvelle implémentation va dans `features/*`, puis l’ancien code peut être marqué comme obsolète ou supprimé dans un sprint dédié.  
- ❌ Ne pas ajouter de nouveaux écrans ou services dans `lib/screens/` ou `lib/modules/`.

Cette règle est **obligatoire** pour conserver une architecture claire, scalable et maintenable à long terme.

