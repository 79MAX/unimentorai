# UniMentorAI Startup YC Architecture (No-Break Upgrade)

Ce document definit une architecture evolutive pour atteindre 10M+ utilisateurs actifs sans casser l existant.

## 1) Regles de securite anti-regression

- Ne jamais supprimer de document existant.
- Ne jamais creer un doublon de cours quand un cours equivalent existe deja.
- Enrichir les cours existants via merge Firestore.
- Limiter les migrations a des ajouts retro-compatibles.

## 2) Modules backend deployables immediatement

Fichiers ajoutes:

- `functions/src/startup/courseDeduplicationEngine.js`
- `functions/src/startup/startupArchitectureModule.js`

Exports actives dans `functions/index.js`:

- `runStartupAudit`
- `courseDeduplicationEngine`
- `seedSignatureCourses`
- `upsertDefaultAIMentors`
- `createLiveEvent`
- `registerToLiveEvent`
- `sendLiveEventReminders`
- `issueSecureCertificate`
- `certificateVerificationPage`

## 3) Audit automatique de la base

Callable: `runStartupAudit`

Entrees:

- aucune (admin/mentor requis)

Sorties:

- `audit_report`
- `missing_courses`
- `courses_to_improve`
- `duplicate_risk`
- compteurs `existing_courses`, `existing_modules`, `existing_lessons`

Persistences:

- `audit_report/startup_audit_<timestamp>`
- `audit_report/latest`

## 4) Deduplication des cours

Callable: `courseDeduplicationEngine`

Entree:

- `candidateCourse` avec `title`, `modules`, `content`

Verification:

- similarite titre (Jaccard)
- similarite modules
- similarite contenu
- score pondere et decision:
  - `enrich_existing`
  - `safe_to_create`

## 5) Catalogue des 10 formations signatures

Callable: `seedSignatureCourses`

Comportement:

- Si cours similaire detecte: enrichissement (pas de suppression, pas de duplication)
- Sinon: creation d un cours signature avec structure pedagogique standard

Structure standard forcee:

1. Introduction
2. Objectifs pedagogiques
3. Modules structures
4. Lecons detaillees
5. Exemples concrets
6. Exercices
7. Quiz
8. Projet pratique
9. Resume
10. Ressources supplementaires

## 6) Mentors IA specialises

Callable: `upsertDefaultAIMentors`

Collection:

- `ai_mentors`

Mentors seeds:

- `ai_mentor_math`
- `ai_mentor_programming`
- `ai_mentor_ai`
- `ai_mentor_productivity`
- `ai_mentor_business`
- `ai_mentor_career`
- `ai_mentor_finance`
- `ai_mentor_research`
- `ai_mentor_language`

Capacites:

- explain
- correct_exercises
- recommend_courses
- track_progress

## 7) Evenements live et webinars

Callables:

- `createLiveEvent`
- `registerToLiveEvent`

Scheduler:

- `sendLiveEventReminders` (toutes les 15 min)

Collection:

- `events`

Schema principal:

- `event_id`
- `title`
- `course_id`
- `mentor_id`
- `event_type` (`webinar|live_class`)
- `date`
- `duration`
- `meeting_link`
- `recording_link`
- `capacity`
- `participants`
- `participants_count`

## 8) Certificats avec verification QR

Callable:

- `issueSecureCertificate`

HTTP:

- `certificateVerificationPage`

Collection:

- `certificates`

Champs:

- `certificate_id`
- `user_id`
- `course_id`
- `issue_date`
- `verification_url`
- `qr_code`
- `completion_score`
- `token_hash`

Securite:

- token signe HMAC SHA-256
- verification cote serveur
- blocage anti-falsification

## 9) Architecture Firestore cible 10M+

Collections coeur:

- `users`
- `courses`
- `modules`
- `lessons`
- `quizzes`
- `exercises`
- `projects`
- `events`
- `webinars`
- `certificates`
- `learning_paths`
- `ai_mentors`
- `progress`
- `achievements`
- `referrals`
- `analytics`

Bonnes pratiques:

- pagination (`limit`, `startAfter`)
- denormalisation controlee (compteurs pre-calcules)
- index composes critiques
- sous-collections pour gros volumes (progression, logs, events)
- fan-out asynchrone via Cloud Functions

## 10) Plan de deploiement recommande

1. Deployer functions
2. Executer `runStartupAudit`
3. Executer `upsertDefaultAIMentors`
4. Executer `seedSignatureCourses`
5. Activer l UI `events` et l endpoint public de verification certificat
6. Mesurer analytics (completion_rate, study_time, dropout_prediction)

## 11) Commandes utiles

Depuis `functions/`:

- `npm install`
- `npm run lint`
- `npm run deploy`

## 12) Notes importantes

- Cette evolution est non destructive.
- Le moteur de deduplication est prioritaire avant toute creation de cours automatique.
- La verification publique de certificat est prete pour integration frontend (QR -> URL signee).
