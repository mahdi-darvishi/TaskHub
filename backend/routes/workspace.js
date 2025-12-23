import express from "express";
import { validateRequest } from "zod-express-middleware";
import { createWorkspace, getWorkspaces } from "../controllers/workspace.js";
import { WorkspaceSchema } from "../libs/validate-schema.js";
import authMiddleware from "../middleware/auth-middleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  validateRequest({ body: WorkspaceSchema }),
  createWorkspace
);

router.get("/", authMiddleware, getWorkspaces);
export default router;
