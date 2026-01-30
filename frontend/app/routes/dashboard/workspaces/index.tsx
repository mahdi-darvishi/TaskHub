import { NoDataFound } from "@/components/no-data-found";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateWorkspace } from "@/components/workspace/create-workspace";
import WorkspaceAvatar from "@/components/workspace/workspace-avatar";
import { useGetWorkspacesQuery } from "@/hooks/use-workspace";
import type { Workspace } from "@/types/indedx";
import { ArrowRight, PlusCircle, Users } from "lucide-react";
import { useState } from "react";
import { Link, type MetaFunction } from "react-router";
import { format } from "date-fns";
import Loader from "@/components/loader";
export const meta: MetaFunction = () => {
  return [{ title: "TaskHub - Workspaces" }];
};

const Workspaces = () => {
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);

  // Corrected typo: worksapces -> workspaces
  const { data: workspaces, isLoading } = useGetWorkspacesQuery() as {
    data: Workspace[];
    isLoading: boolean;
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <div className="space-y-8 p-4 md:p-0">
        {/* Header: Stack on mobile, Row on desktop */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl md:text-3xl font-bold">Workspaces</h2>

          <Button
            onClick={() => setIsCreatingWorkspace(true)}
            className="w-full sm:w-auto"
          >
            <PlusCircle className="size-4 mr-2" />
            New Workspace
          </Button>
        </div>

        {/* Responsive Grid: 1 col mobile, 2 cols tablet, 3 cols desktop */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((workspace) => (
            <WorkspaceCard key={workspace._id} workspace={workspace} />
          ))}

          {workspaces.length === 0 && (
            <div className="col-span-full">
              <NoDataFound
                title="No workspace found"
                description="Create a new workspace to get started"
                buttonText="Create Workspace"
                buttonAction={() => setIsCreatingWorkspace(true)}
              />
            </div>
          )}
        </div>
      </div>

      <CreateWorkspace
        isCreatingWorkspace={isCreatingWorkspace}
        setIsCreatingWorkspace={setIsCreatingWorkspace}
      />
    </>
  );
};

// Workspace Card Component
const WorkspaceCard = ({ workspace }: { workspace: Workspace }) => {
  return (
    <Link to={`/workspaces/${workspace._id}`} className="block h-full group">
      <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-md hover:border-primary/50 active:scale-[0.98]">
        {/* Header Section */}
        <CardHeader className="p-3 sm:p-5 pb-2 space-y-0">
          <div className="flex items-start justify-between gap-3">
            {/* Avatar & Title Group */}
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 overflow-hidden">
              <div className="shrink-0">
                <WorkspaceAvatar
                  name={workspace.name}
                  color={workspace.color}
                  // className="size-8 sm:size-10 text-xs sm:text-sm"
                />
              </div>

              <div className="min-w-0 flex flex-col">
                <CardTitle className="truncate text-sm sm:text-base md:text-lg font-semibold group-hover:text-primary transition-colors">
                  {workspace.name}
                </CardTitle>
                <span className="text-[10px] sm:text-xs text-muted-foreground truncate">
                  Created {format(new Date(workspace.createdAt), "MMM d, yyyy")}
                </span>
              </div>
            </div>

            {/* Members Badge */}
            <div className="shrink-0 flex items-center bg-muted/50 text-muted-foreground px-2 py-1 rounded-md border border-transparent group-hover:border-border transition-colors">
              <Users className="size-3 sm:size-3.5 mr-1.5" />
              <span className="text-[10px] sm:text-xs font-medium">
                {workspace.members.length}
              </span>
            </div>
          </div>

          {/* Description */}
          <CardDescription className="line-clamp-2 mt-3 text-xs sm:text-sm leading-relaxed">
            {workspace.description ||
              "No description provided for this workspace."}
          </CardDescription>
        </CardHeader>

        {/* Footer / Action Area */}
        <CardContent className="mt-auto p-3 sm:p-5 pt-0">
          <div className="flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground bg-muted/30 p-2 rounded-lg group-hover:bg-primary/5 group-hover:text-primary transition-colors">
            <span>View Details</span>
            <ArrowRight className="size-3 -ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Workspaces;
