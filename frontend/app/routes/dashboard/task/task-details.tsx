import { BackButton } from "@/components/back-button";
import { ConfirmDialog } from "@/components/confirm-dialog";
import Loader from "@/components/loader";
import { CommentSection } from "@/components/task/comment-section";
import { SubTasksDetails } from "@/components/task/sub-tasks";
import { TaskActivity } from "@/components/task/task-activity";
import { TaskAssigneesSelector } from "@/components/task/task-assignees-selector";
import { TaskDescription } from "@/components/task/task-description";
import { TaskPrioritySelector } from "@/components/task/task-priority-selector";
import { TaskStatusSelector } from "@/components/task/task-status-selector";
import TaskTitle from "@/components/task/task-title";
import { Watchers } from "@/components/task/watchers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  useAchievedTaskMutation,
  useDeleteTaskMutation,
  useTaskByIdQuery,
  useWatchTaskMutation,
} from "@/hooks/use-task";
import { useAuth } from "@/provider/auth-context";
import type { Project, Task } from "@/types/indedx";
import { formatDistanceToNow } from "date-fns";
import { Edit, Eye, EyeOff, Loader2, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { format } from "date-fns";
import { TaskDueDate } from "@/components/task/task-due-date";

const TaskDetails = () => {
  const { user } = useAuth();
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTaskMutation();
  const params = useParams();
  const navigate = useNavigate();

  const { taskId, projectId, workspaceId } = useParams<{
    taskId: string;
    projectId: string;
    workspaceId: string;
  }>();

  const { data, isLoading } = useTaskByIdQuery(taskId!) as {
    data: {
      task: Task;
      project: Project;
    };
    isLoading: boolean;
  };
  const { mutate: watchTask, isPending: isWatching } = useWatchTaskMutation();
  const { mutate: achievedTask, isPending: isAchieved } =
    useAchievedTaskMutation();

  if (isLoading) {
    return <Loader />;
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl font-bold">Task not found</div>
      </div>
    );
  }

  const { task, project } = data;

  const isUserWatching = task?.watchers?.some(
    (watcher) => watcher._id?.toString() === user?._id?.toString()
  );

  const handleWatchTask = () => {
    watchTask(
      { taskId: task._id },
      {
        onSuccess: () => {
          toast.success("Task watched");
        },
        onError: () => {
          toast.error("Failed to watch task");
        },
      }
    );
  };

  const handleAchievedTask = () => {
    achievedTask(
      { taskId: task._id },
      {
        onSuccess: () => {
          toast.success("Task updated successfully");
        },
        onError: () => {
          toast.error("Failed to achieve task");
        },
      }
    );
  };

  const handleDeleteTask = () => {
    const workspaceId = params.workspaceId;
    const projectId = params.projectId;
    const taskId = task?._id;

    if (!workspaceId || !projectId || !taskId) return;

    deleteTask(
      { workspaceId, projectId, taskId },
      {
        onSuccess: () => {
          toast.success("Task deleted successfully");
          navigate(-1);
        },
        onError: (error) => {
          toast.error("Failed to delete task");
        },
      }
    );
  };

  return (
    <div className="container mx-auto p-0 py-4 md:px-4">
      <div className="flex flex-col md:flex-row items-center justify-between mb-2 lg:mb-6">
        <div className="flex flex-col md:flex-row gap-y-1 items-center">
          <BackButton />

          <h1 className="text-xl md:text-2xl font-bold">{task.title}</h1>

          <span>
            {task.isArchived === true && (
              <Badge className="ml-2" variant={"outline"}>
                Archived
              </Badge>
            )}
          </span>
        </div>

        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button
            variant={"outline"}
            size="sm"
            onClick={handleWatchTask}
            className="w-fit"
            disabled={isWatching}
          >
            {isUserWatching ? (
              <>
                <EyeOff className="mr-2 size-4" />
                Unwatch
              </>
            ) : (
              <>
                <Eye className="mr-2 size-4" />
                Watch
              </>
            )}
          </Button>

          <Button
            variant={"outline"}
            size="sm"
            onClick={handleAchievedTask}
            className="w-fit"
            disabled={isAchieved}
          >
            {task.isArchived ? "Unarchive" : "Archive"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* left side */}
        <div className="col-span-2">
          <div className="bg-card rounded-lg p-6 shadow-sm mb-6">
            <div className="flex flex-col md:flex-row justify-between  flex-wrap gap-y-3 items-start mb-4">
              <div>
                <Badge
                  variant={
                    task.priority === "High"
                      ? "destructive"
                      : task.priority === "Medium"
                        ? "default"
                        : "outline"
                  }
                  className="mb-2 capitalize"
                >
                  {task.priority} Priority
                </Badge>

                <div className="text-sm md:text-base font-normal">
                  Created at:{" "}
                  <span className=" text-muted-foreground">
                    {formatDistanceToNow(new Date(task.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <div className="">
                  <TaskDueDate taskId={taskId} dueDate={task.dueDate} />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 md:mt-0">
                <TaskStatusSelector status={task.status} taskId={task._id} />

                <ConfirmDialog
                  title="Delete Task?"
                  description="This action cannot be undone. This will permanently delete the task and remove it from our servers."
                  onConfirm={handleDeleteTask}
                  isLoading={isDeleting}
                  confirmText="Delete Task"
                >
                  <Button
                    variant={"destructive"}
                    size={"sm"}
                    disabled={isDeleting}
                    className=""
                  >
                    {isDeleting ? (
                      <Loader2 className="animate-spin hidden lg:block mr-2" />
                    ) : (
                      <Trash2 className="hidden lg:block mr-2" />
                    )}
                    Delete Task
                  </Button>
                </ConfirmDialog>
              </div>
            </div>

            <div className="text-lg font-medium mt-4">
              <TaskTitle title={task.title} taskId={task._id} />
            </div>
            <div className="mb-6 mt-2">
              <h3 className="text-sm font-medium  mb-0">Description:</h3>

              <div>
                <TaskDescription
                  description={task.description || ""}
                  taskId={task._id}
                />
              </div>
            </div>

            <div>
              <TaskAssigneesSelector
                task={task}
                assignees={task.assignees}
                projectMembers={project.members as any}
              />
            </div>

            <div>
              <TaskPrioritySelector
                priority={task.priority}
                taskId={task._id}
              />
            </div>

            <div>
              <SubTasksDetails
                subTasks={task.subtasks || []}
                taskId={task._id}
              />
            </div>
          </div>

          <div>
            <CommentSection
              taskId={task._id}
              members={project.members as any}
            />
          </div>
        </div>

        {/* right side */}
        <div className="lg:col-span-1">
          <Watchers watchers={task.watchers || []} />

          <TaskActivity resourceId={task._id} />
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
