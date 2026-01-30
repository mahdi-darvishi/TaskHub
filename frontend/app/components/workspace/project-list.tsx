import type { Project } from "@/types/indedx";
import { NoDataFound } from "../no-data-found";
import { ProjectCard } from "../project/project-card";
import { getProjectProgress } from "@/lib";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";

interface ProjectListProps {
  workspaceId: string;
  projects: Project[];
  onCreateProject: () => void;
}

export const ProjectList = ({
  workspaceId,
  projects,
  onCreateProject,
}: ProjectListProps) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg sm:text-xl font-semibold tracking-tight">
            Projects
          </h3>
          <span className="bg-muted text-muted-foreground text-xs font-medium px-2 py-0.5 rounded-full">
            {projects.length}
          </span>
        </div>

        {/* Mobile-only shortcut button (Optional UX improvement) */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onCreateProject}
          className="h-8 text-xs sm:hidden"
        >
          <Plus className="size-3.5 mr-1" /> New
        </Button>
      </div>

      {/* Content Section */}
      {projects.length === 0 ? (
        // Empty State - Full Width (Not inside grid)
        <div className="w-full py-6">
          <NoDataFound
            title="No projects found"
            description="Create your first project to get started managing tasks."
            buttonText="Create Project"
            buttonAction={onCreateProject}
          />
        </div>
      ) : (
        // Grid State - Only renders when we have projects
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {projects.map((project) => {
            const projectProgress = getProjectProgress(project.tasks);
            return (
              <ProjectCard
                key={project._id}
                project={project}
                progress={projectProgress}
                workspaceId={workspaceId}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
