import { Router } from "express";
import { profileController } from "../controllers/profile.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { updateProfileSchema } from "../schemas/profile.schema";

const router = Router();

router.get("/me/profile", authMiddleware, profileController.getMyProfile);

router.put(
  "/me/profile",
  authMiddleware,
  validate(updateProfileSchema),
  profileController.updateMyProfile,
);

export default router;
