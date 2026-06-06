// Import du modèle MongoDB représentant les messages.
// Ce modèle permet d'effectuer toutes les opérations CRUD
// sur la collection des messages.
import { MessageModel } from "../models/message.model";

/**
 * Interface définissant les données nécessaires
 * à la création d'un message.
 */
interface CreateMessageData {
  // Identifiant du groupe dans lequel le message est envoyé
  groupId: number;

  // Identifiant de l'utilisateur auteur du message
  userId: number;

  // Contenu textuel du message
  content: string;
}

/**
 * Repository responsable de la gestion des messages.
 *
 * Il centralise les accès à la collection MongoDB
 * afin de séparer la logique métier de l'accès aux données.
 */
export const messageRepository = {
  /**
   * Récupère tous les messages d'un groupe.
   *
   * Seuls les messages non supprimés sont retournés
   * grâce au filtre isDeleted: false.
   *
   * Les messages sont triés chronologiquement
   * du plus ancien au plus récent afin de conserver
   * l'ordre naturel d'une conversation.
   *
   * @param groupId Identifiant du groupe
   * @returns Liste des messages du groupe
   */
  findByGroupId(groupId: number) {
    return (
      MessageModel.find({
        groupId,

        // Exclut les messages supprimés logiquement
        isDeleted: false,
      })

        // Tri croissant sur la date de création
        // (ancien → récent)
        .sort({ createdAt: 1 })

        // Retourne des objets JavaScript simples
        // pour améliorer les performances
        .lean()
    );
  },

  /**
   * Recherche un message à partir de son identifiant MongoDB.
   *
   * Cette méthode est généralement utilisée pour :
   * - vérifier l'existence d'un message
   * - récupérer un message avant suppression
   * - afficher les détails d'un message
   *
   * @param id Identifiant MongoDB du message
   * @returns Le document correspondant ou null
   */
  findById(id: string) {
    return MessageModel.findById(id);
  },

  /**
   * Crée un nouveau message dans un groupe.
   *
   * Le document est enregistré dans MongoDB
   * avec les informations de l'auteur,
   * du groupe et du contenu.
   *
   * @param data Données du message
   * @returns Le message créé
   */
  create(data: CreateMessageData) {
    return MessageModel.create({
      // Groupe destinataire
      groupId: data.groupId,

      // Auteur du message
      userId: data.userId,

      // Contenu textuel
      content: data.content,
    });
  },

  /**
   * Effectue une suppression logique (soft delete).
   *
   * Le message n'est pas supprimé physiquement
   * de la base de données.
   *
   * À la place, le champ isDeleted passe à true.
   * Cela permet :
   * - de conserver l'historique
   * - d'effectuer des audits
   * - de restaurer éventuellement le message
   *
   * Les requêtes de lecture filtrent ensuite
   * automatiquement les messages supprimés.
   *
   * @param id Identifiant du message
   * @returns Le document mis à jour après modification
   */
  softDelete(id: string) {
    return MessageModel.findByIdAndUpdate(
      // Message à modifier
      id,

      // Mise à jour effectuée
      {
        isDeleted: true,
      },

      // Retourne le document après modification
      {
        returnDocument: "after",
      },
    );
  },
};
