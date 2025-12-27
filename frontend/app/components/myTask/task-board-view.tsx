import { format } from "date-fns";
import { Link } from "react-router";
import { Clock, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full overflow-x-auto pb-4">
      {columns.map((status) => (
        <div
          key={status}
          className="flex flex-col h-full bg-muted/30 rounded-xl border p-4"
        >
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <span
                className={cn(
                  "w-2.5 h-2.5 rounded-full",
                  status === "To Do"
                    ? "bg-slate-400"
                    : status === "In Progress"
                      ? "bg-blue-500"
                      : "bg-green-500"
                )}
              />
              {status}
            </h3>
            <Badge variant="secondary" className="bg-background">
              {tasks.filter((t) => t.status === status).length}
            </Badge>
          </div>
          <div className="flex flex-col gap-3 overflow-y-auto min-h-[200px]">
            {tasks
              .filter((t) => t.status === status)
              .map((task) => (
                <Card
                  key={task._id}
                  className="cursor-grab hover:shadow-md transition-all group border-l-4 relative bg-card"
                  style={{ borderLeftColor: getPriorityColor(task.priority) }}
                >
                  <CardContent className="p-4 space-y-3">
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
                            className="h-6 w-6 shrink-0"
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

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex -space-x-2">
                        {task.assignees?.map((u: any, i: number) => (
                          <Avatar
                            key={i}
                            className="w-6 h-6 border-2 border-background"
                          >
                            <AvatarImage
                              className="object-cover"
                              src={u.profilePicture}
                            />
                            <AvatarFallback className="text-[9px]">
                              {u.name?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                      {task.dueDate && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                          <Clock className="w-3 h-3" />
                          {format(new Date(task.dueDate), "MMM d")}
                        </div>
                      )}
                    </div>

                    <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <span className="truncate max-w-[120px]">
                        {task.project?.name}
                      </span>
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
