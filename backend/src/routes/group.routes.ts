import { Router } from "express";
import { groupController } from "../controllers/group.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createGroupSchema, groupIdParamSchema } from "../schemas/group.schema";

const router = Router();

router.get("/", authMiddleware, groupController.getAllGroups);

router.post(
  "/",
  authMiddleware,
  validate(createGroupSchema),
  groupController.createGroup,
);

router.get(
  "/:id",
  authMiddleware,
  validate(groupIdParamSchema),
  groupController.getGroupById,
);

router.post(
  "/:id/join",
  authMiddleware,
  validate(groupIdParamSchema),
  groupController.joinGroup,
);

router.delete(
  "/:id/leave",
  authMiddleware,
  validate(groupIdParamSchema),
  groupController.leaveGroup,
);

export default router;
