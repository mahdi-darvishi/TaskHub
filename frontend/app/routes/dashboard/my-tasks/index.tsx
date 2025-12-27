import { useState } from "react";
import { isToday, isPast } from "date-fns";

// Hooks
import {
  useGetMyTasksQuery,
  useUpdateTaskStatusMutation,
  useDeleteTaskMutation,
} from "@/hooks/use-task";
import type { TaskType } from "@/components/myTask/types";
import { MyTasksSkeleton } from "@/components/myTask/my-tasks-skeleton";
import { MyTasksHeader } from "@/components/myTask/my-tasks-header";
import { MyTasksStats } from "@/components/myTask/y-tasks-stats";
import { MyTasksToolbar } from "@/components/myTask/my-tasks-toolbar";
import { EmptyState } from "@/components/myTask/empty-state";
import { TaskListView } from "@/components/myTask/task-list-view";
import type { TaskStatus } from "@/types/indedx";
import { TaskBoardView } from "@/components/myTask/task-board-view";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

// Types

export default function MyTasksPage() {
  const queryClient = useQueryClient();
  const QUERY_KEY = ["my-tasks", "user"];
  // --- States ---
  const [view, setView] = useState<"list" | "board">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState<string | "ALL">("ALL");

  // --- API Hooks ---
  const { data: tasksData, isLoading, isError } = useGetMyTasksQuery();
  const { mutate: updateStatus } = useUpdateTaskStatusMutation();
  const { mutate: deleteTask } = useDeleteTaskMutation();

  // --- Data Processing ---
  const tasks = (tasksData as TaskType[]) || [];

  // Filtering Logic
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesPriority =
      filterPriority === "ALL" || task.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  // Stats Logic
  const stats = {
    total: filteredTasks.length,
    dueToday: filteredTasks.filter(
      (t) => t.dueDate && isToday(new Date(t.dueDate)) && t.status !== "Done"
    ).length,
    overdue: filteredTasks.filter(
      (t) =>
        t.dueDate &&
        isPast(new Date(t.dueDate)) &&
        !isToday(new Date(t.dueDate)) &&
        t.status !== "Done"
    ).length,
    completed: filteredTasks.filter((t) => t.status === "Done").length,
  };

  // --- Render ---
  if (isLoading) return <MyTasksSkeleton />;
  if (isError) {
    return (
      <div className="flex items-center justify-center h-full text-destructive animate-in fade-in">
        Failed to load tasks. Please try again later.
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6 p-6 max-w-[1600px] mx-auto w-full">
      {/* 1. Header Section */}
      <MyTasksHeader />

      {/* 2. Statistics Cards */}
      <MyTasksStats stats={stats} />

      {/* 3. Toolbar (Search, Filter, View Toggle) */}
      <MyTasksToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterPriority={filterPriority}
        setFilterPriority={setFilterPriority}
        view={view}
        setView={setView}
      />

      {/* 4. Main Content Area */}
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
                  }
                )
              }
              onDelete={(task: TaskType) => {
                if (!task.workspace?._id || !task.project?._id) {
                  console.error("Missing workspace or project ID");
                  return;
                }

                deleteTask(
                  {
                    taskId: task._id,
                    workspaceId: task.workspace._id,
                    projectId: task.project._id,
                  },
                  {
                    onSuccess: () => {
                      toast.success("Task Deleted", {
                        description: "The task has been permanently removed.",
                      });
                      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
                    },
                    onError: () => {
                      toast.error("Error", {
                        description: "Failed to delete the task.",
                      });
                    },
                  }
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
  );
}
