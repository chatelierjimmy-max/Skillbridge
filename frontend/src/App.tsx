/**
 * ==========================================================
 * IMPORTATIONS
 * ==========================================================
 */

/**
 * RouterProvider est le composant principal de React Router.
 *
 * Son rôle est d'injecter la configuration des routes
 * dans toute l'application.
 *
 * Il permet :
 * - la navigation entre les pages
 * - l'utilisation des composants Link
 * - l'accès aux paramètres d'URL
 * - la gestion des routes protégées
 */
import { RouterProvider } from "react-router-dom";

/**
 * Importation de la configuration du routeur.
 *
 * Le fichier AppRouter contient toutes les routes
 * de l'application :
 *
 * - /
 * - /login
 * - /register
 * - /dashboard
 * - /profile
 * - /groups
 * - /sessions
 * - /notifications
 * - /admin/*
 */
import { router } from "./routes/AppRouter";

/**
 * ==========================================================
 * COMPOSANT RACINE DE L'APPLICATION
 * ==========================================================
 *
 * App est le premier composant exécuté par React.
 *
 * Il agit comme point d'entrée de l'interface.
 *
 * Son unique responsabilité est de fournir le système
 * de navigation à l'application via RouterProvider.
 */
export default function App() {
  /**
   * RouterProvider rend automatiquement
   * le composant correspondant à l'URL actuelle.
   *
   * Exemple :
   *
   * URL :
   * /login
   *
   * Affiche :
   * LoginPage
   *
   * --------------------------
   *
   * URL :
   * /dashboard
   *
   * Affiche :
   * DashboardPage
   *
   * --------------------------
   *
   * URL :
   * /groups/12
   *
   * Affiche :
   * GroupDetailPage
   */
  return <RouterProvider router={router} />;
}
