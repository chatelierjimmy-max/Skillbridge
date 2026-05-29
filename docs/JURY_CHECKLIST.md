# Checklist jury - elements a montrer

## Dans le dossier projet

- [ ] `backend/src/services/auth.service.ts`
  - Montrer le hash bcrypt des mots de passe.
  - A expliquer : le mot de passe n'est jamais stocke en clair.

- [ ] `backend/src/middlewares/auth.middleware.ts`
  - Montrer la verification du JWT.
  - A expliquer : les routes privees exigent un token valide.

- [ ] `backend/src/middlewares/role.middleware.ts`
  - Montrer le controle du role `ADMIN`.
  - A expliquer : les routes admin verifient le role directement en base.

- [ ] `backend/src/middlewares/validate.middleware.ts`
  - Montrer la validation Zod.
  - A expliquer : les donnees entrantes sont controlees avant d'arriver aux controllers.

- [ ] `backend/src/app.ts`
  - Montrer `helmet`, `cors`, `express.json` et `globalRateLimiter`.
  - A expliquer : securite HTTP, origine frontend autorisee, limite JSON, limitation des requetes.

- [ ] `backend/src/middlewares/rateLimit.middleware.ts`
  - Montrer `globalRateLimiter` et `authRateLimiter`.
  - A expliquer : protection contre les abus et tentatives repetitives de connexion.

- [ ] `backend/prisma/schema.prisma`
  - Montrer le schema MySQL.
  - A expliquer : tables relationnelles, contraintes uniques, relations et enums.

- [ ] `backend/src/models/securityLog.model.ts`
  - Montrer le modele Mongoose des logs de securite.
  - A expliquer : MongoDB stocke les evenements de securite.

- [ ] Mongo Express
  - URL : http://localhost:8081
  - Base : `skillbridge`
  - Collection : `securitylogs`
  - A montrer : une capture ou la collection ouverte avec des logs visibles.

## Elements fonctionnels a demontrer

- [ ] Connexion utilisateur
- [ ] Acces refuse sans token sur une route privee
- [ ] Acces admin accepte avec un compte `ADMIN`
- [ ] Acces admin refuse avec un compte `USER`
- [ ] Desactivation et reactivation d'un utilisateur
- [ ] Consultation des logs de securite
- [ ] Creation puis suppression logique d'un message

## Phrases courtes pour le jury

- Les mots de passe sont hashes avec bcrypt.
- L'authentification utilise un JWT.
- Les routes privees passent par un middleware d'authentification.
- Les routes admin passent par un middleware de role.
- Les donnees envoyees au serveur sont validees avec Zod.
- Les donnees relationnelles sont stockees dans MySQL avec Prisma.
- Les messages, notifications et logs sont stockes dans MongoDB avec Mongoose.
- Les messages sont supprimes logiquement avec `isDeleted`.
- Les logs de securite permettent de tracer les connexions et actions sensibles.
