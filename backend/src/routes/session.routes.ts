import { Router } from "express";
import { sessionController } from "../controllers/session.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createSessionSchema,
  groupIdParamSchema,
  sessionIdParamSchema,
} from "../schemas/session.schema";

const router = Router();

router.get(
  "/groups/:groupId/sessions",
  authMiddleware,
  validate(groupIdParamSchema),
  sessionController.getGroupSessions,
);

router.post(
  "/groups/:groupId/sessions",
  authMiddleware,
  validate(createSessionSchema),
  sessionController.createSession,
);

router.post(
  "/sessions/:id/book",
  authMiddleware,
  validate(sessionIdParamSchema),
  sessionController.bookSession,
);

router.delete(
  "/sessions/:id/book",
  authMiddleware,
  validate(sessionIdParamSchema),
  sessionController.cancelBooking,
);

router.get(
  "/users/me/sessions",
  authMiddleware,
  sessionController.getMySessions,
);

export default router;
