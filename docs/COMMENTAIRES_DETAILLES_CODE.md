# Commentaires detailles du code - SkillBridge

Ce document reprend les fichiers utiles du projet un par un et explique leur role dans l'application. Il sert de guide de lecture du code, de support de revision et de base pour expliquer le projet a l'oral.

Les dossiers generes comme `node_modules`, `dist` et `.git` ne sont pas commentes ici car ils ne contiennent pas le code source ecrit pour l'application. Les fichiers binaires, captures et images sont commentes par usage, car leur contenu ne se lit pas comme du code.

## Vue d'ensemble

SkillBridge est une application full-stack composee de quatre grandes parties :

- `frontend` : interface React avec TypeScript, React Router, Axios et Tailwind CSS.
- `backend` : API Express avec TypeScript, validation Zod, JWT, Prisma, Mongoose et middlewares de securite.
- `docker-compose.yml` : services MySQL, MongoDB, phpMyAdmin et mongo-express.
- `docs` : documents de verification, checklists et images de soutenance.

Le flux principal est le suivant :

1. L'utilisateur agit dans une page React.
2. La page appelle un service frontend dans `frontend/src/services`.
3. Le service utilise l'instance Axios de `frontend/src/services/api.ts`.
4. La requete arrive sur une route Express dans `backend/src/routes`.
5. La route applique les middlewares necessaires puis appelle un controller.
6. Le controller delegue la logique metier a un service.
7. Le service applique les regles metier et appelle un repository.
8. Le repository lit ou ecrit dans MySQL via Prisma, ou dans MongoDB via Mongoose.

## Racine du projet

### `README.md`

Document de presentation du projet. Il explique le but de SkillBridge, les grandes fonctionnalites, la stack technique, l'architecture generale, les commandes d'installation, Prisma, Docker, les endpoints REST et les tests.

Point important : il sert surtout de document d'accueil pour un lecteur externe. Certaines routes listees dans la section API REST sont plus generales ou anciennes que les routes exactes du code. Les routes exactes sont celles definies dans `backend/src/routes`.

### `.env.example`

Modele de variables d'environnement. Il indique quelles valeurs doivent exister pour le backend et le frontend :

- `PORT` pour le port de l'API.
- `DATABASE_URL` pour MySQL.
- `SHADOW_DATABASE_URL` pour les migrations Prisma.
- `MONGO_URI` pour MongoDB.
- `JWT_SECRET` et `JWT_EXPIRES_IN` pour les tokens.
- `BCRYPT_SALT_ROUNDS` pour le cout de hash des mots de passe.
- `FRONTEND_URL` pour CORS.
- `VITE_API_URL` pour que React sache appeler l'API.

Ce fichier ne doit pas contenir de vrais secrets. Il sert de modele pour creer les fichiers `.env`.

### `.gitignore`

Liste les fichiers et dossiers a ne pas versionner. Son role est d'eviter de commiter les dependances, les builds, les fichiers locaux et les secrets.

### `docker-compose.yml`

Decrit les services de donnees et d'administration locale :

- `mysql` lance MySQL 8 sur le port `3306`, avec une base `skillbridge`.
- `mongodb` lance MongoDB 7 sur le port `27017`.
- `phpmyadmin` expose une interface web MySQL sur `http://localhost:8080`.
- `mongo-express` expose une interface web MongoDB sur `http://localhost:8081`.
- `mysql_data` et `mongodb_data` conservent les donnees entre les redemarrages.
- `skillbridge_network` permet aux conteneurs de communiquer entre eux.

Le backend n'est pas conteneurise par ce fichier dans l'etat actuel : il tourne en local avec `npm run dev`.

## Backend - configuration generale

### `backend/package.json`

Declare les scripts et dependances backend.

Scripts importants :

- `dev` lance `tsx watch src/server.ts`, donc l'API redemarre quand le code change.
- `build` compile TypeScript vers `dist`.
- `start` lance la version compilee.
- `prisma:generate` genere le client Prisma.
- `prisma:migrate` applique les migrations en developpement.
- `test` compile puis lance Jest.

Dependances importantes :

- `express` pour l'API HTTP.
- `prisma`, `@prisma/client`, `@prisma/adapter-mariadb` et `mariadb` pour MySQL.
- `mongoose` pour MongoDB.
- `bcrypt` pour hasher les mots de passe.
- `jsonwebtoken` pour creer et verifier les JWT.
- `zod` pour valider les donnees entrantes.
- `helmet`, `cors` et `express-rate-limit` pour la securite HTTP.

### `backend/package-lock.json`

Fichier genere par npm. Il fige exactement les versions installees pour reproduire l'environnement. Il ne contient pas de logique applicative et ne se modifie pas a la main.

### `backend/.env.example`

Modele specifique au backend. Il reprend les variables dont l'API Express a besoin : port, URL MySQL, shadow database Prisma, URL MongoDB, secret JWT, duree du token, cout bcrypt, URL frontend et environnement Node.

### `backend/.env`

Fichier local reel du backend. Il est necessaire pour lancer l'API, mais il ne doit pas etre recopie dans la documentation avec ses secrets. Le code le lit indirectement via `backend/src/config/env.ts`.

### `backend/tsconfig.json`

Configuration TypeScript du backend.

Points importants :

- `target: ES2022` indique la version JavaScript generee.
- `module: CommonJS` correspond au choix `type: commonjs` dans `package.json`.
- `rootDir: ./src` et `outDir: ./dist` separent code source et code compile.
- `strict`, `noUncheckedIndexedAccess` et `exactOptionalPropertyTypes` renforcent les controles de types.
- `typeRoots` ajoute `src/types`, necessaire pour etendre le type `Request` d'Express.

### `backend/jest.config.cjs`

Configuration de Jest pour les tests backend.

Le projet lance surtout les tests `*.test.cjs` dans `backend/tests`, avec un timeout de 30 secondes pour laisser le temps aux appels API et aux bases locales de repondre.

### `backend/prisma.config.cjs`

Configuration Prisma. Elle charge les variables `.env`, indique le chemin du schema, le script de seed et les URLs de base principale et de shadow database.

La shadow database sert a Prisma pour calculer et verifier les migrations sans casser la base principale.

### `backend/Dockerfile`

