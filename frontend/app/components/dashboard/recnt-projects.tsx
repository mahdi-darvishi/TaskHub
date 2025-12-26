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
    // ✅ FIX: Typo 'col-spa-2' -> 'col-span-2'
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Projects</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {data.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No Recent project yet
          </p>
        ) : (
          data.map((project) => {
            const projectProgress = getProjectProgress(project.tasks);

            return (
              <div
                key={project._id}
                className="border rounded-lg p-4 transition-all hover:bg-muted/20"
              >
                <div className="flex items-center justify-between mb-2">
                  <Link
                    to={`/workspaces/${workspaceId}/projects/${project._id}`}
                    className="min-w-0 flex-1 mr-2"
                  >
                    {/* ✅ FIX: Added truncate to prevent overflow on small screens */}
                    <h3 className="font-medium hover:text-primary transition-colors truncate">
                      {project.title}
                    </h3>
                  </Link>

                  <span
                    className={cn(
                      "px-2 py-1 text-xs rounded-full shrink-0",
                      getTaskStatusColor(project.status)
                    )}
                  >
                    {project.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {project.description}
                </p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span>{projectProgress}%</span>
                  </div>
                  <Progress value={projectProgress} className="h-2" />
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};
