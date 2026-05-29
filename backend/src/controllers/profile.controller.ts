import type { Request, Response, NextFunction } from "express";
import { profileService } from "../services/profile.service";

export const profileController = {
  async getMyProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const profile = await profileService.getMyProfile(req.user.id);
      res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  },

  async updateMyProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const profile = await profileService.updateMyProfile(
        req.user.id,
        req.body,
      );

      res.status(200).json({
        message: "Profil mis à jour",
        profile,
      });
    } catch (error) {
      next(error);
    }
  },
};
