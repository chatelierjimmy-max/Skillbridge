import { Types } from "mongoose";
import { messageRepository } from "../repositories/message.repository";
import { groupRepository } from "../repositories/group.repository";
import { userRepository } from "../repositories/user.repository";
import { AppError } from "../utils/AppError";
import { logService } from "./log.service";

interface CreateMessageInput {
  content: string;
}

export const messageService = {
  async getGroupMessages(userId: number, groupId: number) {
    const membership = await groupRepository.findMembership(userId, groupId);

    if (!membership) {
      throw new AppError(
        "Vous devez être membre du groupe pour lire les messages",
        403,
      );
    }

    const messages = await messageRepository.findByGroupId(groupId);

    const userIds = [...new Set(messages.map((message) => message.userId))];

    const users = await Promise.all(
      userIds.map((id) => userRepository.findById(id)),
    );

    return messages.map((message) => {
      const author = users.find((user) => user?.id === message.userId);

      return {
        id: message._id,
        groupId: message.groupId,
        userId: message.userId,
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

  async createMessage(
    userId: number,
    groupId: number,
    data: CreateMessageInput,
  ) {
    const membership = await groupRepository.findMembership(userId, groupId);

    if (!membership) {
      throw new AppError(
        "Vous devez être membre du groupe pour envoyer un message",
        403,
      );
    }

    const message = await messageRepository.create({
      groupId,
      userId,
      content: data.content,
    });

    await logService.activity("SEND_MESSAGE", { userId }, "MESSAGE", message.id);

    return {
      id: message.id,
      groupId: message.groupId,
      userId: message.userId,
      content: message.content,
      createdAt: message.createdAt,
    };
  },

  async deleteMessage(userId: number, messageId: string) {
    if (!Types.ObjectId.isValid(messageId)) {
      throw new AppError("Identifiant du message invalide", 400);
    }

    const message = await messageRepository.findById(messageId);

    if (!message || message.isDeleted) {
      throw new AppError("Message introuvable", 404);
    }

    const membership = await groupRepository.findMembership(
      userId,
      message.groupId,
    );

    if (!membership) {
      throw new AppError("Accès interdit", 403);
    }

    if (message.userId !== userId && membership.role !== "OWNER") {
      throw new AppError(
        "Vous ne pouvez supprimer que vos propres messages",
        403,
      );
    }

    await messageRepository.softDelete(messageId);

    await logService.activity("DELETE_MESSAGE", { userId }, "MESSAGE", messageId);

    return {
      message: "Message supprimé",
    };
  },
};
