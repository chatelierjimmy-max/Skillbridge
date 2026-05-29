import { Router } from "express";
import authRoutes from "./auth.routes";
import profileRoutes from "./profile.routes";
import skillRoutes from "./skill.routes";
import searchRoutes from "./search.routes";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "SkillBridge API is running",
  });
});

router.use("/auth", authRoutes);
router.use("/users", profileRoutes);
router.use("/users", skillRoutes);
router.use("/users", searchRoutes);

export default router;
