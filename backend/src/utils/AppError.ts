/**
 * Classe d'erreur personnalisée de l'application.
 *
 * Cette classe étend l'objet Error natif de JavaScript
 * afin d'ajouter des informations supplémentaires utiles
 * pour la gestion centralisée des erreurs HTTP.
 *
 * Elle est utilisée dans toute l'application pour lever
 * des erreurs métier contrôlées :
 *
 * Exemple :
 *
 * throw new AppError("Utilisateur introuvable", 404);
 */
export class AppError extends Error {
  /**
   * Code HTTP associé à l'erreur.
   *
   * Exemples :
   * - 400 : Bad Request
   * - 401 : Unauthorized
   * - 403 : Forbidden
   * - 404 : Not Found
   * - 409 : Conflict
   * - 500 : Internal Server Error
   */
  public readonly statusCode: number;

  /**
   * Indique si l'erreur est attendue
   * et gérée par l'application.
   *
   * true  → erreur métier connue
   * false → erreur système inattendue
   */
  public readonly isOperational: boolean;

  /**
   * Constructeur de l'erreur.
   *
   * @param message Message retourné au client
   * @param statusCode Code HTTP associé
   */
  constructor(message: string, statusCode = 500) {
    // Appel du constructeur parent Error.
    super(message);

    // Stockage du code HTTP.
    this.statusCode = statusCode;

    // Marque l'erreur comme opérationnelle.
    // Cela permet au middleware global
    // de distinguer les erreurs métier
    // des erreurs système.
    this.isOperational = true;

    /**
     * Capture propre de la stack trace.
     *
     * Permet d'obtenir une pile d'appels
     * plus lisible lors du débogage.
     *
     * La stack commencera à l'endroit où
     * AppError est instanciée et non dans
     * le constructeur lui-même.
     */
    Error.captureStackTrace(this, this.constructor);
  }
}
