# SkillBridge

Plateforme collaborative de mise en relation entre développeurs permettant de partager des compétences, rejoindre des groupes de travail, organiser des sessions collaboratives et communiquer en temps réel.

## Présentation

SkillBridge est une application web full-stack développée dans le cadre d'un projet de formation Développeur Web et Web Mobile (DWWM).

L'application permet aux utilisateurs de :

- Créer et gérer leur profil.
- Déclarer leurs compétences techniques.
- Rechercher d'autres développeurs.
- Rejoindre des groupes collaboratifs.
- Organiser des sessions de travail.
- Réserver une participation à une session.
- Échanger via une messagerie de groupe.
- Recevoir des notifications.
- Administrer la plateforme via un espace dédié.

---

## Fonctionnalités principales

### Authentification

- Inscription utilisateur
- Connexion sécurisée
- Authentification JWT
- Gestion des rôles (USER / ADMIN)
- Protection des routes

### Gestion des profils

- Création de profil
- Modification des informations personnelles
- Ajout de compétences
- Consultation des profils

### Recherche d'utilisateurs

- Recherche par nom
- Recherche par compétence
- Filtrage des résultats

### Groupes collaboratifs

- Création de groupes
- Rejoindre un groupe
- Quitter un groupe
- Gestion des membres

### Sessions de travail

- Création de sessions
- Gestion des réservations
- Suivi des participants

### Messagerie

- Messages de groupe
- Historique des conversations
- Suppression logique des messages

### Notifications

- Notifications utilisateur
- Suivi des événements importants

### Administration

- Gestion des utilisateurs
- Suspension de comptes
- Consultation des journaux d'activité
- Consultation des journaux de sécurité

---

## Architecture technique

```text
Frontend (React + TypeScript)
            │
            ▼
Backend (Express + TypeScript)
            │
 ┌──────────┴──────────┐
 ▼                     ▼
MySQL              MongoDB
(Prisma)         (Mongoose)
```

---

## Stack technique

### Front-end

- React
- TypeScript
- React Router
- Axios
- Tailwind CSS

### Back-end

- Node.js
- Express
- TypeScript

### Base de données relationnelle

- MySQL
- Prisma ORM

### Base NoSQL

- MongoDB
- Mongoose

### Sécurité

- JWT
- Helmet
- CORS
- Rate Limiting
- Validation Zod

### Conteneurisation

- Docker
- Docker Compose

### Documentation

- Swagger / OpenAPI

### Tests

- Jest
- Supertest

---

## Structure du projet

```text
skillbridge/
│
├── frontend/
│
├── backend/
│
├── docs/
│
├── docker-compose.yml
├── README.md
└── .env.example
```

---

## Structure du Back-end

```text
backend/src/
│
├── controllers/
├── services/
├── repositories/
├── middlewares/
├── schemas/
├── routes/
├── models/
├── config/
├── utils/
│
├── app.ts
└── server.ts
```

---

## Installation

### Cloner le projet

```bash
git clone https://github.com/chatelierjimmy-max/Skillbridge.git
cd Skillbridge
```

### Installer les dépendances Front-end

```bash
cd frontend
npm install
```

### Installer les dépendances Back-end

```bash
cd backend
npm install
```

---

## Configuration

Créer un fichier `.env` à partir du modèle :

```bash
cp .env.example .env
```

Exemple :

```env
DATABASE_URL=mysql://root:password@mysql:3306/skillbridge

JWT_SECRET=your_secret_key

MONGO_URI=mongodb://mongo:27017/skillbridge

PORT=5000
```

---

## Prisma

Génération du client Prisma :

```bash
npx prisma generate
```

Migration de la base :

```bash
npx prisma migrate dev
```

---

## Docker

Lancement de l'environnement complet :

```bash
docker compose up -d
```

Arrêt des conteneurs :

```bash
docker compose down
```

Vérification :

```bash
docker ps
```

---

## Documentation Swagger

Documentation disponible à l'adresse :

```text
http://localhost:5000/api-docs
```

---

## API REST

### Authentification

```http
POST /auth/register
POST /auth/login
```

### Profil

```http
GET /profile/me
PUT /profile/me
```

### Utilisateurs

```http
GET /users/search
```

### Groupes

```http
GET /groups
POST /groups
POST /groups/:id/join
POST /groups/:id/leave
```

### Sessions

```http
POST /groups/:id/sessions
POST /sessions/:id/bookings
DELETE /sessions/:id/bookings
```

### Messagerie

```http
GET /groups/:id/messages
POST /groups/:id/messages
DELETE /messages/:id
```

### Administration

```http
GET /admin/users
PATCH /admin/users/:id/status
GET /admin/logs/activity
GET /admin/logs/security
```

---

## Sécurité

Le projet implémente plusieurs mécanismes de sécurité :

- Authentification JWT
- Contrôle d'accès par rôles (RBAC)
- Validation des données avec Zod
- Protection Helmet
- Gestion CORS
- Limitation du nombre de requêtes
- Journalisation des événements sensibles

---

## Tests

Exécution des tests :

```bash
npm test
```

Exemple :

```text
PASS tests/auth.test.ts
PASS tests/groups.test.ts
PASS tests/sessions.test.ts
PASS tests/messages.test.ts
```

---

## Perspectives d'évolution

- WebSockets temps réel
- Notifications live
- Refresh Tokens JWT
- Recherche avancée
- Pagination
- Système de matching par IA
- Application mobile

---

## Auteur

Jimmy Chatelier

Projet réalisé dans le cadre de la formation :

**Développeur Web et Web Mobile (DWWM)**

---

## Licence

Projet réalisé châtelier jimmy dans le cadre de la formation CEF et à des fins pédagogiques.
