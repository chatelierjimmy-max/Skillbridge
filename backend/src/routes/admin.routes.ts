import { Router } from "express";
import { UserRole } from "@prisma/client";
import { adminController } from "../controllers/admin.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate.middleware";
import { adminUserIdParamSchema } from "../schemas/admin.schema";

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(UserRole.ADMIN));

router.get("/users", adminController.getUsers);

router.patch(
  "/users/:id/disable",
  validate(adminUserIdParamSchema),
  adminController.disableUser,
);

router.patch(
  "/users/:id/enable",
  validate(adminUserIdParamSchema),
  adminController.enableUser,
);

router.get("/logs/activity", adminController.getActivityLogs);

router.get("/logs/security", adminController.getSecurityLogs);

export default router;
