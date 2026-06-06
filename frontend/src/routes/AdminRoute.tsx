// Importation des composants React Router
// Navigate : permet de rediriger automatiquement l'utilisateur
// Outlet : affiche les routes enfants si l'accès est autorisé
import { Navigate, Outlet } from "react-router-dom";

// Hook personnalisé permettant de récupérer les informations
// d'authentification de l'utilisateur connecté
import { useAuth } from "../hooks/useAuth";

// Composant de protection des routes administrateur
export default function AdminRoute() {
  // Récupération des informations d'authentification
  // isAuthenticated : indique si l'utilisateur est connecté
  // isAdmin : indique si l'utilisateur possède le rôle ADMIN
  const { isAuthenticated, isAdmin } = useAuth();

  /**
   * Cas n°1 :
   * L'utilisateur n'est pas connecté.
   *
   * On le redirige vers la page de connexion.
   */
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  /**
   * Cas n°2 :
   * L'utilisateur est connecté mais n'est pas administrateur.
   *
   * Il n'a pas le droit d'accéder aux pages d'administration.
   * On le redirige vers son tableau de bord.
   */
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  /**
   * Cas n°3 :
   * L'utilisateur est connecté ET possède le rôle ADMIN.
   *
   * L'accès est autorisé.
   * Outlet affichera la page enfant correspondante :
   * - /admin/users
   * - /admin/logs
   * - toute autre route protégée par AdminRoute
   */
  return <Outlet />;
}