Fichier vide actuellement. Il indique probablement une intention de dockeriser le backend plus tard, mais le backend n'a pas encore d'image Docker definie.

## Backend - entree de l'application

### `backend/src/app.ts`

Construit l'application Express sans demarrer le serveur.

Ce fichier centralise les middlewares globaux :

- `helmet()` ajoute des headers HTTP de securite.
- `cors(...)` autorise le frontend declare dans `FRONTEND_URL`.
- `express.json({ limit: "1mb" })` autorise les corps JSON en limitant leur taille.
- `globalRateLimiter` limite le nombre de requetes.
- `app.use("/api", routes)` branche toutes les routes API sous `/api`.
- `notFoundMiddleware` gere les routes inconnues.
- `errorMiddleware` transforme les erreurs en reponses JSON propres.

Le fait d'exporter `app` sans `listen` permet aux tests d'utiliser l'API avec Supertest sans ouvrir un port.

### `backend/src/server.ts`

Demarre vraiment le serveur.

Il appelle d'abord `connectMongoDB()`, car les messages, notifications et logs utilisent MongoDB. Ensuite il lance `app.listen` sur le port defini dans les variables d'environnement.

Si MongoDB ne se connecte pas, le serveur s'arrete, ce qui evite d'avoir une API partiellement fonctionnelle.

## Backend - configuration

### `backend/src/config/env.ts`

Charge les variables d'environnement avec `dotenv.config()`, verifie que les variables indispensables existent, puis exporte un objet `env` propre.

Son interet est de centraliser l'acces aux variables comme `DATABASE_URL`, `MONGO_URI`, `JWT_SECRET` ou `FRONTEND_URL`. Au lieu de lire `process.env` partout, le reste du code utilise `env`.

### `backend/src/config/prisma.ts`

Configure Prisma pour MySQL via l'adaptateur MariaDB.

Il cree un `PrismaClient` exporte sous le nom `prisma`. Tous les repositories relationnels l'utilisent pour lire ou ecrire dans MySQL.

### `backend/src/config/mongodb.ts`

Connecte Mongoose a MongoDB.

Le fichier :

- lit `env.mongoUri`,
- verifie qu'il existe,
- appelle `mongoose.connect`,
- affiche un message de succes,
- arrete le process avec `process.exit(1)` en cas d'erreur.

Cette connexion est indispensable pour les modeles MongoDB : messages, notifications, activity logs et security logs.

## Backend - utilitaires et types

### `backend/src/utils/AppError.ts`

Classe d'erreur personnalisee. Elle ajoute un `statusCode` a une erreur JavaScript classique.

Exemple : au lieu de lancer une erreur generique, un service peut faire `throw new AppError("Utilisateur introuvable", 404)`. Le middleware d'erreur sait alors renvoyer une reponse HTTP 404.

### `backend/src/utils/jwt.ts`

Contient la logique JWT :

- `JwtPayload` definit le contenu du token : `userId` et `role`.
- `generateToken` signe un token avec `JWT_SECRET` et une duree d'expiration.
- `verifyToken` verifie un token et retourne son payload.

Ce fichier est utilise par le service d'authentification et par le middleware d'authentification.

### `backend/src/types/express.d.ts`

Etend le type `Request` d'Express pour ajouter `req.user`.

Sans ce fichier, TypeScript ne saurait pas que `req.user.id` et `req.user.role` existent apres passage dans `authMiddleware`.

## Backend - middlewares

### `backend/src/middlewares/auth.middleware.ts`

Verifie qu'une requete possede un header `Authorization: Bearer TOKEN`.

Fonctionnement :

1. Le middleware lit le header `authorization`.
2. Il refuse la requete si le header est absent ou mal forme.
3. Il extrait le token.
4. Il appelle `verifyToken`.
5. Il ajoute `req.user = { id, role }`.
6. Il appelle `next()` pour laisser passer la requete.

En cas de token invalide ou expire, il renvoie une erreur 401.

### `backend/src/middlewares/role.middleware.ts`

Protege les routes reservees a certains roles, notamment `ADMIN`.

Point important : il ne fait pas confiance uniquement au role contenu dans le JWT. Il relit l'utilisateur en base via `userRepository.findById`, verifie que le compte est actif et que le role en base correspond aux roles autorises.

C'est une bonne securite contre un vieux token ou un token qui pretendrait etre admin alors que la base dit autre chose.

### `backend/src/middlewares/validate.middleware.ts`

Middleware generique de validation Zod.

Il recoit un schema Zod, puis valide `req.body`, `req.params` et `req.query`. Si la validation echoue, il concatene les messages d'erreur et renvoie une `AppError` 400.

Il permet de bloquer les donnees incorrectes avant qu'elles n'arrivent dans les controllers.

### `backend/src/middlewares/rateLimit.middleware.ts`

Configure deux limites de requetes :

- `globalRateLimiter` limite les requetes globales a 100 par fenetre de 15 minutes.
- `authRateLimiter` limite les routes de connexion et inscription a 10 tentatives par fenetre de 15 minutes.

Les limites sont desactivees en environnement de test pour ne pas rendre les tests instables.

### `backend/src/middlewares/notFound.middleware.ts`

Gere les routes inconnues. Si aucune route n'a repondu, il cree une erreur 404 avec l'URL demandee.

### `backend/src/middlewares/error.middleware.ts`

Dernier middleware Express. Il convertit toutes les erreurs en JSON.

S'il s'agit d'une `AppError`, il utilise son `statusCode`. Sinon il renvoie 500. En mode development, il ajoute la stack trace pour faciliter le debug.

## Backend - routes

### `backend/src/routes/index.routes.ts`

Point d'entree de toutes les routes API.

Il expose :

- `GET /api/health` pour verifier que l'API tourne.
- `/api/auth` pour l'authentification.
- `/api/users` pour profil, competences et recherche.
- `/api/groups` pour les groupes.
- `/api/groups/:groupId/sessions` et `/api/sessions/:id/book` pour les sessions.
- `/api/groups/:groupId/messages` et `/api/messages/:id` pour la messagerie.
- `/api/notifications` pour les notifications.
- `/api/admin` pour l'administration.

### `backend/src/routes/auth.routes.ts`

