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
import { PlusCircle, Users } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { format } from "date-fns";
import Loader from "@/components/loader";

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
    <Link to={`/workspaces/${workspace._id}`}>
      <Card className="transition-all hover:shadow-md hover:-translate-y-1 h-full flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex gap-3 overflow-hidden">
              <WorkspaceAvatar name={workspace.name} color={workspace.color} />
              <div className="min-w-0">
                <CardTitle className="truncate text-base md:text-lg">
                  {workspace.name}
                </CardTitle>
                <span className="text-xs text-muted-foreground block mt-1">
                  Created {format(new Date(workspace.createdAt), "MMM d, yyyy")}
                </span>
              </div>
            </div>

            <div className="flex items-center text-muted-foreground shrink-0 bg-muted/50 px-2 py-1 rounded-md">
              <Users className="size-3.5 mr-1.5" />
              <span className="text-xs font-medium">
                {workspace.members.length}
              </span>
            </div>
          </div>

          <CardDescription className="line-clamp-2 mt-2 text-sm">
            {workspace.description || "No description provided."}
          </CardDescription>
        </CardHeader>

        <CardContent className="mt-auto pt-2">
          <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded text-center">
            Click to view details
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Workspaces;
