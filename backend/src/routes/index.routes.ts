// Import du routeur Express.
// Ce routeur principal servira de point d'entrée
// pour toutes les routes de l'API.
import { Router } from "express";

/**
 * Import des différents modules de routes.
 *
 * Chaque module est responsable
 * d'un domaine fonctionnel spécifique.
 */

// Authentification (login, register, me)
import authRoutes from "./auth.routes";

// Gestion des profils utilisateurs
import profileRoutes from "./profile.routes";

// Gestion des compétences utilisateurs
import skillRoutes from "./skill.routes";

// Recherche d'apprenants
import searchRoutes from "./search.routes";

// Gestion des groupes
import groupRoutes from "./group.routes";

// Gestion des sessions d'apprentissage
import sessionRoutes from "./session.routes";

// Gestion de la messagerie
import messageRoutes from "./message.routes";

// Gestion des notifications
import notificationRoutes from "./notification.routes";

// Administration
import adminRoutes from "./admin.routes";

// Création du routeur principal.
const router = Router();

/**
 * ====================================
 * Route de santé (Health Check)
 * ====================================
 */

/**
 * GET /health
 *
 * Permet de vérifier rapidement
 * que l'API fonctionne correctement.
 *
 * Cette route est souvent utilisée :
 * - par Docker
 * - par Kubernetes
 * - par les outils de monitoring
 * - par les load balancers
 */
router.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "SkillBridge API is running",
  });
});

/**
 * ====================================
 * Enregistrement des modules de routes
 * ====================================
 */

/**
 * Routes d'authentification
 *
 * Préfixe :
 * /auth
 *
 * Exemples :
 * POST /auth/register
 * POST /auth/login
 * GET  /auth/me
 */
router.use("/auth", authRoutes);

/**
 * Routes liées aux profils utilisateurs.
 *
 * Préfixe :
 * /users
 *
 * Exemples :
 * GET    /users/profile
 * PATCH  /users/profile
 */
router.use("/users", profileRoutes);

/**
 * Routes liées aux compétences.
 *
 * Préfixe :
 * /users
 *
 * Exemples :
 * GET    /users/skills
 * POST   /users/skills
 * DELETE /users/skills/:id
 */
router.use("/users", skillRoutes);

/**
 * Routes de recherche d'apprenants.
 *
 * Préfixe :
 * /users
 *
 * Exemples :
 * GET /users/search
 */
router.use("/users", searchRoutes);

/**
 * Routes de gestion des groupes.
 *
 * Préfixe :
 * /groups
 *
 * Exemples :
 * GET    /groups
 * POST   /groups
 * POST   /groups/:id/join
 */
router.use("/groups", groupRoutes);

/**
 * Routes de gestion des sessions.
 *
 * Les chemins complets sont définis
 * directement dans session.routes.ts.
 */
router.use("/", sessionRoutes);

/**
 * Routes liées à la messagerie.
 *
 * Exemples possibles :
 * /groups/:id/messages
 */
router.use("/", messageRoutes);

/**
 * Routes liées aux notifications.
 *
 * Exemples :
 * /notifications
 */
router.use("/", notificationRoutes);

/**
 * Routes d'administration.
 *
 * Préfixe :
 * /admin
 *
 * Exemples :
 * GET   /admin/users
 * PATCH /admin/users/:id/disable
 * GET   /admin/logs/activity
 */
router.use("/admin", adminRoutes);

/**
 * Export du routeur principal.
 *
 * Il sera monté dans app.ts ou server.ts :
 *
 * app.use("/api", router);
 */
export default router;
