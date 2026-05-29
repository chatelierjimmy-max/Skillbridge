import { Router } from "express";
import { skillController } from "../controllers/skill.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  addUserSkillSchema,
  skillIdParamSchema,
} from "../schemas/skill.schema";

const router = Router();

router.get("/skills", authMiddleware, skillController.getAllSkills);

router.get("/me/skills", authMiddleware, skillController.getMySkills);

router.post(
  "/me/skills",
  authMiddleware,
  validate(addUserSkillSchema),
  skillController.addMySkill,
);

router.delete(
  "/me/skills/:skillId",
  authMiddleware,
  validate(skillIdParamSchema),
  skillController.removeMySkill,
);

export default router;
