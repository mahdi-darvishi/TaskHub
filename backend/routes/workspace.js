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
  inviteUserByEmail,
  joinWorkspace,
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
router.post("/:workspaceId/invite", authMiddleware, inviteUserByEmail);
router.post("/join", authMiddleware, joinWorkspace);

export default router;
