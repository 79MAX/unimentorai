# Gestion des roles Firebase / custom claims

## Structure des claims

Source de verite : **Firebase Auth custom claims** via **Admin SDK**.

```json
{
  "role": "admin",
  "roles": ["admin"],
  "permissions": ["admin:all", "roles:manage", "security:audit"],
  "claimsVersion": 1
}
```

Roles supportes : `admin`, `enterprise_admin`, `mentor`, `user`, `recruiter`.

## Artefacts

- Module partage : `functions/src/auth/roles.js`
- Cloud Functions : `functions/src/auth/roleManagementModule.js`
- Script Admin SDK : `functions/scripts/manageRoles.js`
- Tests regles Firestore : `functions/tests/firestore.rules.test.js`

## Script CLI

Prerequis :
- credentials Admin SDK via `GOOGLE_APPLICATION_CREDENTIALS` ou ADC
- acces reserve aux operateurs securite / plateforme

### Attribuer un role

```bash
node functions/scripts/manageRoles.js --action set --uid <firebase_uid> --role admin --actor security@unimentor.ai --reason "break glass"
```

### Retirer un role privilegie

```bash
node functions/scripts/manageRoles.js --action clear --uid <firebase_uid> --actor security@unimentor.ai --reason "role expired"
```

## Audit logs

Chaque modification de role ecrit un document dans `role_management_logs` avec :
- `action`
- `actorUid`
- `actorRole`
- `targetUid`
- `targetRole`
- `reason`
- `createdAt`

## Firestore Rules

Les regles utilisent uniquement les claims serveur (`request.auth.token.role`, `request.auth.token.roles`).
Aucune elevation de privilege client n'est acceptee.

## Tests

Installer les dependances Node dans `functions/` puis executer :

```bash
npm install
npm run test:rules
```

Le test couvre :
- invite
- utilisateur normal
- mentor
- admin
- lecture/deni sur `courses`, `users`, `reverse_mentoring_profiles`
