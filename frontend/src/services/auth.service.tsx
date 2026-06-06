// Importation de l'instance Axios configurée de l'application.
// Cette instance contient déjà :
// - l'URL de base de l'API
// - la gestion automatique du token JWT
// - la gestion des erreurs 401
import { api } from "./api";

// Type représentant un utilisateur authentifié
import type { AuthUser } from "../types/auth.type";

/**
 * Structure de la réponse retournée
 * par l'endpoint de connexion.
 */
interface LoginResponse {
  // Informations de l'utilisateur connecté
  user: AuthUser;

  // JWT utilisé pour authentifier les requêtes futures
  accessToken: string;
}

/**
 * Service d'authentification.
 *
 * Centralise tous les appels API liés :
 * - à l'inscription
 * - à la connexion
 * - à la récupération du profil connecté
 */
export const authService = {
  /**
   * Inscription d'un nouvel utilisateur.
   *
   * Route API :
   * POST /auth/register
   *
   * @param data Données du formulaire d'inscription
   */
  async register(data: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
  }) {
    // Envoi des données au backend
    const response = await api.post("/auth/register", data);

    // Retour des données envoyées par l'API
    return response.data;
  },

  /**
   * Connexion utilisateur.
   *
   * Route API :
   * POST /auth/login
   *
   * @param data Identifiants de connexion
   *
   * Retour :
   * {
   *   user,
   *   accessToken
   * }
   */
  async login(data: { email: string; password: string }) {
    // Appel API typé avec LoginResponse
    const response = await api.post<LoginResponse>("/auth/login", data);

    // Retourne :
    // - les informations utilisateur
    // - le JWT
    return response.data;
  },

  /**
   * Récupère les informations
   * de l'utilisateur actuellement connecté.
   *
   * Route API :
   * GET /auth/me
   *
   * Le JWT est automatiquement ajouté
   * grâce à l'interceptor Axios.
   */
  async me() {
    const response = await api.get<AuthUser>("/auth/me");

    // Retourne l'utilisateur connecté
    return response.data;
  },
};
