import type { Project } from "@/types/indedx";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { getProjectProgress, getTaskStatusColor } from "@/lib";
import { Link, useSearchParams } from "react-router";
import { cn } from "@/lib/utils";
import { Progress } from "../ui/progress";

export const RecentProjects = ({ data }: { data: Project[] }) => {
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");

  return (
    <Card className="h-full shadow-sm">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg">Recent Projects</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 sm:space-y-4">
        {data.length === 0 ? (
          <p className="text-center text-muted-foreground py-8 text-xs sm:text-sm">
            No projects created yet.
          </p>
        ) : (
          data.map((project) => {
            const projectProgress = getProjectProgress(project.tasks);

            return (
              <div
                key={project._id}
                className="border rounded-lg p-3 sm:p-4 transition-all hover:bg-muted/40 hover:border-primary/20 group"
              >
                {/* Top Section: Title & Status */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  {/* Link Container with min-w-0 to fix overflow */}
                  <Link
                    to={`/workspaces/${workspaceId}/projects/${project._id}`}
                    className="min-w-0 flex-1 flex flex-col gap-0.5"
                  >
                    <h3 className="font-semibold text-sm sm:text-base truncate group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-muted-foreground line-clamp-1 break-words">
                      {project.description || "No description"}
                    </p>
                  </Link>

                  {/* Status Badge */}
                  <span
                    className={cn(
                      "px-1.5 py-0.5 sm:px-2 text-[10px] sm:text-xs font-medium rounded-full shrink-0 uppercase tracking-wide border",
                      getTaskStatusColor(project.status),
                    )}
                  >
                    {project.status}
                  </span>
                </div>

                {/* Bottom Section: Progress */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] sm:text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span className="font-medium text-foreground">
                      {projectProgress}%
                    </span>
                  </div>
                  <Progress value={projectProgress} className="h-1 sm:h-1.5" />
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};