Declare les endpoints d'authentification :

- `POST /api/auth/register` avec rate limiting et validation.
- `POST /api/auth/login` avec rate limiting et validation.
- `GET /api/auth/me` avec authentification obligatoire.

### `backend/src/routes/profile.routes.ts`

Declare les endpoints du profil utilisateur :

- `GET /api/users/me/profile` pour recuperer son profil.
- `PUT /api/users/me/profile` pour le mettre a jour.

Les deux routes exigent un JWT valide.

### `backend/src/routes/skill.routes.ts`

Declare les endpoints de competences :

- `GET /api/users/skills` liste toutes les competences disponibles.
- `GET /api/users/me/skills` liste les competences de l'utilisateur connecte.
- `POST /api/users/me/skills` ajoute ou met a jour une competence utilisateur.
- `DELETE /api/users/me/skills/:skillId` retire une competence du profil.

### `backend/src/routes/search.routes.ts`

Declare `GET /api/users/search`.

La route accepte des filtres en query string : competence, niveau, ville, page et limite. Elle est protegee par JWT et validee avec Zod.

### `backend/src/routes/group.routes.ts`

Declare les endpoints groupes :

- `GET /api/groups` liste les groupes.
- `POST /api/groups` cree un groupe.
- `GET /api/groups/me` liste les groupes de l'utilisateur.
- `GET /api/groups/:id` affiche le detail d'un groupe.
- `POST /api/groups/:id/join` permet de rejoindre un groupe.
- `DELETE /api/groups/:id/leave` permet de quitter un groupe.

### `backend/src/routes/session.routes.ts`

Declare les endpoints sessions :

- `GET /api/groups/:groupId/sessions` liste les sessions d'un groupe.
- `POST /api/groups/:groupId/sessions` cree une session.
- `POST /api/sessions/:id/book` inscrit l'utilisateur a une session.
- `DELETE /api/sessions/:id/book` annule l'inscription.
- `GET /api/users/me/sessions` liste les sessions reservees par l'utilisateur.

### `backend/src/routes/message.routes.ts`

Declare les endpoints messagerie :

- `GET /api/groups/:groupId/messages` lit les messages d'un groupe.
- `POST /api/groups/:groupId/messages` envoie un message.
- `DELETE /api/messages/:id` supprime logiquement un message.

### `backend/src/routes/notification.routes.ts`

Declare les endpoints notifications :

- `GET /api/notifications` liste les notifications de l'utilisateur.
- `PATCH /api/notifications/:id/read` marque une notification comme lue.

### `backend/src/routes/admin.routes.ts`

Declare les endpoints admin.

Toutes les routes passent d'abord par :

- `authMiddleware`,
- puis `roleMiddleware(UserRole.ADMIN)`.

Endpoints :

- `GET /api/admin/users` liste les utilisateurs.
- `PATCH /api/admin/users/:id/disable` desactive un utilisateur.
- `PATCH /api/admin/users/:id/enable` reactive un utilisateur.
- `GET /api/admin/logs/activity` liste les logs d'activite.
- `GET /api/admin/logs/security` liste les logs de securite.

## Backend - controllers

### `backend/src/controllers/auth.controller.ts`

Traduit les requetes HTTP d'authentification en appels au service `authService`.

Il construit aussi un contexte avec `req.ip` et `user-agent`, utile pour les logs de securite. Le controller ne contient pas la logique metier : il appelle le service, puis renvoie le bon statut HTTP.

### `backend/src/controllers/profile.controller.ts`

Recupere `req.user.id`, appelle `profileService`, puis renvoie le profil ou le message de mise a jour.

### `backend/src/controllers/skill.controller.ts`

Expose les actions de competences :

- lecture de toutes les competences,
- lecture des competences de l'utilisateur,
- ajout d'une competence,
- suppression d'une competence.

Il convertit `req.params.skillId` en nombre pour le service.

### `backend/src/controllers/search.controller.ts`

Construit un objet de filtres a partir de `req.query`, ajoute l'id de l'utilisateur connecte, puis appelle `searchService.searchLearners`.

Il evite de passer directement `req.query` au service, ce qui garde une entree metier plus propre.

### `backend/src/controllers/group.controller.ts`

Gere les actions groupe cote HTTP : liste, creation, detail, mes groupes, rejoindre et quitter.

Il recupere l'utilisateur connecte avec `req.user.id` et convertit les ids de route en nombres.

### `backend/src/controllers/session.controller.ts`

Gere les actions HTTP liees aux sessions : liste des sessions d'un groupe, creation, inscription, annulation, et liste des sessions personnelles.

Il retourne des statuts differents selon l'action : 201 pour creation, 200 pour consultation ou modification.

### `backend/src/controllers/message.controller.ts`

Gere la messagerie au niveau HTTP.

Il appelle `messageService` pour :

- verifier que l'utilisateur est membre du groupe,
- recuperer les messages,
- envoyer un message,
- supprimer logiquement un message.

### `backend/src/controllers/notification.controller.ts`

Gere les notifications :

- liste des notifications de l'utilisateur connecte,
- passage d'une notification en `isRead: true`.

### `backend/src/controllers/admin.controller.ts`

Gere les endpoints admin :

- liste des utilisateurs,
- desactivation,
- reactivation,
- lecture des logs d'activite,
- lecture des logs de securite.

Le controller transmet `req.user.id` au service pour tracer quel admin a fait l'action.

## Backend - schemas Zod

### `backend/src/schemas/auth.schema.ts`

Valide l'inscription et la connexion.

Pour l'inscription, il impose :

- prenom et nom d'au moins 2 caracteres,
- email valide,
- mot de passe de 8 caracteres minimum,
- au moins une majuscule,
- au moins une minuscule,
- au moins un chiffre.

Pour la connexion, il verifie simplement email valide et mot de passe present.

### `backend/src/schemas/profile.schema.ts`

Valide la mise a jour du profil :

- `bio` limitee a 1000 caracteres,
- `level` limite a `BEGINNER`, `INTERMEDIATE`, `ADVANCED`,
- `availability` limitee a 255 caracteres,
- `location` limitee a 255 caracteres.

### `backend/src/schemas/skill.schema.ts`

Valide :

