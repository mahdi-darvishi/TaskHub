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
import { Separator } from "@/components/ui/separator";
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

  // Not Found State
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

  // --- Handlers ---

  const handleWatchTask = () => {
    if (!taskId) return;
    watchTask(
      { taskId },
      {
        onSuccess: () => {
          // Logic: If user WAS watching, now they are NOT.
          const message = isUserWatching
            ? "You are no longer watching this task"
            : "You are now watching this task";
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
          // Navigate to project board to avoid dead ends
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
      {/* --- Top Bar: Navigation & Actions --- */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Left: Back Button & Archive Badge */}
        <div className="flex items-center justify-between md:justify-start md:gap-4 ">
          <div className="flex items-center gap-2">
            <BackButton />
            {task.isArchived && (
              <Badge variant="secondary" className="text-xs">
                Archived
              </Badge>
            )}
          </div>
          {/* Mobile Status Selector (Visible only on mobile for quick access) */}
          <div className="md:hidden">
            <TaskStatusSelector status={task.status} taskId={task._id} />
          </div>
        </div>

        {/* Right: Action Buttons (Watch, Archive, Delete) */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleWatchTask}
            disabled={isWatching}
            className="flex-1 md:flex-none"
          >
            {isUserWatching ? (
              <>
                <EyeOff className="mr-2 size-4" />{" "}
                <span className="hidden sm:inline">Unwatch</span>
                <span className="sm:hidden">Unwatch</span>
              </>
            ) : (
              <>
                <Eye className="mr-2 size-4" />{" "}
                <span className="hidden sm:inline">Watch</span>
                <span className="sm:hidden">Watch</span>
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleAchievedTask}
            disabled={isAchieved}
            className="flex-1 md:flex-none"
          >
            {task.isArchived ? (
              <ArchiveRestore className="size-4 sm:mr-2" />
            ) : (
              <Archive className="size-4 sm:mr-2" />
            )}
            <span className="hidden sm:inline">
              {task.isArchived ? "Unarchive" : "Archive"}
            </span>
          </Button>

          <ConfirmDialog
            title="Delete Task?"
            description="This action cannot be undone."
            onConfirm={handleDeleteTask}
            isLoading={isDeleting}
            confirmText="Delete"
            variant="destructive"
          >
            <Button
              variant="destructive"
              size="sm"
              disabled={isDeleting}
              className="flex-1 md:flex-none"
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

      {/* --- Main Content Grid --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Main Info) - 8 Columns */}
        <main className="lg:col-span-8 space-y-6">
          <div className="bg-card rounded-xl border shadow-sm p-4 sm:p-6 space-y-6">
            {/* Header: Title, Priority, Date */}
            <div className="space-y-4">
              <div className="flex flex-col-reverse sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2 w-full">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <Calendar className="size-3.5" />
                    Created{" "}
                    {formatDistanceToNow(new Date(task.createdAt), {
                      addSuffix: true,
                    })}
                    <span className="mx-1">•</span>
                    <Badge
                      variant={
                        task.priority === "High"
                          ? "destructive"
                          : task.priority === "Medium"
                            ? "default"
                            : "secondary"
                      }
                      className="text-[10px] px-1.5 h-5 capitalize"
                    >
                      {task.priority}
                    </Badge>
                  </div>
                  <TaskTitle title={task.title} taskId={task._id} />
                </div>

                {/* Desktop Status Selector */}
                <div className="hidden md:block shrink-0">
                  <TaskStatusSelector status={task.status} taskId={task._id} />
                </div>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Description
              </h3>
              <TaskDescription
                description={task.description || ""}
                taskId={task._id}
              />
            </div>

            {/* Properties Box (Assignees, DueDate, Priority) */}
            <div className="bg-muted/30 rounded-lg p-4 border grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Assignees
                </span>
                <TaskAssigneesSelector
                  task={task}
                  assignees={task.assignees}
                  projectMembers={project.members as any}
                />
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Due Date
                </span>
                <TaskDueDate taskId={taskId!} dueDate={task.dueDate} />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Priority
                </span>
                <TaskPrioritySelector
                  priority={task.priority}
                  taskId={task._id}
                />
              </div>
            </div>

            {/* Subtasks */}
            <div>
              <SubTasksDetails
                subTasks={task.subtasks || []}
                taskId={task._id}
              />
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-card rounded-xl border shadow-sm p-0 sm:p-1 overflow-hidden">
            <CommentSection
              taskId={task._id}
              members={project.members as MemberProps[]}
            />
          </div>
        </main>

        {/* Right Column (Sidebar) - 4 Columns */}
        <aside className="lg:col-span-4 space-y-6 flex flex-col-reverse lg:flex-col">
          {/* Watchers */}
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
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
