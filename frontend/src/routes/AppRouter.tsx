// Fonction principale de React Router permettant de créer
// l'arborescence complète des routes de l'application
import { createBrowserRouter } from "react-router-dom";

// Layout public utilisé pour les visiteurs non connectés
import PublicLayout from "../components/layout/PublicLayout";

// Layout principal utilisé après connexion
import AppLayout from "../components/layout/AppLayout";

// Route protégée nécessitant une authentification
import PrivateRoute from "./PrivateRoute";

// Route protégée réservée aux administrateurs
import AdminRoute from "./AdminRoute";

// Pages publiques
import HomePage from "../pages/public/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

// Pages accessibles aux utilisateurs connectés
import DashboardPage from "../pages/app/DashboardPage";
import ProfilePage from "../pages/app/ProfilePage";
import SearchPage from "../pages/app/SearchPage";
import GroupsPage from "../pages/app/GroupsPage";
import GroupDetailPage from "../pages/app/GroupDetailPage";
import GroupSessionsPage from "../pages/app/GroupSessionsPage";
import GroupMessagesPage from "../pages/app/GroupMessagesPage";
import SessionsPage from "../pages/app/SessionsPage";
import NotificationsPage from "../pages/app/NotificationsPage";

// Pages d'administration
import AdminUsersPage from "../pages/admin/AdminUsersPage";
import AdminLogsPage from "../pages/admin/AdminLogsPage";

// Création du routeur principal de l'application
export const router = createBrowserRouter([
  /**
   * ==================================================
   * ROUTES PUBLIQUES
   * ==================================================
   *
   * Accessibles sans authentification.
   * Utilisent le layout PublicLayout.
   */
  {
    element: <PublicLayout />,

    children: [
      {
        // Page d'accueil
        path: "/",
        element: <HomePage />,
      },
      {
        // Connexion utilisateur
        path: "/login",
        element: <LoginPage />,
      },
      {
        // Inscription utilisateur
        path: "/register",
        element: <RegisterPage />,
      },
    ],
  },

  /**
   * ==================================================
   * ROUTES PRIVÉES
   * ==================================================
   *
   * Nécessitent que l'utilisateur soit connecté.
   * PrivateRoute vérifie l'authentification.
   */
  {
    element: <PrivateRoute />,

    children: [
      {
        // Layout principal de l'application
        element: <AppLayout />,

        children: [
          /**
           * Tableau de bord utilisateur
           */
          {
            path: "/dashboard",
            element: <DashboardPage />,
          },

          /**
           * Gestion du profil utilisateur
           */
          {
            path: "/profile",
            element: <ProfilePage />,
          },

          /**
           * Recherche d'apprenants
           */
          {
            path: "/search",
            element: <SearchPage />,
          },

          /**
           * Liste des groupes
           */
          {
            path: "/groups",
            element: <GroupsPage />,
          },

          /**
           * Détail d'un groupe
           *
           * :id représente un paramètre dynamique
           * Exemple :
           * /groups/5
           */
          {
            path: "/groups/:id",
            element: <GroupDetailPage />,
          },

          /**
           * Sessions associées à un groupe
           *
           * Exemple :
           * /groups/5/sessions
           */
          {
            path: "/groups/:id/sessions",
            element: <GroupSessionsPage />,
          },

          /**
           * Messagerie d'un groupe
           *
           * Exemple :
           * /groups/5/messages
           */
          {
            path: "/groups/:id/messages",
            element: <GroupMessagesPage />,
          },

          /**
           * Sessions auxquelles l'utilisateur participe
           */
          {
            path: "/sessions",
            element: <SessionsPage />,
          },

          /**
           * Notifications utilisateur
           */
          {
            path: "/notifications",
            element: <NotificationsPage />,
          },
        ],
      },
    ],
  },

  /**
   * ==================================================
   * ROUTES ADMINISTRATEUR
   * ==================================================
   *
   * Nécessitent :
   * - un utilisateur connecté
   * - un rôle ADMIN
   *
   * Vérification effectuée dans AdminRoute.
   */
  {
    element: <AdminRoute />,

    children: [
      {
        // Réutilisation du même layout applicatif
        element: <AppLayout />,

        children: [
          /**
           * Gestion des utilisateurs
           */
          {
            path: "/admin/users",
            element: <AdminUsersPage />,
          },

          /**
           * Consultation des logs
           */
          {
            path: "/admin/logs",
            element: <AdminLogsPage />,
          },
        ],
      },
    ],
  },
]);
