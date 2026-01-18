import type { Task } from "@/types/indedx";
import { Link, useSearchParams } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { format } from "date-fns";

export const UpcomingTasks = ({ data }: { data: Task[] }) => {
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");

  return (
    <Card className="h-full shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Upcoming Tasks</CardTitle>
        <CardDescription>Next items on your list</CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        {data.length === 0 ? (
          <div className="text-center text-muted-foreground py-10 text-sm">
            All caught up! No upcoming tasks.
          </div>
        ) : (
          data.map((task) => (
            <Link
              to={`/workspaces/${workspaceId}/projects/${task.project}/tasks/${task._id}`}
              key={task._id}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/40 border border-transparent hover:border-border transition-all"
            >
              <div
                className={cn(
                  "mt-0.5 rounded-full p-0.5 shrink-0",
                  task.priority === "High" && "text-red-600 bg-red-50",
                  task.priority === "Medium" && "text-amber-600 bg-amber-50",
                  task.priority === "Low" && "text-blue-600 bg-blue-50",
                )}
              >
                {task.status === "Done" ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}
              </div>

              <div className="space-y-1 min-w-0 flex-1">
                <p className="font-medium text-sm truncate leading-none">
                  {task.title}
                </p>

                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                  <span className="bg-muted px-1.5 py-0.5 rounded capitalize">
                    {task.status}
                  </span>

                  {task.dueDate && (
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground/30">•</span>
                      <Clock className="w-3 h-3" />
                      <span className="truncate">
                        {format(new Date(task.dueDate), "MMM d")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
};