- l'ajout d'une competence avec `skillId` positif et `level` valide,
- le parametre `skillId` pour la suppression.

### `backend/src/schemas/search.schema.ts`

Valide les filtres de recherche :

- competence maximum 100 caracteres,
- niveau parmi les trois niveaux,
- ville maximum 150 caracteres,
- pagination numerique positive,
- limite maximum 50.

### `backend/src/schemas/group.schema.ts`

Valide la creation d'un groupe :

- nom entre 3 et 150 caracteres,
- description optionnelle limitee,
- niveau obligatoire,
- competence liee via `skillId`.

Valide aussi le parametre `id` des routes groupe.

### `backend/src/schemas/session.schema.ts`

Valide la creation d'une session :

- `groupId` positif,
- titre entre 3 et 150 caracteres,
- date ISO valide,
- duree entre 15 et 480 minutes,
- nombre de participants positif si fourni.

Valide aussi les ids de groupe et de session.

### `backend/src/schemas/message.schema.ts`

Valide la messagerie :

- `groupId` positif,
- message non vide apres trim,
- message limite a 1000 caracteres,
- id MongoDB du message present.

### `backend/src/schemas/admin.schema.ts`

Valide l'id utilisateur dans les routes admin.

## Backend - services

### `backend/src/services/auth.service.ts`

Contient la logique metier d'inscription, connexion et recuperation du compte courant.

Inscription :

- verifie que l'email n'existe pas deja,
- hash le mot de passe avec bcrypt,
- cree l'utilisateur en minuscule cote email,
- cree aussi le profil via le repository,
- ecrit un log d'activite `REGISTER`.

Connexion :

- recherche l'utilisateur par email,
- refuse si l'utilisateur n'existe pas,
- refuse si le compte est desactive,
- compare le mot de passe avec bcrypt,
- trace les echecs et succes dans les logs de securite,
- trace aussi l'activite `LOGIN`,
- genere un JWT contenant `userId` et `role`,
- retourne l'utilisateur public et le token.

### `backend/src/services/profile.service.ts`

Gere le profil utilisateur.

Il verifie qu'un profil existe pour la lecture, sinon renvoie une erreur 404. Pour la mise a jour, il delegue au repository.

### `backend/src/services/skill.service.ts`

Gere les competences utilisateur.

Il liste les competences disponibles, transforme les competences utilisateur pour renvoyer une forme simple au frontend, verifie qu'une competence existe avant de l'ajouter ou de la supprimer, et convertit les erreurs Prisma de suppression en message metier clair.

### `backend/src/services/search.service.ts`

Transforme les resultats de recherche en objets faciles a afficher.

Le repository renvoie des utilisateurs avec profil et competences imbriquees. Le service reformate les competences pour exposer `id`, `name`, `category` et `level`.

### `backend/src/services/group.service.ts`

Contient les regles metier des groupes.

Il :

- liste les groupes avec un compteur de membres,
- verifie qu'une competence existe avant de creer un groupe,
- cree le groupe et ajoute automatiquement le createur comme `OWNER`,
- empeche de rejoindre un groupe deux fois,
- cree des notifications lors de certains evenements,
- empeche le proprietaire de quitter son propre groupe,
- trace les actions importantes dans les logs.

### `backend/src/services/session.service.ts`

Contient les regles metier des sessions.

Il :

- liste les sessions d'un groupe avec le nombre d'inscrits,
- indique si l'utilisateur courant est deja inscrit,
- verifie que l'utilisateur est membre du groupe avant de creer une session,
- refuse une date invalide ou passee,
- inscrit automatiquement le createur a sa session,
- notifie les autres membres du groupe,
- gere l'inscription, la reactivation d'une inscription annulee, la limite de participants et l'annulation.

### `backend/src/services/message.service.ts`

Gere la messagerie de groupe.

Il verifie que l'utilisateur est membre du groupe avant de lire ou envoyer des messages. Quand les messages sont lus, il enrichit chaque message avec les informations publiques de l'auteur depuis MySQL.

Pour la suppression, il verifie que le message existe, que l'utilisateur est l'auteur ou le proprietaire du groupe, puis effectue une suppression logique.

### `backend/src/services/notification.service.ts`

Gere les notifications MongoDB.

Il valide les ids MongoDB avec `Types.ObjectId`, cree les notifications, liste celles de l'utilisateur et permet de marquer une notification comme lue.

### `backend/src/services/admin.service.ts`

Contient les regles metier d'administration.

Il :

- liste les utilisateurs,
- refuse de desactiver un administrateur,
- refuse les operations incoherentes comme desactiver un compte deja desactive,
- met a jour le statut utilisateur,
- cree une notification de compte desactive,
- trace les actions admin dans les logs d'activite et de securite.

### `backend/src/services/log.service.ts`

Centralise l'ecriture et la lecture des logs.

Il expose :

- `activity` pour les actions fonctionnelles,
- `security` pour les evenements sensibles,
- `getActivityLogs`,
- `getSecurityLogs`.

Cela evite de manipuler directement les modeles MongoDB dans tous les autres services.

## Backend - repositories

### `backend/src/repositories/user.repository.ts`

Acces MySQL pour les utilisateurs.

Il permet de trouver un utilisateur par email, trouver un utilisateur par id, et creer un utilisateur avec son profil. La creation selectionne seulement les champs publics utiles et evite de renvoyer le mot de passe hash.

### `backend/src/repositories/profile.repository.ts`

Acces MySQL pour les profils.

Il recupere le profil d'un utilisateur et met a jour les champs editables : bio, niveau, disponibilite et localisation.

### `backend/src/repositories/skill.repository.ts`

Acces MySQL pour les competences.

Il liste les competences, trouve une competence par id, ajoute ou met a jour une competence utilisateur avec `upsert`, supprime une competence utilisateur et liste les competences d'un utilisateur.

### `backend/src/repositories/search.repository.ts`

Construit la requete Prisma de recherche.

Il filtre seulement les utilisateurs actifs, exclut l'utilisateur courant, filtre par ville dans le profil, filtre par competence et niveau dans `user_skills`, applique une pagination optionnelle, puis trie les resultats par prenom.

### `backend/src/repositories/group.repository.ts`

Acces MySQL pour les groupes.

Il :

