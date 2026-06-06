// Import de Types depuis Mongoose.
// Utilisé ici pour valider le format des ObjectId MongoDB.
import { Types } from "mongoose";

// Repository des messages.
// Responsable des opérations CRUD sur les messages MongoDB.
import { messageRepository } from "../repositories/message.repository";

// Repository des groupes.
// Utilisé pour vérifier les appartenances aux groupes.
import { groupRepository } from "../repositories/group.repository";

// Repository utilisateur.
// Permet de récupérer les informations des auteurs des messages.
import { userRepository } from "../repositories/user.repository";

// Classe d'erreur personnalisée.
import { AppError } from "../utils/AppError";

// Service de journalisation.
import { logService } from "./log.service";

/**
 * Données nécessaires à la création d'un message.
 */
interface CreateMessageInput {
  content: string;
}

/**
 * Service métier de gestion des messages.
 *
 * Responsable de :
 * - consulter les messages d'un groupe
 * - envoyer un message
 * - supprimer un message
 */
export const messageService = {
  /**
   * Retourne les messages d'un groupe.
   *
   * Règle métier :
   * Seuls les membres du groupe peuvent consulter
   * les messages associés.
   */
  async getGroupMessages(userId: number, groupId: number) {
    // Vérifie que l'utilisateur appartient au groupe.
    const membership = await groupRepository.findMembership(userId, groupId);

    if (!membership) {
      throw new AppError(
        "Vous devez être membre du groupe pour lire les messages",
        403,
      );
    }

    // Récupération des messages du groupe.
    const messages = await messageRepository.findByGroupId(groupId);

    // Extraction des identifiants utilisateurs uniques.
    // Cela évite de faire plusieurs fois la même requête.
    const userIds = [...new Set(messages.map((message) => message.userId))];

    // Chargement des informations des auteurs.
    const users = await Promise.all(
      userIds.map((id) => userRepository.findById(id)),
    );

    // Construction de la réponse enrichie.
    return messages.map((message) => {
      const author = users.find((user) => user?.id === message.userId);

      return {
        id: message._id,
        groupId: message.groupId,
        userId: message.userId,

        // Informations de l'auteur.
        author: author
          ? {
              id: author.id,
              firstname: author.firstname,
              lastname: author.lastname,
            }
          : null,

        content: message.content,
        createdAt: message.createdAt,
      };
    });
  },

  /**
   * Crée un nouveau message dans un groupe.
   *
   * Règle métier :
   * Seuls les membres du groupe peuvent envoyer
   * des messages.
   */
  async createMessage(
    userId: number,
    groupId: number,
    data: CreateMessageInput,
  ) {
    // Vérification de l'appartenance au groupe.
    const membership = await groupRepository.findMembership(userId, groupId);

    if (!membership) {
      throw new AppError(
        "Vous devez être membre du groupe pour envoyer un message",
        403,
      );
    }

    // Création du message.
    const message = await messageRepository.create({
      groupId,
      userId,
      content: data.content,
    });

    // Journalisation de l'action.
    await logService.activity(
      "SEND_MESSAGE",
      { userId },
      "MESSAGE",
      message.id,
    );

    return {
      id: message.id,
      groupId: message.groupId,
      userId: message.userId,
      content: message.content,
      createdAt: message.createdAt,
    };
  },

  /**
   * Supprime un message.
   *
   * Règles métier :
   * - l'utilisateur doit appartenir au groupe
   * - il peut supprimer son propre message
   * - le propriétaire du groupe peut supprimer
   *   tous les messages du groupe
   */
  async deleteMessage(userId: number, messageId: string) {
    // Vérification du format ObjectId MongoDB.
    if (!Types.ObjectId.isValid(messageId)) {
      throw new AppError("Identifiant du message invalide", 400);
    }

    // Recherche du message.
    const message = await messageRepository.findById(messageId);

    // Message inexistant ou déjà supprimé.
    if (!message || message.isDeleted) {
      throw new AppError("Message introuvable", 404);
    }

    // Vérifie que l'utilisateur appartient au groupe.
    const membership = await groupRepository.findMembership(
      userId,
      message.groupId,
    );

    if (!membership) {
      throw new AppError("Accès interdit", 403);
    }

    /**
     * Autorisation de suppression.
     *
     * Cas autorisés :
     * - auteur du message
     * - propriétaire du groupe
     */
    if (message.userId !== userId && membership.role !== "OWNER") {
      throw new AppError(
        "Vous ne pouvez supprimer que vos propres messages",
        403,
      );
    }

    // Suppression logique du message.
    // Le document reste en base mais est marqué supprimé.
    await messageRepository.softDelete(messageId);

    // Journalisation de l'action.
    await logService.activity(
      "DELETE_MESSAGE",
      { userId },
      "MESSAGE",
      messageId,
    );

    return {
      message: "Message supprimé",
    };
  },
};
