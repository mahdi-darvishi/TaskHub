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
import { CheckCircle2, Circle } from "lucide-react";
import { format } from "date-fns";
import { Separator } from "./ui/separator";

export const UpcomingTasks = ({ data }: { data: Task[] }) => {
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Upcoming Tasks</CardTitle>
        <CardDescription>Tasks due soon</CardDescription>
      </CardHeader>

      <CardContent className="space-y-1">
        {data.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No upcoming tasks yet
          </p>
        ) : (
          data.map((task) => (
            <>
              <Link
                to={`/workspaces/${workspaceId}/projects/${task.project}/tasks/${task._id}`}
                key={task._id}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div
                  className={cn(
                    "mt-0.5 rounded-full p-1 shrink-0",
                    task.priority === "High" && "bg-red-100 text-red-700",
                    task.priority === "Medium" &&
                      "bg-yellow-100 text-yellow-700",
                    task.priority === "Low" && "bg-gray-100 text-gray-700"
                  )}
                >
                  {task.status === "Done" ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Circle className="w-4 h-4" />
                  )}
                </div>

                {/* ✅ FIX: Added min-w-0 to allow text truncation */}
                <div className="space-y-1 min-w-0 flex-1">
                  <p className="font-medium text-sm md:text-base truncate">
                    {task.title}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="shrink-0">{task.status}</span>
                    {task.dueDate && (
                      <>
                        <span className="hidden sm:inline"> • </span>
                        <span className="truncate">
                          {format(new Date(task.dueDate), "MMM d, yyyy")}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
              <Separator />
            </>
          ))
        )}
      </CardContent>
    </Card>
  );
};