- liste les groupes avec competence, proprietaire et membres,
- lit le detail d'un groupe,
- cree un groupe dans une transaction,
- ajoute le createur comme membre `OWNER`,
- cherche une adhesion,
- liste les groupes d'un utilisateur,
- cree ou supprime une adhesion,
- compte les membres.

La transaction de creation garantit que le groupe et son proprietaire membre sont crees ensemble.

### `backend/src/repositories/session.repository.ts`

Acces MySQL pour les sessions et reservations.

Il liste les sessions d'un groupe, trouve une session, cree une session, cree une reservation, reactive une reservation annulee, annule une reservation, compte les inscrits et liste les sessions d'un utilisateur.

Les reservations utilisent une contrainte unique `sessionId_userId`, ce qui evite les doublons.

### `backend/src/repositories/message.repository.ts`

Acces MongoDB pour les messages.

Il lit les messages non supprimes d'un groupe, cree un message et fait une suppression logique avec `isDeleted: true`.

### `backend/src/repositories/notification.repository.ts`

Acces MongoDB pour les notifications.

Il cree une notification, liste les notifications d'un utilisateur, et marque une notification comme lue.

### `backend/src/repositories/log.repository.ts`

Acces MongoDB pour les logs.

Il cree les logs d'activite et de securite, puis permet de recuperer les 100 derniers logs de chaque type, tries du plus recent au plus ancien.

### `backend/src/repositories/admin.repository.ts`

Acces MySQL pour les actions admin.

Il liste les utilisateurs avec des champs utiles a l'interface admin, retrouve un utilisateur par id et met a jour son statut.

## Backend - modeles MongoDB

### `backend/src/models/message.model.ts`

Modele Mongoose des messages.

Champs principaux :

- `groupId` pour lier le message a un groupe MySQL,
- `userId` pour lier l'auteur a un utilisateur MySQL,
- `content` limite a 1000 caracteres,
- `isDeleted` pour la suppression logique,
- timestamps Mongoose pour `createdAt` et `updatedAt`.

### `backend/src/models/notification.model.ts`

Modele Mongoose des notifications.

Il limite le type a quatre valeurs : `GROUP_JOINED`, `SESSION_CREATED`, `MESSAGE_RECEIVED`, `ACCOUNT_DISABLED`. Il stocke aussi titre, contenu, statut de lecture et dates.

### `backend/src/models/activityLog.model.ts`

Modele Mongoose des logs d'activite.

Il trace les actions fonctionnelles comme inscription, connexion, mise a jour de profil, creation de groupe, creation de session, envoi ou suppression de message.

Les champs `targetType` et `targetId` permettent de savoir sur quelle ressource l'action a porte.

### `backend/src/models/securityLog.model.ts`

Modele Mongoose des logs de securite.

Il trace les evenements sensibles : login reussi, login echoue, acces refuse, token invalide, compte desactive.

Ces logs sont importants pour l'administration et pour expliquer la securite au jury.

## Backend - Prisma

### `backend/prisma/schema.prisma`

Schema relationnel principal.

Enums :

- `UserRole` : `USER`, `ADMIN`.
- `UserStatus` : `ACTIVE`, `DISABLED`.
- `Level` : `BEGINNER`, `INTERMEDIATE`, `ADVANCED`.
- `GroupRole` : `OWNER`, `MEMBER`.
- `BookingStatus` : `REGISTERED`, `CANCELLED`.

Modeles :

- `User` stocke les comptes, roles, statuts et relations.
- `Profile` stocke les informations personnelles du profil.
- `Skill` stocke les competences disponibles.
- `UserSkill` relie un utilisateur a une competence avec un niveau.
- `Group` stocke les groupes collaboratifs.
- `GroupMember` relie utilisateurs et groupes avec un role.
- `Session` stocke les sessions de travail.
- `Booking` relie utilisateurs et sessions.

Les relations avec `onDelete: Cascade` nettoient les donnees dependantes quand une entite parent est supprimee.

### `backend/prisma/seed.ts`

Script d'initialisation des competences de base.

Il utilise `upsert` pour ajouter ou maintenir les competences sans creer de doublons : HTML, CSS, JavaScript, TypeScript, React, Node.js, Python, Express, MySQL, MongoDB et Docker.

### `backend/prisma/migrations/20260528173837_add_user_auth/migration.sql`

Migration initiale pour l'authentification.

Elle cree les tables `users` et `profiles`, ajoute l'unicite de l'email et relie le profil a l'utilisateur.

### `backend/prisma/migrations/20260529071305_add_skills/migration.sql`

Migration competences.

Elle ajoute les champs de profil `availability`, `level` et `location`, cree `skills`, cree `user_skills`, ajoute l'unicite utilisateur/competence et les cles etrangeres.

### `backend/prisma/migrations/20260529080215_add_groups/migration.sql`

Migration groupes.

Elle cree `groups` et `group_members`, avec proprietaire, competence associee, role de membre et contrainte unique utilisateur/groupe.

### `backend/prisma/migrations/20260529081525_add_sessions/migration.sql`

Migration sessions.

Elle cree `sessions` et `bookings`, relie les sessions aux groupes et createurs, relie les reservations aux utilisateurs et sessions, puis ajoute l'unicite session/utilisateur.

### `backend/prisma/migrations/migration_lock.toml`

Fichier Prisma qui indique que le provider de migrations est MySQL. Il est genere et ne doit pas etre modifie a la main.

## Backend - tests

### `backend/tests/README.md`

Documente les tests backend : prerequis, commandes, donnees creees et couverture fonctionnelle.

### `backend/tests/setup.ts`

Setup de tests TypeScript.

Il charge `.env`, connecte Mongoose avant les tests, puis ferme Prisma et MongoDB apres les tests.

### `backend/tests/helpers/auth.helper.ts`

Helper de test qui cree un utilisateur unique, le connecte, puis retourne son token et ses informations. Il evite de repeter register/login dans plusieurs tests.

### `backend/tests/auth.test.ts`

Teste l'inscription, la connexion et le refus d'une connexion invalide.

### `backend/tests/groups.test.ts`

Teste la creation et la liste des groupes. Il cree ou retrouve une competence de test avant de creer le groupe.

### `backend/tests/sessions.test.ts`

