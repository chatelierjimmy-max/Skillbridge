import type { Request, Response, NextFunction } from "express";
import { groupService } from "../services/group.service";

export const groupController = {
  async getAllGroups(_req: Request, res: Response, next: NextFunction) {
    try {
      const groups = await groupService.getAllGroups();
      res.status(200).json(groups);
    } catch (error) {
      next(error);
    }
  },

  async getGroupById(req: Request, res: Response, next: NextFunction) {
    try {
      const group = await groupService.getGroupById(Number(req.params.id));
      res.status(200).json(group);
    } catch (error) {
      next(error);
    }
  },

  async createGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const group = await groupService.createGroup(req.user.id, req.body);

      res.status(201).json({
        message: "Groupe créé",
        groupId: group.id,
      });
    } catch (error) {
      next(error);
    }
  },

  async joinGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await groupService.joinGroup(
        req.user.id,
        Number(req.params.id),
      );

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async leaveGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await groupService.leaveGroup(
        req.user.id,
        Number(req.params.id),
      );

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};
