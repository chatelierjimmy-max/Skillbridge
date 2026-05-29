import type { Request, Response, NextFunction } from "express";
import { skillService } from "../services/skill.service";

export const skillController = {
  async getAllSkills(_req: Request, res: Response, next: NextFunction) {
    try {
      const skills = await skillService.getAllSkills();
      res.status(200).json(skills);
    } catch (error) {
      next(error);
    }
  },

  async getMySkills(req: Request, res: Response, next: NextFunction) {
    try {
      const skills = await skillService.getMySkills(req.user.id);
      res.status(200).json(skills);
    } catch (error) {
      next(error);
    }
  },

  async addMySkill(req: Request, res: Response, next: NextFunction) {
    try {
      await skillService.addMySkill(
        req.user.id,
        req.body.skillId,
        req.body.level,
      );

      res.status(201).json({
        message: "Compétence ajoutée",
      });
    } catch (error) {
      next(error);
    }
  },

  async removeMySkill(req: Request, res: Response, next: NextFunction) {
    try {
      await skillService.removeMySkill(req.user.id, Number(req.params.skillId));

      res.status(200).json({
        message: "Compétence supprimée",
      });
    } catch (error) {
      next(error);
    }
  },
};
