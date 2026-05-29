import { Router } from "express";
import { messageController } from "../controllers/message.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  groupMessagesParamSchema,
  createMessageSchema,
  messageIdParamSchema,
} from "../schemas/message.schema";

const router = Router();

router.get(
  "/groups/:groupId/messages",
  authMiddleware,
  validate(groupMessagesParamSchema),
  messageController.getGroupMessages,
);

router.post(
  "/groups/:groupId/messages",
  authMiddleware,
  validate(createMessageSchema),
  messageController.createMessage,
);

router.delete(
  "/messages/:id",
  authMiddleware,
  validate(messageIdParamSchema),
  messageController.deleteMessage,
);

export default router;
