/**
 * ==========================================================
 * TYPES DES NOTIFICATIONS
 * ==========================================================
 *
 * Ce fichier définit les structures utilisées pour gérer
 * les notifications dans SkillBridge.
 *
 * Les notifications permettent d'informer les utilisateurs
 * lorsqu'un événement important se produit :
 * - arrivée d'un nouveau membre dans un groupe
 * - création d'une session
 * - réception d'un message
 * - désactivation d'un compte
 *
 * Ces types sont utilisés notamment dans :
 * - notificationService
 * - NotificationsPage
 * - DashboardPage
 */

/**
 * Liste des types de notifications disponibles.
 *
 * Chaque valeur correspond à un événement métier
 * généré par le backend.
 */
export type NotificationType =
  /**
   * Un utilisateur a rejoint un groupe.
   */
  | "GROUP_JOINED"

  /**
   * Une nouvelle session a été créée.
   */
  | "SESSION_CREATED"

  /**
   * Un nouveau message a été reçu.
   */
  | "MESSAGE_RECEIVED"

  /**
   * Le compte utilisateur a été désactivé.
   */
  | "ACCOUNT_DISABLED";

/**
 * Représentation d'une notification enregistrée
 * dans la base de données.
 *
 * Cette structure est utilisée pour afficher
 * les notifications dans l'interface utilisateur.
 */
export interface AppNotification {
  /**
   * Identifiant MongoDB de la notification.
   *
   * Exemple :
   * "684f7d5f1c8b1e5b3a4d9e12"
   */
  _id: string;

  /**
   * Identifiant de l'utilisateur destinataire.
   *
   * Permet de savoir à qui appartient
   * cette notification.
   */
  userId: number;

  /**
   * Type de notification.
   *
   * Permet au frontend ou au backend
   * d'identifier la nature de l'événement.
   */
  type: NotificationType;

  /**
   * Titre court affiché dans l'interface.
   *
   * Exemple :
   * "Nouvelle session disponible"
   */
  title: string;

  /**
   * Contenu détaillé de la notification.
   *
   * Exemple :
   * "Une session React avancé a été créée."
   */
  content: string;

  /**
   * Indique si la notification a été lue.
   *
   * true  → notification déjà consultée
   * false → notification encore non lue
   */
  isRead: boolean;

  /**
   * Date de création de la notification.
   *
   * Correspond généralement à la date
   * de l'événement déclencheur.
   */
  createdAt: string;

  /**
   * Date de dernière modification.
   *
   * Peut être mise à jour lorsqu'une notification
   * est marquée comme lue.
   */
  updatedAt: string;
}
