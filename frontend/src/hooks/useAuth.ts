// Importation du type AuthUser
// Ce type définit la structure des données utilisateur
// (id, firstname, email, role, etc.)
import type { AuthUser } from "../types/auth.type";

// Hook personnalisé permettant de gérer l'authentification
export const useAuth = () => {
  // Récupération du token JWT stocké dans le localStorage
  // Le token est utilisé pour identifier l'utilisateur auprès de l'API
  const token = localStorage.getItem("accessToken");

  // Récupération des informations utilisateur sous forme de chaîne JSON
  const userRaw = localStorage.getItem("user");

  // Conversion de la chaîne JSON en objet JavaScript
  // Si aucune donnée n'est trouvée, user vaut null
  const user: AuthUser | null = userRaw ? JSON.parse(userRaw) : null;

  // Vérifie si un utilisateur est connecté
  // Boolean() convertit la valeur en true ou false
  // Si token existe → true
  // Sinon → false
  const isAuthenticated = Boolean(token);

  // Vérifie si l'utilisateur possède le rôle ADMIN
  // L'opérateur ?. évite une erreur si user vaut null
  const isAdmin = user?.role === "ADMIN";

  /**
   * Fonction de connexion
   *
   * @param accessToken Token JWT reçu depuis l'API
   * @param user Informations de l'utilisateur connecté
   */
  const login = (accessToken: string, user: AuthUser) => {
    // Sauvegarde du token dans le navigateur
    localStorage.setItem("accessToken", accessToken);

    // Sauvegarde des informations utilisateur
    // JSON.stringify transforme l'objet en chaîne JSON
    localStorage.setItem("user", JSON.stringify(user));
  };

  /**
   * Fonction de déconnexion
   */
  const logout = () => {
    // Suppression du token
    localStorage.removeItem("accessToken");

    // Suppression des informations utilisateur
    localStorage.removeItem("user");

    // Redirection vers la page de connexion
    // Recharge complètement l'application
    window.location.href = "/login";
  };

  // Valeurs et fonctions exposées par le hook
  return {
    token, // Token JWT actuel
    user, // Utilisateur connecté
    isAuthenticated, // Statut de connexion
    isAdmin, // Vérifie si l'utilisateur est administrateur
    login, // Fonction de connexion
    logout, // Fonction de déconnexion
  };
};
