import { BackButton } from "@/components/back-button";
import { ConfirmDialog } from "@/components/confirm-dialog";
import Loader from "@/components/loader";
import { CommentSection } from "@/components/task/comment-section";
import { SubTasksDetails } from "@/components/task/sub-tasks";
import { TaskActivity } from "@/components/task/task-activity";
import { TaskAssigneesSelector } from "@/components/task/task-assignees-selector";
import { TaskDescription } from "@/components/task/task-description";
import { TaskDueDate } from "@/components/task/task-due-date";
import { TaskPrioritySelector } from "@/components/task/task-priority-selector";
import { TaskStatusSelector } from "@/components/task/task-status-selector";
import TaskTitle from "@/components/task/task-title";
import { Watchers } from "@/components/task/watchers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"; // Added separator for cleaner look
import {
  useAchievedTaskMutation,
  useDeleteTaskMutation,
  useTaskByIdQuery,
  useWatchTaskMutation,
} from "@/hooks/use-task";
import { useAuth } from "@/provider/auth-context";
import type { MemberProps, Project, Task } from "@/types/indedx";
import { formatDistanceToNow } from "date-fns";
import {
  Archive,
  ArchiveRestore,
  Calendar,
  Eye,
  EyeOff,
  Loader2,
  Trash2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const TaskDetails = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Safe param extraction
  const { taskId, projectId, workspaceId } = useParams<{
    taskId: string;
    projectId: string;
    workspaceId: string;
  }>();

  // Queries & Mutations
  const { data, isLoading } = useTaskByIdQuery(taskId!) as {
    data: { task: Task; project: Project } | undefined;
    isLoading: boolean;
  };

  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTaskMutation();
  const { mutate: watchTask, isPending: isWatching } = useWatchTaskMutation();
  const { mutate: achievedTask, isPending: isAchieved } =
    useAchievedTaskMutation();

  // Loading State
  if (isLoading) {
    return <Loader />;
  }

  // Not Found State - Improved UI
  if (!data || !data.task) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-4">
        <div className="text-2xl font-bold text-muted-foreground">
          Task not found
        </div>
        <Button onClick={() => navigate(-1)} variant="outline">
          Go Back
        </Button>
      </div>
    );
  }

  const { task, project } = data;

  const isUserWatching = task.watchers?.some(
    (watcher) => watcher._id?.toString() === user?._id?.toString(),
  );

  // Handlers
  const handleWatchTask = () => {
    if (!taskId) return;

    watchTask(
      { taskId },
      {
        onSuccess: () => {
          const message = isUserWatching
            ? "You are no longer watching this task" // Unwatch message
            : "You are now watching this task"; // Watch message

          toast.success(message);
        },
        onError: () => {
          toast.error("Failed to update watch status");
        },
      },
    );
  };

  const handleAchievedTask = () => {
    if (!taskId) return;
    achievedTask(
      { taskId },
      {
        onSuccess: () => {
          const msg = task.isArchived ? "Task unarchived" : "Task archived";
          toast.success(msg);
        },
        onError: () => {
          toast.error("Failed to update archive status");
        },
      },
    );
  };

  const handleDeleteTask = () => {
    if (!workspaceId || !projectId || !taskId) return;

    deleteTask(
      { workspaceId, projectId, taskId },
      {
        onSuccess: () => {
          toast.success("Task deleted successfully");
          // Navigate to project board instead of -1 to avoid circular navigation or dead ends
          navigate(`/workspaces/${workspaceId}/projects/${projectId}`);
        },
        onError: () => {
          toast.error("Failed to delete task");
        },
      },
    );
  };

  return (
    <div className="container max-w-7xl mx-auto p-4 space-y-6">
      {/* --- Header Section --- */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Left: Back & Title */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <BackButton />
            {task.isArchived && (
              <Badge variant="secondary" className="text-xs">
                Archived
              </Badge>
            )}
          </div>
          {/* Mobile Title Preview (Hidden on desktop, shown if needed) */}
          <h1 className="text-lg font-bold sm:hidden truncate">{task.title}</h1>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Watch Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleWatchTask}
            disabled={isWatching}
            className="flex-1 sm:flex-none"
          >
            {isUserWatching ? (
              <>
                <EyeOff className="mr-2 size-4" /> Unwatch
              </>
            ) : (
              <>
                <Eye className="mr-2 size-4" /> Watch
              </>
            )}
          </Button>

          {/* Archive Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleAchievedTask}
            disabled={isAchieved}
            className="flex-1 sm:flex-none"
          >
            {task.isArchived ? (
              <>
                <ArchiveRestore className="mr-2 size-4" /> Unarchive
              </>
            ) : (
              <>
                <Archive className="mr-2 size-4" /> Archive
              </>
            )}
          </Button>

          {/* Delete Button */}
          <ConfirmDialog
            title="Delete Task?"
            description="This action cannot be undone. This will permanently delete the task."
            onConfirm={handleDeleteTask}
            isLoading={isDeleting}
            confirmText="Delete Task"
            variant="destructive"
          >
            <Button
              variant="destructive"
              size="sm"
              disabled={isDeleting}
              className="flex-1 sm:flex-none"
            >
              {isDeleting ? (
                <Loader2 className="animate-spin size-4" />
              ) : (
                <Trash2 className="size-4 sm:mr-2" />
              )}
              <span className="hidden sm:inline">Delete</span>
            </Button>
          </ConfirmDialog>
        </div>
      </div>

      {/* --- Main Grid Layout --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Main Content) - Spans 8 cols on desktop */}
        <main className="lg:col-span-8 space-y-6">
          <div className="bg-card rounded-xl border shadow-sm p-4 sm:p-6 space-y-6">
            {/* 1. Header Info (Status, Priority, Date) */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant={
                      task.priority === "High"
                        ? "destructive"
                        : task.priority === "Medium"
                          ? "default"
                          : "secondary" // Changed outline to secondary for better visibility
                    }
                    className="capitalize"
                  >
                    {task.priority} Priority
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="size-3" />
                    Created{" "}
                    {formatDistanceToNow(new Date(task.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <div className="pt-2">
                  <TaskTitle title={task.title} taskId={task._id} />
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <TaskStatusSelector status={task.status} taskId={task._id} />
              </div>
            </div>

            <Separator />

            {/* 2. Description */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Description
              </h3>
              <TaskDescription
                description={task.description || ""}
                taskId={task._id}
              />
            </div>

            {/* 3. Properties Grid (Assignees, Due Date, Priority Select) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground">
                  Assignees
                </span>
                <TaskAssigneesSelector
                  task={task}
                  assignees={task.assignees}
                  projectMembers={project.members as any}
                />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground">
                  Due Date
                </span>
                <TaskDueDate taskId={taskId!} dueDate={task.dueDate} />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Priority
                </span>
                <TaskPrioritySelector
                  priority={task.priority}
                  taskId={task._id}
                />
              </div>
            </div>

            {/* 4. Subtasks */}
            <div>
              <SubTasksDetails
                subTasks={task.subtasks || []}
                taskId={task._id}
              />
            </div>
          </div>

          {/* 5. Comments (Separate Card) */}
          <div className="bg-card rounded-xl border shadow-sm">
            <CommentSection
              taskId={task._id}
              members={project.members as MemberProps[]}
            />
          </div>
        </main>

        {/* Right Column (Sidebar) - Spans 4 cols on desktop */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Watchers Card */}
          <div className="bg-card rounded-xl border shadow-sm">
            <Watchers watchers={task.watchers || []} />
          </div>

          {/* Activity Feed */}
          <div className="bg-card rounded-xl border shadow-sm p-4">
            <TaskActivity resourceId={task._id} />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default TaskDetails;
