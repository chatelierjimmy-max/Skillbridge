import { Router } from "express";
import { searchController } from "../controllers/search.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { searchLearnersSchema } from "../schemas/search.schema";

const router = Router();

router.get(
  "/search",
  authMiddleware,
  validate(searchLearnersSchema),
  searchController.searchLearners,
);

export default router;
