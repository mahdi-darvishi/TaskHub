import { format } from "date-fns";
import { Link } from "react-router";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { TaskStatus, TaskType } from "./types";

interface BoardViewProps {
  tasks: TaskType[];
  onStatusChange: (id: string, status: TaskStatus) => void;
}

export const TaskBoardView = ({ tasks, onStatusChange }: BoardViewProps) => {
  const columns: TaskStatus[] = ["To Do", "In Progress", "Done"];
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "#ef4444";
      case "Medium":
        return "#f59e0b";
      default:
        return "#3b82f6";
    }
  };

  return (
    // Responsive Grid: 1 column on mobile, 3 columns on desktop
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 h-full pb-4 items-start">
      {columns.map((status) => (
        <div
          key={status}
          className="flex flex-col bg-muted/30 rounded-xl border p-3 md:p-4 h-full md:min-h-[500px]"
        >
          <div className="flex items-center justify-between mb-3 md:mb-4 px-1">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <span
                className={cn(
                  "w-2.5 h-2.5 rounded-full",
                  status === "To Do"
                    ? "bg-slate-400"
                    : status === "In Progress"
                      ? "bg-blue-500"
                      : "bg-green-500",
                )}
              />
              {status}
            </h3>
            <Badge variant="secondary" className="bg-background text-xs">
              {tasks.filter((t) => t.status === status).length}
            </Badge>
          </div>
          <div className="flex flex-col gap-3 min-h-[50px]">
            {tasks
              .filter((t) => t.status === status)
              .map((task) => (
                <Card
                  key={task._id}
                  className="cursor-grab hover:shadow-md transition-all group border-l-4 relative bg-card"
                  style={{ borderLeftColor: getPriorityColor(task.priority) }}
                >
                  <CardContent className="p-3 md:p-4 space-y-2 md:space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <Link
                        to={`/workspaces/${task.workspace?._id}/projects/${task.project?._id}/tasks/${task._id}`}
                        className="font-medium text-sm hover:underline line-clamp-2 leading-snug"
                      >
                        {task.title}
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 shrink-0 -mt-1 -mr-2"
                          >
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => onStatusChange(task._id, "To Do")}
                          >
                            To Do
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              onStatusChange(task._id, "In Progress")
                            }
                          >
                            In Progress
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onStatusChange(task._id, "Done")}
                          >
                            Done
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="text-[10px] text-muted-foreground flex items-center justify-between pt-1">
                      <span className="truncate max-w-[100px] bg-muted/50 px-1.5 py-0.5 rounded">
                        {task.project?.title}
                      </span>
                      {task.dueDate && (
                        <span className="text-[10px]">
                          {format(new Date(task.dueDate), "MMM d")}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};
