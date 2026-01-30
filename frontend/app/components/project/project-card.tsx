import { Link } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarDays, ListTodo } from "lucide-react";
import type { Project } from "@/types/indedx";
import { Progress } from "../ui/progress";
import { getTaskStatusColor } from "@/lib";

interface ProjectCardProps {
  project: Project;
  progress: number;
  workspaceId: string;
}

export const ProjectCard = ({
  project,
  progress,
  workspaceId,
}: ProjectCardProps) => {
  return (
    <Link
      to={`/workspaces/${workspaceId}/projects/${project._id}`}
      className="block h-full w-full group focus:outline-none min-w-0" // min-w-0 added to Link
    >
      <Card className="h-full w-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-transparent hover:border-border/50 bg-card">
        <CardHeader className="p-4 sm:p-5 pb-3 space-y-3">
          {/* --- Row 1: Status & Date (Meta Info) --- */}
          {/* min-w-0 here is CRITICAL to prevent flex items from forcing overflow */}
          <div className="flex items-center justify-between gap-2 min-w-0">
            {/* Status Badge - Added 'truncate' & 'max-w' to prevent pushing */}
            <span
              className={cn(
                "px-2.5 py-1 text-[10px] sm:text-xs font-semibold rounded-md uppercase tracking-wide border shadow-sm truncate max-w-[60%]",
                getTaskStatusColor(project.status),
              )}
            >
              {project.status}
            </span>

            {/* Date - shrink-0 ensures date doesn't get squashed, but doesn't cause overflow */}
            {project.dueDate && (
              <div className="shrink-0 flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-full">
                <CalendarDays className="size-3" />
                <span className="whitespace-nowrap">
                  {format(new Date(project.dueDate), "MMM d")}
                </span>
              </div>
            )}
          </div>

          {/* --- Row 2: Title & Description --- */}
          <div className="space-y-1.5 min-w-0">
            {/* Title - truncate works perfectly now because of parent min-w-0 */}
            <CardTitle className="text-base sm:text-lg font-bold leading-tight truncate group-hover:text-primary transition-colors">
              {project.title}
            </CardTitle>

            {/* Description - Fixed class to 'break-words' */}
            <CardDescription className="text-xs sm:text-sm line-clamp-2 min-h-[2.5em] leading-relaxed wrap-break-word">
              {project.description ||
                "No description provided for this project."}
            </CardDescription>
          </div>
        </CardHeader>

        {/* --- Footer: Progress & Stats --- */}
        <CardContent className="mt-auto p-4 sm:p-5 pt-0">
          <div className="bg-muted/20 rounded-lg p-3 space-y-3 border border-border/40">
            {/* Progress Label & Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] sm:text-xs font-medium">
                <span className="text-muted-foreground">Completion</span>
                <span
                  className={cn(
                    progress === 100 ? "text-green-600" : "text-foreground",
                  )}
                >
                  {Math.round(progress)}%
                </span>
              </div>
              <Progress value={progress} className="h-1.5 sm:h-2 bg-muted" />
            </div>

            {/* Task Counter */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
              <ListTodo className="size-3.5" />
              <span>
                <strong className="text-foreground">
                  {project.tasks.length}
                </strong>{" "}
                tasks
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
