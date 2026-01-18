import { useState } from "react";
import { isToday, isPast, isThisWeek } from "date-fns";

// Hooks
import {
  useGetMyTasksQuery,
  useUpdateTaskStatusMutation,
  useDeleteTaskMutation,
} from "@/hooks/use-task";
import type { TaskType } from "@/components/myTask/types";
import { MyTasksSkeleton } from "@/components/myTask/my-tasks-skeleton";
import { MyTasksHeader } from "@/components/myTask/my-tasks-header";
import { MyTasksStats } from "@/components/myTask/my-tasks-stats";
import { MyTasksToolbar } from "@/components/myTask/my-tasks-toolbar";
import { EmptyState } from "@/components/myTask/empty-state";
import { TaskListView } from "@/components/myTask/task-list-view";
import { TaskBoardView } from "@/components/myTask/task-board-view";
import type { TaskStatus } from "@/types/indedx";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import type { MetaFunction } from "react-router";
export const meta: MetaFunction = () => {
  return [{ title: "TaskHub - My Tasks" }];
};

export type DateFilterType = "ALL" | "TODAY" | "WEEK" | "OVERDUE";

export default function MyTasksPage() {
  const queryClient = useQueryClient();
  const QUERY_KEY = ["my-tasks", "user"];

  const [view, setView] = useState<"list" | "board">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState<string | "ALL">("ALL");
  const [filterDate, setFilterDate] = useState<DateFilterType>("ALL");

  const { data: tasksData, isLoading, isError } = useGetMyTasksQuery();
  const { mutate: updateStatus } = useUpdateTaskStatusMutation();
  const { mutate: deleteTask } = useDeleteTaskMutation();

  const tasks = (tasksData as TaskType[]) || [];

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesPriority =
      filterPriority === "ALL" || task.priority === filterPriority;

    let matchesDate = true;
    if (filterDate !== "ALL") {
      if (!task.dueDate) {
        matchesDate = false;
      } else {
        const date = new Date(task.dueDate);
        if (filterDate === "TODAY") {
          matchesDate = isToday(date);
        } else if (filterDate === "WEEK") {
          matchesDate = isThisWeek(date, { weekStartsOn: 6 });
        } else if (filterDate === "OVERDUE") {
          matchesDate =
            isPast(date) && !isToday(date) && task.status !== "Done";
        }
      }
    }

    return matchesSearch && matchesPriority && matchesDate;
  });

  const stats = {
    total: filteredTasks.length,
    dueToday: filteredTasks.filter(
      (t) => t.dueDate && isToday(new Date(t.dueDate)) && t.status !== "Done",
    ).length,
    overdue: filteredTasks.filter(
      (t) =>
        t.dueDate &&
        isPast(new Date(t.dueDate)) &&
        !isToday(new Date(t.dueDate)) &&
        t.status !== "Done",
    ).length,
    completed: filteredTasks.filter((t) => t.status === "Done").length,
  };

  if (isLoading) return <MyTasksSkeleton />;
  if (isError) {
    return (
      <div className="flex items-center justify-center h-full text-destructive animate-in fade-in">
        Failed to load tasks. Please try again later.
      </div>
    );
  }

  return (
    // Responsive Padding and Max Width
    <div className="h-full flex flex-col space-y-6 p-4 sm:p-6 max-w-[1600px] mx-auto w-full">
      <MyTasksHeader />
      <MyTasksStats stats={stats} />

      <div className="flex flex-col gap-4">
        <MyTasksToolbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterPriority={filterPriority}
          setFilterPriority={setFilterPriority}
          filterDate={filterDate}
          setFilterDate={setFilterDate}
          view={view}
          setView={setView}
        />

        {filteredTasks.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex-1 min-h-0 animate-in fade-in duration-500">
            {view === "list" ? (
              <TaskListView
                tasks={filteredTasks}
                onStatusChange={(id: string, status: TaskStatus) =>
                  updateStatus(
                    { taskId: id, status },
                    {
                      onSuccess: () => {
                        toast.success("Status Updated", {
                          description: `Task moved to ${status}`,
                        });
                        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
                      },
                      onError: () => {
                        toast.error("Error", {
                          description: "Failed to update task status.",
                        });
                      },
                    },
                  )
                }
                onDelete={(task: TaskType) => {
                  if (!task.workspace?._id || !task.project?._id) return;
                  deleteTask(
                    {
                      taskId: task._id,
                      workspaceId: task.workspace._id,
                      projectId: task.project._id,
                    },
                    {
                      onSuccess: () => {
                        toast.success("Task Deleted", {
                          description: "Task removed permanently.",
                        });
                        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
                      },
                      onError: () => toast.error("Failed to delete task"),
                    },
                  );
                }}
              />
            ) : (
              <TaskBoardView
                tasks={filteredTasks}
                onStatusChange={(id: string, status: TaskStatus) =>
                  updateStatus({ taskId: id, status })
                }
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
