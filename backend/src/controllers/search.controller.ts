import type { Request, Response, NextFunction } from "express";
import type { Level } from "@prisma/client";
import { searchService } from "../services/search.service";
import type { SearchLearnersInput } from "../services/search.service";

export const searchController = {
  async searchLearners(req: Request, res: Response, next: NextFunction) {
    try {
      const filters: SearchLearnersInput = {
        userId: req.user.id,
      };

      if (typeof req.query.skill === "string") {
        filters.skill = req.query.skill;
      }

      if (typeof req.query.level === "string") {
        filters.level = req.query.level as Level;
      }

      if (typeof req.query.city === "string") {
        filters.city = req.query.city;
      }

      if (typeof req.query.page === "string") {
        filters.page = Number(req.query.page);
      }

      if (typeof req.query.limit === "string") {
        filters.limit = Number(req.query.limit);
      }

      const learners = await searchService.searchLearners(filters);

      res.status(200).json(learners);
    } catch (error) {
      next(error);
    }
  },
};
