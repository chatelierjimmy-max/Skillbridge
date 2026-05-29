import type { Request, Response, NextFunction } from "express";
import { messageService } from "../services/message.service";

export const messageController = {
  async getGroupMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const messages = await messageService.getGroupMessages(
        req.user.id,
        Number(req.params.groupId),
      );

      res.status(200).json(messages);
    } catch (error) {
      next(error);
    }
  },

  async createMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const message = await messageService.createMessage(
        req.user.id,
        Number(req.params.groupId),
        req.body,
      );

      res.status(201).json({
        message: "Message envoyé",
        data: message,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await messageService.deleteMessage(
        req.user.id,
        req.params.id as string,
      );

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};
