import { BackButton } from "@/components/back-button";
import { ConfirmDialog } from "@/components/confirm-dialog";
import Loader from "@/components/loader";
import { CreateTaskDialog } from "@/components/task/create-task-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDeleteProjectMutation, UseProjectQuery } from "@/hooks/use-project";
import { getProjectProgress } from "@/lib";
import { cn } from "@/lib/utils";
import type { Project, Task, TaskStatus } from "@/types/indedx";
import { format } from "date-fns";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Loader2,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const ProjectDetails = () => {
  const { projectId, workspaceId } = useParams<{
    projectId: string;
    workspaceId: string;
  }>();
  const navigate = useNavigate();

  const [isCreateTask, setIsCreateTask] = useState(false);
  const [taskFilter, setTaskFilter] = useState<TaskStatus | "All">("All");

  const { data, isLoading } = UseProjectQuery(projectId!) as {
    data: {
      tasks: Task[];
      project: Project;
    };
    isLoading: boolean;
  };
  const { mutate: deleteProject, isPending } = useDeleteProjectMutation();
  const handleDelete = () => {
    if (!workspaceId || !projectId) {
      toast.error("Missing Workspace or Project ID");
      return;
    }

    deleteProject(
      { workspaceId, projectId },
      {
        onSuccess: () => {
          toast.success("Project deleted successfully");
          navigate(`/workspaces/${workspaceId}`);
        },
        onError: (error) => {
          console.error(error);
          toast.error("Failed to delete project");
        },
      }
    );
  };

  if (isLoading)
    return (
      <div>
        <Loader />
      </div>
    );

  const { project, tasks } = data;
  const projectProgress = getProjectProgress(tasks);

  const handleTaskClick = (taskId: string) => {
    navigate(
      `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`
    );
  };

  return (
    <div className="space-y-6 md:space-y-8 px-1 md:px-0">
      {/* Header Section */}
      <div className="sticky top-13 z-10 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 py-4 -mx-1 px-1 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b mb-6">
        <div className="space-y-2">
          <BackButton />
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold truncate max-w-[300px] md:max-w-md">
              {project.title}
            </h1>
          </div>
          {project.description && (
            <p className="text-sm text-gray-500 max-w-2xl">
              {project.description}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          {/* Progress Section */}
          <div className="flex flex-col justify-center gap-1 min-w-[140px] flex-1 sm:flex-none p-2 bg-muted/30 rounded-lg border">
            <div className="flex justify-between items-center text-sm text-muted-foreground mb-1">
              <span className="text-xs">Progress</span>
              <span className="font-medium text-xs">{projectProgress}%</span>
            </div>
            <Progress value={projectProgress} className="h-1" />
          </div>

          {/* Actions Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              onClick={() => setIsCreateTask(true)}
              className="flex-1 sm:flex-none"
            >
              Add Task
            </Button>

            <ConfirmDialog
              title="Delete Project?"
              description="Are you sure you want to delete this project? This action cannot be undone and will remove all associated tasks."
              confirmText="Delete Project"
              onConfirm={handleDelete}
              isLoading={isPending}
            >
              <Button
                variant="destructive"
                disabled={isPending}
                className="flex-1 sm:flex-none"
              >
                {isPending ? (
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                <span className="sr-only sm:not-sr-only">Delete</span>
                <span className="sm:hidden">Delete</span>
              </Button>
            </ConfirmDialog>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col gap-6">
        <Tabs defaultValue="all" className="w-full">
          {/* Filters and Stats */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
            <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full xl:w-auto h-auto gap-1">
              <TabsTrigger value="all" onClick={() => setTaskFilter("All")}>
                All
              </TabsTrigger>
              <TabsTrigger value="todo" onClick={() => setTaskFilter("To Do")}>
                To Do
              </TabsTrigger>
              <TabsTrigger
                value="in-progress"
                onClick={() => setTaskFilter("In Progress")}
              >
                In Progress
              </TabsTrigger>
              <TabsTrigger value="done" onClick={() => setTaskFilter("Done")}>
                Done
              </TabsTrigger>
            </TabsList>

            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-muted-foreground hidden sm:inline mr-1">
                Status:
              </span>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <Badge
                  variant="outline"
                  className="bg-background flex-1 justify-center sm:flex-none"
                >
                  {tasks.filter((task) => task.status === "To Do").length} To Do
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-background flex-1 justify-center sm:flex-none"
                >
                  {tasks.filter((task) => task.status === "In Progress").length}{" "}
                  In Progress
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-background flex-1 justify-center sm:flex-none"
                >
                  {tasks.filter((task) => task.status === "Done").length} Done
                </Badge>
              </div>
            </div>
          </div>

          {/* Tab Contents */}
          <TabsContent value="all" className="m-0">
            {/* Responsive Grid: 1 col on mobile, 3 cols on md/lg */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TaskColumn
                title="To Do"
                tasks={tasks.filter((task) => task.status === "To Do")}
                onTaskClick={handleTaskClick}
              />

              <TaskColumn
                title="In Progress"
                tasks={tasks.filter((task) => task.status === "In Progress")}
                onTaskClick={handleTaskClick}
              />

              <TaskColumn
                title="Done"
                tasks={tasks.filter((task) => task.status === "Done")}
                onTaskClick={handleTaskClick}
              />
            </div>
          </TabsContent>

          <TabsContent value="todo" className="m-0">
            <div className="grid grid-cols-1 gap-4">
              <TaskColumn
                title="To Do"
                tasks={tasks.filter((task) => task.status === "To Do")}
                onTaskClick={handleTaskClick}
                isFullWidth
              />
            </div>
          </TabsContent>

          <TabsContent value="in-progress" className="m-0">
            <div className="grid grid-cols-1 gap-4">
              <TaskColumn
                title="In Progress"
                tasks={tasks.filter((task) => task.status === "In Progress")}
                onTaskClick={handleTaskClick}
                isFullWidth
              />
            </div>
          </TabsContent>

          <TabsContent value="done" className="m-0">
            <div className="grid grid-cols-1 gap-4">
              <TaskColumn
                title="Done"
                tasks={tasks.filter((task) => task.status === "Done")}
                onTaskClick={handleTaskClick}
                isFullWidth
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <CreateTaskDialog
        open={isCreateTask}
        onOpenChange={setIsCreateTask}
        projectId={projectId!}
        projectMembers={project.members as any}
      />
    </div>
  );
};

export default ProjectDetails;

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  isFullWidth?: boolean;
}

const TaskColumn = ({
  title,
  tasks,
  onTaskClick,
  isFullWidth = false,
}: TaskColumnProps) => {
  return (
    <div
      className={
        isFullWidth
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          : "h-full"
      }
    >
      <div
        className={cn(
          "space-y-4",
          !isFullWidth ? "h-full" : "col-span-full mb-4"
        )}
      >
        {!isFullWidth && (
          <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg border">
            <h1 className="font-semibold text-sm md:text-base">{title}</h1>
            <Badge variant="secondary" className="px-2">
              {tasks.length}
            </Badge>
          </div>
        )}

        <div
          className={cn(
            "space-y-3",
            isFullWidth &&
              "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 space-y-0"
          )}
        >
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
              No tasks in {title}
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onClick={() => onTaskClick(task._id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const TaskCard = ({ task, onClick }: { task: Task; onClick: () => void }) => {
  return (
    <Card
      onClick={onClick}
      className="cursor-pointer hover:shadow-md transition-all duration-300 hover:border-primary/50 group"
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <Badge
            className={cn(
              "shrink-0",
              task.priority === "High"
                ? "bg-red-500 hover:bg-red-600 text-white"
                : task.priority === "Medium"
                  ? "bg-orange-500 hover:bg-orange-600 text-white"
                  : "bg-slate-500 hover:bg-slate-600 text-white"
            )}
          >
            {task.priority}
          </Badge>

          {/* Action buttons with better spacing on mobile */}
          <div className="flex items-center gap-0.5 -mr-2">
            {task.status !== "To Do" && (
              <Button
                variant={"ghost"}
                size={"icon"}
                className="size-7 md:size-8 text-muted-foreground hover:text-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("mark as to do");
                }}
                title="Mark as To Do"
              >
                <AlertCircle className="size-4" />
                <span className="sr-only">Mark as To Do</span>
              </Button>
            )}
            {task.status !== "In Progress" && (
              <Button
                variant={"ghost"}
                size={"icon"}
                className="size-7 md:size-8 text-muted-foreground hover:text-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("mark as in progress");
                }}
                title="Mark as In Progress"
              >
                <Clock className="size-4" />
                <span className="sr-only">Mark as In Progress</span>
              </Button>
            )}
            {task.status !== "Done" && (
              <Button
                variant={"ghost"}
                size={"icon"}
                className="size-7 md:size-8 text-muted-foreground hover:text-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("mark as done");
                }}
                title="Mark as Done"
              >
                <CheckCircle className="size-4" />
                <span className="sr-only">Mark as Done</span>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2">
        <h4 className="font-medium mb-1 line-clamp-1">{task.title}</h4>

        {task.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3 min-h-[40px]">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between text-sm mt-auto">
          <div className="flex items-center gap-2">
            {task.assignees && task.assignees.length > 0 && (
              <div className="flex -space-x-2">
                {task.assignees.slice(0, 3).map((member) => (
                  <Avatar
                    key={member._id}
                    className="size-6 md:size-7 border-2 border-background ring-1 ring-muted"
                    title={member.name}
                  >
                    <AvatarImage
                      className="object-cover"
                      src={member.profilePicture}
                    />
                    <AvatarFallback className="text-[10px]">
                      {member.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                ))}

                {task.assignees.length > 3 && (
                  <div className="flex items-center justify-center size-6 md:size-7 rounded-full bg-muted border-2 border-background text-[10px] font-medium">
                    +{task.assignees.length - 3}
                  </div>
                )}
              </div>
            )}
          </div>

          {task.dueDate && (
            <div
              className={cn(
                "text-xs flex items-center px-2 py-1 rounded-full bg-muted",
                new Date(task.dueDate) < new Date() && task.status !== "Done"
                  ? "text-red-500 bg-red-50"
                  : "text-muted-foreground"
              )}
            >
              <Calendar className="size-3 mr-1" />
              {format(new Date(task.dueDate), "MMM d")}
            </div>
          )}
        </div>

        {task.subtasks && task.subtasks.length > 0 && (
          <div className="mt-3 pt-2 border-t flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary/50 rounded-full"
                style={{
                  width: `${(task.subtasks.filter((t) => t.completed).length / task.subtasks.length) * 100}%`,
                }}
              />
            </div>
            <span>
              {task.subtasks.filter((subtask) => subtask.completed).length}/
              {task.subtasks.length}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
