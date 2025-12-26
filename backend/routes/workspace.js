import express from "express";
import { validateRequest } from "zod-express-middleware";
import { WorkspaceSchema } from "../libs/validate-schema.js";
import authMiddleware from "../middleware/auth-middleware.js";
import { z } from "zod";

import {
  createWorkspace,
  getWorkspaces,
  getWorkspaceDetails,
  getWorkspaceProjects,
  getWorkspaceStats,
  deleteWorkspace,
} from "../controllers/workspace.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  validateRequest({ body: WorkspaceSchema }),
  createWorkspace
);

router.get("/", authMiddleware, getWorkspaces);

router.get("/:workspaceId", authMiddleware, getWorkspaceDetails);
router.get("/:workspaceId/projects", authMiddleware, getWorkspaceProjects);
router.get("/:workspaceId/stats", authMiddleware, getWorkspaceStats);
router.delete(
  "/:workspaceId",
  authMiddleware,
  validateRequest({
    params: z.object({
      workspaceId: z.string(),
    }),
  }),
  deleteWorkspace
);

export default router;