Teste la creation d'une session dans un groupe, avec une date future et une duree valide.

### `backend/tests/messages.test.ts`

Teste la creation et la lecture des messages. Il cree un groupe, poste un message dans MongoDB, puis verifie que la liste contient des messages.

### `backend/tests/api.integration.test.cjs`

Test d'integration complet sur le build `dist`.

Il couvre :

- health check,
- inscription et connexion,
- profil et competences,
- recherche,
- groupes,
- sessions,
- messages,
- notifications,
- administration,
- logs,
- protection contre un faux vieux token admin.

Il cree des utilisateurs temporaires avec emails uniques puis nettoie MySQL et MongoDB en fin de test.

## Frontend - configuration generale

### `frontend/package.json`

Declare les scripts et dependances frontend.

Scripts :

- `dev` lance Vite en developpement.
- `build` compile TypeScript puis construit l'application.
- `lint` lance ESLint.
- `preview` sert le build localement.

Dependances principales :

- `react` et `react-dom`,
- `react-router-dom`,
- `axios`,
- `react-hook-form`,
- `zod`,
- `lucide-react`,
- `tailwindcss`.

### `frontend/package-lock.json`

Fichier genere par npm. Il fige les versions exactes du frontend et ne contient pas de logique applicative.

### `frontend/.env.example`

Modele specifique au frontend. Il contient `VITE_API_URL`, c'est-a-dire l'adresse de base de l'API appelee par Axios.

### `frontend/.env`

Fichier local reel du frontend. Vite lit les variables prefixees par `VITE_`. Ici, `VITE_API_URL` permet au navigateur d'appeler `http://localhost:5000/api` en developpement.

### `frontend/README.md`

README genere par le template React + TypeScript + Vite. Il documente surtout Vite et ESLint, pas les fonctionnalites SkillBridge.

### `frontend/index.html`

Fichier HTML d'entree.

Il declare :

- le titre `SkillBridge`,
- le favicon,
- la div `#root`,
- le script module `src/main.tsx`.

React prend ensuite le controle de la page dans `#root`.

### `frontend/vite.config.ts`

Configuration Vite minimale avec le plugin React.

### `frontend/eslint.config.js`

Configuration ESLint moderne.

Elle ignore `dist`, applique les recommandations JavaScript, TypeScript, React Hooks et React Refresh pour les fichiers `ts` et `tsx`.

### `frontend/tsconfig.json`

Fichier racine TypeScript qui pointe vers deux configurations :

- `tsconfig.app.json` pour le code React,
- `tsconfig.node.json` pour la configuration Vite.

### `frontend/tsconfig.app.json`

Configuration TypeScript pour l'application React.

Elle active le JSX React, le typage DOM, le mode bundler et plusieurs controles de lint TypeScript.

### `frontend/tsconfig.node.json`

Configuration TypeScript pour les fichiers Node/Vite, notamment `vite.config.ts`.

### `frontend/tailwind.config.js`

Configure Tailwind pour scanner `index.html` et tous les fichiers `src` en JS/TS/JSX/TSX.

### `frontend/postcss.config.js`

Branche Tailwind CSS et Autoprefixer dans la pipeline CSS.

### `frontend/Dockerfile`

Fichier vide actuellement. Comme pour le backend, il indique une intention possible de dockerisation future.

## Frontend - entree React et routes

### `frontend/src/main.tsx`

Point d'entree React.

Il importe `App`, importe les styles globaux, puis monte l'application dans `#root` avec `ReactDOM.createRoot`.

`React.StrictMode` active des verifications supplementaires en developpement.

### `frontend/src/App.tsx`

Composant racine.

Il ne contient qu'un `RouterProvider` qui utilise le routeur defini dans `routes/AppRouter.tsx`.

### `frontend/src/routes/AppRouter.tsx`

Definit toute la navigation React.

Routes publiques :

- `/`,
- `/login`,
- `/register`.

Routes privees :

- `/dashboard`,
- `/profile`,
- `/search`,
- `/groups`,
- `/groups/:id`,
- `/groups/:id/sessions`,
- `/groups/:id/messages`,
- `/sessions`,
- `/notifications`.

Routes admin :

- `/admin/users`,
- `/admin/logs`.

Le fichier assemble aussi les layouts : `PublicLayout` pour le public et `AppLayout` pour l'espace connecte.

### `frontend/src/routes/PrivateRoute.tsx`

Route guard pour les pages connectees.

Si aucun token n'est present, l'utilisateur est redirige vers `/login`. Sinon, `Outlet` laisse React Router afficher la page enfant.

### `frontend/src/routes/AdminRoute.tsx`

Route guard pour l'administration.

Si l'utilisateur n'est pas connecte, il part vers `/login`. S'il est connecte mais pas admin, il part vers `/dashboard`. Sinon, la route admin s'affiche.

## Frontend - layouts et composants

### `frontend/src/components/layout/PublicLayout.tsx`

Layout des pages publiques.

Il affiche :

- header avec logo et boutons connexion/inscription,
- zone principale avec `Outlet`,
- footer avec contact.

### `frontend/src/components/layout/AppLayout.tsx`

Layout des pages connectees.

Il affiche :

- une sidebar desktop avec les liens principaux,
- les liens admin si `isAdmin` est vrai,
- un header avec le prenom de l'utilisateur,
- un bouton de deconnexion,
- une zone `Outlet` pour la page courante.

### `frontend/src/components/layout/AdminLayout.tsx`

Fichier vide actuellement. Le projet utilise plutot `AppLayout` pour les pages admin.

### `frontend/src/components/ui/Button.tsx`

Fichier vide actuellement. Il pourrait servir plus tard a centraliser le style des boutons.

### `frontend/src/components/ui/Input.tsx`

Fichier vide actuellement. Il pourrait servir plus tard a centraliser le style des champs de formulaire.

## Frontend - hook, schemas et utilitaires

### `frontend/src/hooks/useAuth.ts`

Hook d'authentification cote frontend.

Il lit `accessToken` et `user` dans `localStorage`, expose :

- `isAuthenticated`,
- `isAdmin`,
- `login`,
- `logout`,
- `token`,
- `user`.

`login` stocke le token et l'utilisateur. `logout` supprime les deux et redirige vers `/login`.

