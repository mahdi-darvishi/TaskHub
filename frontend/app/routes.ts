import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  // --- Auth Section ---
  layout("routes/auth/auth-layout.tsx", [
    index("routes/root/home.tsx"),
    route("sign-in", "routes/auth/sign-in.tsx"),
    route("sign-up", "routes/auth/sign-up.tsx"),
    route("forgot-password", "routes/auth/forgot-password.tsx"),
    route("reset-password", "routes/auth/reset-password.tsx"),
    route("verify-email", "routes/auth/verify-email.tsx"),
  ]),

  // --- Dashboard Section ---
  layout("routes/dashboard/dashboard-layout.tsx", [
    route("dashboard", "routes/dashboard/index.tsx"),

    route("my-tasks", "routes/dashboard/my-tasks/index.tsx"),
    route("members", "routes/dashboard/members/index.tsx"),
    route("achieved", "routes/dashboard/achieved/index.tsx"),
    route("settings", "routes/dashboard/settings/index.tsx"),

    route(
      "workspaces/join/:workspaceId/:inviteCode",
      "routes/dashboard/workspaces/join-workspace.tsx"
    ),

    route("workspaces", "routes/dashboard/workspaces/index.tsx"),
    route(
      "workspaces/:workspaceId",
      "routes/dashboard/workspaces/workspace-details.tsx"
    ),
    route(
      "workspaces/:workspaceId/projects/:projectId",
      "routes/dashboard/project/project-details.tsx"
    ),
    route(
      "workspaces/:workspaceId/projects/:projectId/tasks/:taskId",
      "routes/dashboard/task/task-details.tsx"
    ),
  ]),

  // --- User Section ---
  layout("routes/user/user-layout.tsx", [
    route("user/profile", "routes/user/profile.tsx"),
  ]),
] satisfies RouteConfig;
