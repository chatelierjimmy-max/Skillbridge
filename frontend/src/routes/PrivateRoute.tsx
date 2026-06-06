// Importation des composants React Router
// Navigate : permet de rediriger automatiquement l'utilisateur
// Outlet : affiche les routes enfants si l'accès est autorisé
import { Navigate, Outlet } from "react-router-dom";

// Hook personnalisé permettant de récupérer
// les informations d'authentification de l'utilisateur
import { useAuth } from "../hooks/useAuth";

// Composant de protection des routes privées
export default function PrivateRoute() {
  // Récupération de l'état d'authentification
  // true : utilisateur connecté
  // false : utilisateur non connecté
  const { isAuthenticated } = useAuth();

  /**
   * Vérifie si l'utilisateur est connecté.
   *
   * Si ce n'est pas le cas,
   * il est redirigé vers la page de connexion.
   */
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  /**
   * Si l'utilisateur est authentifié,
   * Outlet affichera la route enfant correspondante.
   *
   * Exemple :
   * - /dashboard
   * - /profile
   * - /groups
   * - /sessions
   */
  return <Outlet />;
}