### `frontend/src/schemas/auth.schema.tsx`

Schemas Zod utilises par les formulaires login/register.

Ils reprennent les contraintes principales du backend pour donner un retour utilisateur avant meme l'appel API.

### `frontend/src/utils/apiError.ts`

Utilitaire d'affichage des erreurs API.

Il verifie si l'erreur vient d'Axios, puis tente de lire `error.response.data.error` ou `message`. Sinon il renvoie un message de secours.

Cela evite de dupliquer la logique de gestion d'erreur dans toutes les pages.

### `frontend/src/utils/levelLabel.ts`

Convertit les valeurs techniques de niveau en libelles francais :

- `BEGINNER` vers `Debutant`,
- `INTERMEDIATE` vers `Intermediaire`,
- `ADVANCED` vers `Avance`.

## Frontend - services API

### `frontend/src/services/api.ts`

Instance Axios centrale.

Elle definit `baseURL` depuis `VITE_API_URL`, ajoute automatiquement le header `Authorization: Bearer TOKEN` si un token existe, et intercepte les erreurs 401 pour vider la session et rediriger vers `/login`.

Tous les autres services utilisent cette instance.

### `frontend/src/services/auth.service.tsx`

Appels API d'authentification :

- `register` appelle `POST /auth/register`,
- `login` appelle `POST /auth/login`,
- `me` appelle `GET /auth/me`.

### `frontend/src/services/profile.service.ts`

Appels API du profil :

- `getMyProfile` appelle `GET /users/me/profile`,
- `updateMyProfile` appelle `PUT /users/me/profile`.

### `frontend/src/services/skill.service.ts`

Appels API des competences :

- liste toutes les competences,
- liste les competences de l'utilisateur,
- ajoute une competence avec un niveau,
- supprime une competence utilisateur.

### `frontend/src/services/search.service.ts`

Appel API de recherche d'apprenants.

Il envoie les filtres en query params a `GET /users/search`. Les champs vides sont envoyes comme `undefined` pour ne pas polluer l'URL.

### `frontend/src/services/group.service.ts`

Appels API des groupes :

- liste globale,
- mes groupes,
- detail,
- creation,
- rejoindre,
- quitter.

### `frontend/src/services/session.service.ts`

Appels API des sessions :

- sessions d'un groupe,
- creation de session,
- inscription,
- annulation d'inscription,
- mes sessions.

### `frontend/src/services/message.service.ts`

Appels API messagerie :

- lire les messages d'un groupe,
- creer un message,
- supprimer logiquement un message.

### `frontend/src/services/notification.service.ts`

Appels API notifications :

- lister les notifications de l'utilisateur,
- marquer une notification comme lue.

### `frontend/src/services/admin.service.ts`

Appels API admin :

- liste utilisateurs,
- desactivation,
- reactivation,
- logs d'activite,
- logs de securite.

## Frontend - types

### `frontend/src/types/auth.type.ts`

Types de l'utilisateur authentifie.

`AuthUser` correspond aux informations stockees dans `localStorage` et recues au login.

### `frontend/src/types/profile.type.ts`

Types du profil utilisateur et du niveau.

Le type `Level` est partage par profil, competences, groupes et recherche.

### `frontend/src/types/skill.type.ts`

Types des competences.

`Skill` represente une competence globale. `UserSkill` ajoute le niveau de l'utilisateur sur cette competence.

### `frontend/src/types/search.type.ts`

Types de la recherche.

`LearnerResult` represente un apprenant retourne par l'API avec profil et competences. `SearchFilters` represente les filtres du formulaire.

### `frontend/src/types/group.type.ts`

Types des groupes.

Il distingue :

- `GroupListItem` pour la liste,
- `GroupDetail` pour la page detail,
- `GroupMember` pour les membres,
- `MyGroup` pour les groupes de l'utilisateur,
- `CreateGroupData` pour la creation.

### `frontend/src/types/session.type.ts`

Types des sessions.

`GroupSession` contient les informations affichees dans un groupe, dont `registeredCount` et `isRegistered`. `MySession` sert a la page "Mes sessions". `CreateSessionData` sert au formulaire de creation.

### `frontend/src/types/message.type.ts`

Types de la messagerie.

Un message contient un id MongoDB string, le groupe, l'auteur, le contenu et la date.

### `frontend/src/types/notification.type.ts`

Types des notifications MongoDB.

Il reprend les types de notifications autorises cote backend et les champs d'affichage.

### `frontend/src/types/admin.type.ts`

Types des pages admin.

Il decrit les utilisateurs admin, les logs d'activite et les logs de securite.

## Frontend - pages publiques et auth

### `frontend/src/pages/public/HomePage.tsx`

Page d'accueil publique.

Elle presente SkillBridge et guide vers la connexion ou l'inscription.

### `frontend/src/pages/auth/LoginPage.tsx`

Page de connexion.

Elle utilise :

- `react-hook-form` pour gerer le formulaire,
- `zodResolver` pour valider avec Zod,
- `authService.login` pour appeler l'API,
- `useAuth.login` pour stocker token et utilisateur,
- `Navigate` pour renvoyer un utilisateur deja connecte vers `/dashboard`.

### `frontend/src/pages/auth/RegisterPage.tsx`

Page d'inscription.

Elle valide les champs avec Zod, appelle `authService.register`, puis redirige vers `/login` apres creation du compte.

## Frontend - pages application

### `frontend/src/pages/app/DashboardPage.tsx`

Tableau de bord connecte.

Au chargement, il appelle en parallele :

- profil,
- competences,
- sessions,
- notifications,
- groupes.

Il affiche ensuite des compteurs, les notifications non lues, les prochaines sessions et un resume du profil.

### `frontend/src/pages/app/ProfilePage.tsx`

Page de profil.

Elle charge le profil, toutes les competences et les competences de l'utilisateur. Elle permet de modifier le profil, ajouter une competence avec niveau et retirer une competence.

### `frontend/src/pages/app/SearchPage.tsx`

Page de recherche.

Elle charge la liste des competences pour alimenter le filtre, garde les filtres en state, appelle `searchService.searchLearners`, puis affiche les apprenants trouves avec profil et competences.

