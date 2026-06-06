/**
 * ==========================================================
 * TYPES DE LA MESSAGERIE DE GROUPE
 * ==========================================================
 *
 * Ce fichier contient les structures utilisées pour gérer
 * les messages dans la messagerie collaborative SkillBridge.
 *
 * Il est utilisé par :
 * - messageService
 * - GroupMessagesPage
 * - Backend API Messages
 */

/**
 * Représente l'auteur d'un message.
 *
 * Cet objet est généralement inclus dans la réponse
 * du backend afin d'éviter de devoir refaire une requête
 * pour récupérer les informations utilisateur.
 */
export interface MessageAuthor {
  /**
   * Identifiant unique de l'utilisateur.
   */
  id: number;

  /**
   * Prénom de l'auteur.
   */
  firstname: string;

  /**
   * Nom de famille de l'auteur.
   */
  lastname: string;
}

/**
 * Représente un message enregistré dans un groupe.
 *
 * Cette structure est utilisée pour afficher
 * l'historique complet d'une conversation.
 */
export interface GroupMessage {
  /**
   * Identifiant MongoDB du message.
   *
   * Exemple :
   * "684f7d5f1c8b1e5b3a4d9e12"
   */
  id: string;

  /**
   * Identifiant du groupe auquel
   * appartient le message.
   */
  groupId: number;

  /**
   * Identifiant de l'utilisateur
   * ayant envoyé le message.
   */
  userId: number;

  /**
   * Informations de l'auteur.
   *
   * Peut être null si l'utilisateur
   * a été supprimé ou n'est plus accessible.
   */
  author: MessageAuthor | null;

  /**
   * Contenu textuel du message.
   */
  content: string;

  /**
   * Date et heure d'envoi.
   *
   * Format ISO :
   * 2026-06-06T14:35:00.000Z
   */
  createdAt: string;
}

/**
 * Données nécessaires à la création
 * d'un nouveau message.
 *
 * Utilisé lors de l'envoi d'un message
 * vers le backend.
 */
export interface CreateMessageData {
  /**
   * Texte du message à envoyer.
   */
  content: string;
}
