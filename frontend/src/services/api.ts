// Importation de la bibliothèque Axios.
// Axios est utilisé pour effectuer des requêtes HTTP vers le backend.
import axios from "axios";

/**
 * Création d'une instance Axios personnalisée.
 *
 * Cette instance sera utilisée dans toute l'application
 * pour centraliser la configuration des appels API.
 */
export const api = axios.create({
  /**
   * URL de base de l'API.
   *
   * Priorité :
   * 1. Variable d'environnement Vite
   * 2. URL locale de développement
   *
   * Exemple :
   * https://api.skillbridge.com/api
   *
   * ou en développement :
   * http://localhost:5000/api
   */
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

/**
 * ==================================================
 * INTERCEPTOR DE REQUÊTES
 * ==================================================
 *
 * Cet interceptor s'exécute automatiquement
 * avant chaque requête HTTP.
 */
api.interceptors.request.use((config) => {
  // Récupération du token JWT stocké localement
  const token = localStorage.getItem("accessToken");

  /**
   * Si un token existe,
   * on l'ajoute dans l'en-tête Authorization.
   */
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Retourne la configuration modifiée
  return config;
});

/**
 * ==================================================
 * INTERCEPTOR DE RÉPONSES
 * ==================================================
 *
 * Cet interceptor s'exécute automatiquement
 * après chaque réponse du serveur.
 */
api.interceptors.response.use(
  /**
   * Cas n°1 :
   * La requête a réussi.
   *
   * On retourne simplement la réponse.
   */
  (response) => response,

  /**
   * Cas n°2 :
   * Une erreur est retournée par le serveur.
   */
  (error) => {
    /**
     * Vérification d'une erreur 401.
     *
     * 401 = Unauthorized
     *
     * Cela signifie généralement :
     * - token expiré
     * - token invalide
     * - utilisateur supprimé
     * - utilisateur déconnecté côté serveur
     */
    if (error.response?.status === 401) {
      // Suppression du token JWT
      localStorage.removeItem("accessToken");

      // Suppression des données utilisateur
      localStorage.removeItem("user");

      /**
       * Redirection automatique vers la page de connexion.
       *
       * L'utilisateur devra se reconnecter.
       */
      window.location.href = "/login";
    }

    /**
     * Propagation de l'erreur.
     *
     * Permet aux composants ou services appelants
     * de gérer eux-mêmes l'erreur.
     */
    return Promise.reject(error);
  },
);
