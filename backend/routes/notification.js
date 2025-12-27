import express from "express";
import authMiddleware from "../middleware/auth-middleware.js";
import { getNotifications, markAsRead } from "../controllers/notification.js";

const router = express.Router();

router.get("/", authMiddleware, getNotifications);
router.put("/:id/read", authMiddleware, markAsRead);

export default router;
