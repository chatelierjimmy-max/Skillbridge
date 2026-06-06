/**
 * ==========================================================
 * TYPES DES SESSIONS D'APPRENTISSAGE
 * ==========================================================
 *
 * Ce fichier contient les structures utilisées pour gérer
 * les sessions collaboratives de SkillBridge.
 *
 * Une session représente une réunion organisée par un groupe
 * afin de travailler sur une compétence ou un sujet précis.
 *
 * Utilisé par :
 * - GroupSessionsPage
 * - SessionsPage
 * - DashboardPage
 * - sessionService
 */

/**
 * Représente une session appartenant à un groupe.
 *
 * Utilisée dans :
 * - la liste des sessions d'un groupe
 * - l'inscription à une session
 */
export interface GroupSession {
  /**
   * Identifiant unique de la session.
   */
  id: number;

  /**
   * Titre de la session.
   *
   * Exemple :
   * "Introduction aux Hooks React"
   */
  title: string;

  /**
   * Description détaillée.
   *
   * Facultative.
   */
  description?: string;

  /**
   * Date et heure de début.
   *
   * Format ISO :
   * 2026-06-06T18:30:00.000Z
   */
  startDate: string;

  /**
   * Durée prévue en minutes.
   *
   * Exemple :
   * 60
   * 90
   * 120
   */
  duration: number;

  /**
   * Nombre maximal de participants.
   *
   * Peut être absent si aucune limite
   * n'est définie.
   */
  maxParticipants?: number;

  /**
   * Nombre actuel d'inscrits.
   */
  registeredCount: number;

  /**
   * Indique si l'utilisateur connecté
   * est déjà inscrit à cette session.
   *
   * true  → inscrit
   * false → non inscrit
   */
  isRegistered: boolean;

  /**
   * Créateur de la session.
   */
  creator: {
    /**
     * Identifiant du créateur.
     */
    id: number;

    /**
     * Prénom du créateur.
     */
    firstname: string;

    /**
     * Nom du créateur.
     */
    lastname: string;
  };
}

/**
 * Représente une session à laquelle
 * l'utilisateur connecté participe.
 *
 * Utilisée dans :
 * - SessionsPage
 * - DashboardPage
 */
export interface MySession {
  /**
   * Identifiant de la session.
   */
  id: number;

  /**
   * Titre de la session.
   */
  title: string;

  /**
   * Description éventuelle.
   */
  description?: string;

  /**
   * Date et heure de début.
   */
  startDate: string;

  /**
   * Durée en minutes.
   */
  duration: number;

  /**
   * Groupe auquel appartient la session.
   */
  group: {
    /**
     * Identifiant du groupe.
     */
    id: number;

    /**
     * Nom du groupe.
     */
    name: string;

    /**
     * Compétence principale du groupe.
     *
     * Exemple :
     * React
     * Node.js
     * TypeScript
     */
    skill: string;
  };

  /**
   * État de l'inscription.
   *
   * REGISTERED :
   * participation active.
   *
   * CANCELLED :
   * participation annulée.
   */
  bookingStatus: "REGISTERED" | "CANCELLED";
}

/**
 * Données nécessaires à la création
 * d'une nouvelle session.
 *
 * Utilisée lors de l'appel :
 *
 * sessionService.createSession()
 */
export interface CreateSessionData {
  /**
   * Titre de la session.
   */
  title: string;

  /**
   * Description facultative.
   */
  description?: string;

  /**
   * Date et heure de début.
   *
   * Envoyée au format ISO.
   */
  startDate: string;

  /**
   * Durée en minutes.
   */
  duration: number;

  /**
   * Nombre maximal de participants.
   *
   * Facultatif.
   */
  maxParticipants?: number;
}