### `frontend/src/pages/app/GroupsPage.tsx`

Page liste et creation de groupes.

Elle charge groupes et competences, puis propose un formulaire de creation. Apres creation, elle vide le formulaire et recharge la liste.

### `frontend/src/pages/app/GroupDetailPage.tsx`

Page detail d'un groupe.

Elle recupere l'id dans l'URL, charge le groupe, calcule si l'utilisateur est membre ou proprietaire, puis affiche les actions possibles : rejoindre, quitter, aller aux sessions ou a la messagerie.

### `frontend/src/pages/app/GroupSessionsPage.tsx`

Page sessions d'un groupe.

Elle liste les sessions, permet d'en creer une et permet de s'inscrire a une session. Elle gere aussi les messages de succes et erreurs API.

### `frontend/src/pages/app/SessionsPage.tsx`

Page "Mes sessions".

Elle liste les sessions reservees par l'utilisateur et permet d'annuler une participation.

### `frontend/src/pages/app/GroupMessagesPage.tsx`

Page messagerie de groupe.

Elle charge le groupe et les messages, scroll vers le bas quand les messages changent, permet d'envoyer un message et permet de supprimer un message si l'utilisateur en est l'auteur ou le proprietaire du groupe.

### `frontend/src/pages/app/NotificationsPage.tsx`

Page notifications.

Elle liste les notifications, compte les non lues et permet de marquer chaque notification comme lue.

## Frontend - pages admin

### `frontend/src/pages/admin/AdminUsersPage.tsx`

Page de gestion des utilisateurs.

Elle charge la liste des utilisateurs, puis permet de desactiver ou reactiver un compte via `adminService`. Les actions affichent un message de succes ou d'erreur.

### `frontend/src/pages/admin/AdminLogsPage.tsx`

Page des logs admin.

Elle charge les logs d'activite et de securite, puis affiche l'un ou l'autre selon l'onglet selectionne.

## Frontend - styles et assets

### `frontend/src/index.css`

Point d'entree CSS Tailwind.

Il importe les couches Tailwind `base`, `components` et `utilities`.

### `frontend/src/App.css`

CSS issu du template Vite/React. Il contient des styles pour des elements comme `.counter`, `.hero`, `#center` ou `#next-steps`.

Dans l'etat actuel, l'application principale utilise surtout Tailwind directement dans les composants. Ce fichier semble etre un reste du template et peut etre peu utilise.

### `frontend/src/assets/hero.png`

Image d'illustration de l'application. Elle sert d'asset visuel potentiel pour la page publique.

### `frontend/src/assets/favicon.png`

Favicon PNG utilise par `frontend/index.html`.

### `frontend/src/assets/react.svg` et `frontend/src/assets/vite.svg`

Assets du template Vite/React. Ils ne portent pas de logique SkillBridge.

### `frontend/public/favicon.svg` et `frontend/public/icons.svg`

Assets SVG statiques disponibles depuis le dossier public. Ils peuvent servir d'icones ou de favicon, mais le HTML actuel pointe vers `src/assets/favicon.png`.

## Documentation existante

### `docs/SECURITY_CHECKLIST.md`

Checklist securite du projet.

Elle recense les points deja traites : bcrypt, JWT, routes privees, middleware admin, validation Zod, CORS, Helmet, rate limiting, variables `.env`, contraintes MySQL, validation Mongoose, logs de securite, suppression logique et minimisation des donnees.

### `docs/JURY_CHECKLIST.md`

Checklist de demonstration pour le jury.

Elle indique quels fichiers ouvrir et quelles phrases simples utiliser pour expliquer la securite, les roles, la validation, les bases de donnees, les logs et les actions sensibles.

### `docs/VERIFICATIONS_BACKEND.txt`

Guide de verification backend.

Il detaille les commandes a executer, les URLs a tester, les resultats attendus et les endpoints principaux a verifier avec Postman ou PowerShell.

### `frontend/VERIFICATIONS_FRONTEND.txt`

Guide de verification frontend.

Il detaille les pages a tester, les actions utilisateur attendues, les routes principales, les services API et les types TypeScript.

### `docs/images/*`

Dossier d'images pour la documentation et la soutenance.

Les fichiers couvrent notamment :

- architecture globale,
- architecture backend,
- architecture Docker,
- structure du projet,
- structure React,
- flux d'une requete,
- MCD et MLD,
- schemas MongoDB,
- wireframes,
- captures Swagger,
- captures Docker,
- captures de tests,
- captures des pages frontend,
- schemas de workflow Git.

Ces images servent a expliquer visuellement le projet. Elles ne contiennent pas de logique executable.

## Notes de maintenance

### Fichiers vides reperes

Les fichiers suivants existent mais ne contiennent pas encore de code :

- `backend/Dockerfile`
- `frontend/Dockerfile`
- `frontend/src/components/layout/AdminLayout.tsx`
- `frontend/src/components/ui/Button.tsx`
- `frontend/src/components/ui/Input.tsx`

Ils ne sont pas dangereux, mais ils peuvent creer une petite confusion. Soit ils serviront plus tard, soit ils pourront etre retires si le projet doit etre nettoye.

### Lockfiles

Les fichiers `package-lock.json` sont volontairement presents. Ils garantissent des installations reproductibles. Ils ne doivent pas etre commentes ligne par ligne ni modifies manuellement.

### Donnees sensibles

Les fichiers `.env` locaux ne doivent pas etre documentes avec leurs vraies valeurs secretes. La bonne reference publique reste `.env.example`.

### Lecture rapide pour l'oral

Pour expliquer le projet rapidement :

1. Montrer `frontend/src/routes/AppRouter.tsx` pour les pages.
2. Montrer `frontend/src/services/api.ts` pour les appels API et le token.
3. Montrer `backend/src/app.ts` pour les middlewares globaux.
4. Montrer `backend/src/routes/index.routes.ts` pour l'organisation REST.
5. Montrer `backend/src/services/auth.service.ts` pour bcrypt et JWT.
6. Montrer `backend/src/middlewares/role.middleware.ts` pour le controle admin.
7. Montrer `backend/prisma/schema.prisma` pour MySQL.
8. Montrer `backend/src/models/securityLog.model.ts` pour MongoDB et les logs.
