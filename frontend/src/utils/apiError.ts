/**
 * Importation de la bibliothèque Axios.
 *
 * Axios est utilisé dans l'application pour :
 * - envoyer des requêtes HTTP vers l'API
 * - gérer les réponses
 * - intercepter les erreurs serveur
 */
import axios from "axios";

/**
 * Structure standardisée des erreurs
 * renvoyées par l'API backend.
 *
 * Selon les endpoints, le backend peut
 * renvoyer soit :
 *
 * {
 *   error: "Message d'erreur"
 * }
 *
 * ou :
 *
 * {
 *   message: "Message d'erreur"
 * }
 *
 * Les propriétés sont optionnelles car
 * toutes les réponses d'erreur ne possèdent
 * pas forcément les deux champs.
 */
interface ApiErrorResponse {
  /**
   * Message d'erreur principal.
   */
  error?: string;

  /**
   * Message alternatif utilisé par
   * certains endpoints.
   */
  message?: string;
}

/**
 * Extrait un message d'erreur lisible
 * à partir d'une exception capturée.
 *
 * Cette fonction permet d'uniformiser
 * la gestion des erreurs dans toute
 * l'application.
 *
 * @param error Erreur capturée dans un bloc catch
 * @param fallback Message par défaut à afficher
 *
 * @returns Message d'erreur exploitable pour l'utilisateur
 */
export function getApiErrorMessage(error: unknown, fallback: string) {
  /**
   * Vérifie si l'erreur provient d'Axios.
   *
   * Cela garantit que l'objet possède :
   * - response
   * - status
   * - data
   */
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    /**
     * Priorité des messages :
     *
     * 1. error
     * 2. message
     * 3. fallback
     *
     * Exemple :
     *
     * {
     *   error: "Email déjà utilisé"
     * }
     *
     * => retourne :
     * "Email déjà utilisé"
     */
    return (
      error.response?.data?.error || error.response?.data?.message || fallback
    );
  }

  /**
   * Si l'erreur n'est pas une erreur Axios,
   * on retourne le message générique fourni.
   */
  return fallback;
}
