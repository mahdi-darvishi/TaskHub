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
    <Card className="h-full shadow-sm flex flex-col">
      <CardHeader className="p-4 sm:p-5 pb-2">
        <CardTitle className="text-base sm:text-lg font-semibold">
          Upcoming Tasks
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Next items on your list
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 pt-0 space-y-2 flex-1 overflow-y-auto">
        {data.length === 0 ? (
          <div className="text-center text-muted-foreground py-8 text-xs sm:text-sm bg-muted/20 rounded-lg border border-dashed border-border/50">
            All caught up! No upcoming tasks.
          </div>
        ) : (
          data.map((task) => (
            <Link
              to={`/workspaces/${workspaceId}/projects/${task.project}/tasks/${task._id}`}
              key={task._id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 border border-transparent hover:border-border/50 transition-all group"
            >
              {/* Priority Icon Wrapper */}
              <div
                className={cn(
                  "mt-0.5 rounded-full p-0.5 shrink-0 transition-transform group-hover:scale-110",
                  task.priority === "High" && "text-red-600 bg-red-100/50",
                  task.priority === "Medium" &&
                    "text-amber-600 bg-amber-100/50",
                  task.priority === "Low" && "text-blue-600 bg-blue-100/50",
                )}
              >
                {task.status === "Done" ? (
                  <CheckCircle2 className="size-4" />
                ) : (
                  <Circle className="size-4" />
                )}
              </div>

              {/* Text Content - min-w-0 allows truncation */}
              <div className="space-y-1 min-w-0 flex-1">
                <p className="font-medium text-sm sm:text-base truncate leading-snug group-hover:text-primary transition-colors">
                  {task.title}
                </p>

                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  {/* Status Badge */}
                  <span className="bg-muted px-1.5 py-0.5 rounded-md capitalize font-medium border border-border/50">
                    {task.status}
                  </span>

                  {/* Date */}
                  {task.dueDate && (
                    <div className="flex items-center gap-1 min-w-0">
                      <span className="text-muted-foreground/30 hidden sm:inline">
                        •
                      </span>
                      <Clock className="size-3 shrink-0" />
                      <span className="truncate whitespace-nowrap">
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
