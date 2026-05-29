# Tests backend SkillBridge

Ce dossier regroupe les tests API avec Postman et PowerShell, mais sous forme automatisée.

## Ce qui est couvert

- Health check : `GET /api/health`
- Authentification : register, login, `GET /api/auth/me`
- Profil : modification du profil utilisateur
- Competences : liste, ajout au profil, consultation
- Recherche : `GET /api/users/search?skill=React&level=BEGINNER&city=Paris`
- Groupes : creation d'un groupe et adhesion
- Sessions : creation, liste, inscription, annulation, mes sessions
- Messages : envoi, lecture, suppression logique
- Notifications : liste et marquage comme lue
- Admin : liste utilisateurs, desactivation, reactivation, logs activite/securite
- Securite admin : le middleware relit le role en base et refuse un ancien/faux token admin

## Prerequis

Les tests utilisent les bases locales du projet, comme Postman :

- MySQL sur `localhost:3306`
- MongoDB sur `localhost:27017`
- Le fichier `backend/.env`
- Les migrations Prisma appliquees

Avant de lancer les tests si besoin :

```bash
docker compose up -d
cd backend
npx prisma migrate dev
npx prisma db seed
```

## Lancer les tests

Depuis `backend` :

```bash
npm test
```

Le script compile d'abord TypeScript vers `dist`, puis Jest lance les tests dans `tests/api.integration.test.cjs`.

## Donnees creees

Le test cree des utilisateurs avec des emails uniques en `@test.local`. En fin de test, il supprime ces utilisateurs et les documents MongoDB relies au test.

Tes comptes existants ne sont pas utilises comme donnees de test. Le compte admin de test est cree temporairement puis supprime.
