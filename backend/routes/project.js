import express from "express";
import authMiddleware from "../middleware/auth-middleware.js";
import { validateRequest } from "zod-express-middleware";
import { projectSchema } from "../libs/validate-schema.js";
import { z } from "zod";
import {
  createProject,
  getProjectDetails,
  getProjectTasks,
  deleteProject,
  updateProject, // ✅ اضافه شد
} from "../controllers/project.js";

const router = express.Router();

// 1. Create Project
router.post(
  "/:workspaceId/create-project",
  authMiddleware,
  validateRequest({
    params: z.object({
      workspaceId: z.string(),
    }),
    body: projectSchema,
  }),
  createProject
);

// 2. Get Project Details
router.get(
  "/:projectId",
  authMiddleware,
  validateRequest({
    params: z.object({ projectId: z.string() }),
  }),
  getProjectDetails
);

// 3. Get Project Tasks
router.get(
  "/:projectId/tasks",
  authMiddleware,
  validateRequest({ params: z.object({ projectId: z.string() }) }),
  getProjectTasks
);

// 4. Update/Edit Project (✅ روت جدید)
router.put(
  "/:workspaceId/edit-project/:projectId",
  authMiddleware,
  validateRequest({
    params: z.object({
      workspaceId: z.string(),
      projectId: z.string(),
    }),
    body: z.object({
      title: z.string().min(1).optional(),
      description: z.string().optional(),
      emoji: z.string().optional(),
      status: z.string().optional(),
      startDate: z.string().optional(),
      dueDate: z.string().optional(),
      tags: z.array(z.string()).optional(),
      members: z.array(z.string()).optional(),
    }),
  }),
  updateProject
);

// 5. Delete Project
router.delete(
  "/:workspaceId/delete-project/:projectId",
  authMiddleware,
  validateRequest({
    params: z.object({
      workspaceId: z.string(),
      projectId: z.string(),
    }),
  }),
  deleteProject
);

export default router;
