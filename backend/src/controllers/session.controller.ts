import type { Request, Response, NextFunction } from "express";
import { sessionService } from "../services/session.service";

export const sessionController = {
  async getGroupSessions(req: Request, res: Response, next: NextFunction) {
    try {
      const sessions = await sessionService.getGroupSessions(
        Number(req.params.groupId),
      );

      res.status(200).json(sessions);
    } catch (error) {
      next(error);
    }
  },

  async createSession(req: Request, res: Response, next: NextFunction) {
    try {
      const session = await sessionService.createSession(
        req.user.id,
        Number(req.params.groupId),
        req.body,
      );

      res.status(201).json({
        message: "Session créée",
        sessionId: session.id,
      });
    } catch (error) {
      next(error);
    }
  },

  async bookSession(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await sessionService.bookSession(
        req.user.id,
        Number(req.params.id),
      );

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async cancelBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await sessionService.cancelBooking(
        req.user.id,
        Number(req.params.id),
      );

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async getMySessions(req: Request, res: Response, next: NextFunction) {
    try {
      const sessions = await sessionService.getMySessions(req.user.id);
      res.status(200).json(sessions);
    } catch (error) {
      next(error);
    }
  },
};
