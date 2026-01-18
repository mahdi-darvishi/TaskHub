import { format, isToday, isPast, isTomorrow, isFuture } from "date-fns";
import { Link } from "react-router";
import {
  CheckCircle2,
  Circle,
  Clock,
  MoreHorizontal,
  ArrowUpCircle,
  ArrowDownCircle,
  MinusCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { TaskStatus, TaskType } from "./types";
import { ConfirmDialog } from "../confirm-dialog";

interface TaskListViewProps {
  tasks: TaskType[];
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDelete: (task: TaskType) => void;
}

export const TaskListView = ({
  tasks,
  onStatusChange,
  onDelete,
}: TaskListViewProps) => {
  const overdue = tasks.filter(
    (t) =>
      t.dueDate &&
      isPast(new Date(t.dueDate)) &&
      !isToday(new Date(t.dueDate)) &&
      t.status !== "Done",
  );
  const today = tasks.filter(
    (t) => t.dueDate && isToday(new Date(t.dueDate)) && t.status !== "Done",
  );
  const tomorrow = tasks.filter(
    (t) => t.dueDate && isTomorrow(new Date(t.dueDate)) && t.status !== "Done",
  );
  const upcoming = tasks.filter(
    (t) =>
      (isFuture(new Date(t.dueDate || "")) || !t.dueDate) &&
      !isTomorrow(new Date(t.dueDate || "")) &&
      t.status !== "Done",
  );
  const done = tasks.filter((t) => t.status === "Done");

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      <TaskGroup
        title="Overdue"
        tasks={overdue}
        variant="danger"
        onStatusChange={onStatusChange}
        onDelete={onDelete}
      />
      <TaskGroup
        title="Today"
        tasks={today}
        variant="primary"
        onStatusChange={onStatusChange}
        onDelete={onDelete}
      />
      <TaskGroup
        title="Tomorrow"
        tasks={tomorrow}
        variant="default"
        onStatusChange={onStatusChange}
        onDelete={onDelete}
      />
      <TaskGroup
        title="Upcoming"
        tasks={upcoming}
        variant="default"
        onStatusChange={onStatusChange}
        onDelete={onDelete}
      />
      <TaskGroup
        title="Completed"
        tasks={done}
        variant="muted"
        onStatusChange={onStatusChange}
        onDelete={onDelete}
      />
    </div>
  );
};

const TaskGroup = ({
  title,
  tasks,
  variant,
  onStatusChange,
  onDelete,
}: any) => {
  if (tasks.length === 0) return null;
  const titleColor =
    variant === "danger"
      ? "text-red-600"
      : variant === "primary"
        ? "text-blue-600"
        : variant === "muted"
          ? "text-muted-foreground"
          : "text-foreground";

  return (
    <div className="space-y-3">
      <h3
        className={cn(
          "text-sm font-semibold flex items-center gap-2 sticky top-0 bg-background/95 backdrop-blur py-2 z-10",
          titleColor,
        )}
      >
        {title}
        <Badge
          variant="secondary"
          className="ml-2 px-1.5 min-w-6 justify-center"
        >
          {tasks.length}
        </Badge>
      </h3>
      <div className="rounded-lg border bg-card divide-y shadow-sm">
        {tasks.map((task: TaskType) => (
          <div
            key={task._id}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 hover:bg-muted/40 transition-colors group gap-3 sm:gap-4"
          >
            <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0 w-full">
              <button
                onClick={() =>
                  onStatusChange(
                    task._id,
                    task.status === "Done" ? "To Do" : "Done",
                  )
                }
                className="text-muted-foreground hover:text-primary transition-colors shrink-0 mt-0.5 sm:mt-0"
              >
                {task.status === "Done" ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </button>
              <div className="min-w-0 space-y-1 w-full">
                <Link
                  to={`/workspaces/${task.workspace?._id}/projects/${task.project?._id}/tasks/${task._id}`}
                  className={cn(
                    "font-medium block truncate text-sm sm:text-base hover:underline w-full",
                    task.status === "Done" &&
                      "line-through text-muted-foreground",
                  )}
                >
                  {task.title}
                </Link>
                <div className="flex items-center flex-wrap gap-2 text-xs text-muted-foreground">
                  <Badge
                    variant="outline"
                    className="font-normal text-[10px] max-w-[120px] truncate"
                  >
                    {task.project?.title || "No Project"}
                  </Badge>
                  {task.workspace && (
                    <>
                      <span className="hidden sm:inline text-muted-foreground/40">
                        •
                      </span>
                      <span className="hidden sm:inline truncate max-w-[150px]">
                        {task.workspace.name}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 shrink-0 w-full sm:w-auto pl-8 sm:pl-0 mt-1 sm:mt-0">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground sm:min-w-20 justify-start sm:justify-end">
                {task.dueDate && (
                  <>
                    <Clock className="h-3.5 w-3.5 shrink-0" />
                    <span
                      className={cn(
                        "whitespace-nowrap",
                        isPast(new Date(task.dueDate)) &&
                          task.status !== "Done" &&
                          "text-destructive font-medium",
                      )}
                    >
                      {format(new Date(task.dueDate), "MMM d")}
                    </span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                <PriorityBadge priority={task.priority} />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 sm:opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  {/* ... Dropdown Content (Same as before) ... */}
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => onStatusChange(task._id, "To Do")}
                    >
                      To Do
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onStatusChange(task._id, "In Progress")}
                    >
                      In Progress
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onStatusChange(task._id, "Done")}
                    >
                      Done
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <ConfirmDialog
                      title="Delete Task"
                      description="Are you sure you want to delete this task? This action cannot be undone."
                      confirmText="Delete Task"
                      variant="destructive"
                      onConfirm={() => onDelete(task)}
                    >
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="text-red-600 focus:text-red-600 cursor-pointer"
                      >
                        Delete
                      </DropdownMenuItem>
                    </ConfirmDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const PriorityBadge = ({ priority }: { priority: string }) => {
  const icon =
    priority === "High"
      ? ArrowUpCircle
      : priority === "Medium"
        ? MinusCircle
        : ArrowDownCircle;
  const IconComp = icon;
  const styles = {
    High: "text-red-600 bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30",
    Medium:
      "text-amber-600 bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/30",
    Low: "text-blue-600 bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/30",
  };
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium border shrink-0",
        (styles as any)[priority] || styles.Low,
      )}
    >
      <IconComp className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
      {priority}
    </div>
  );
};
