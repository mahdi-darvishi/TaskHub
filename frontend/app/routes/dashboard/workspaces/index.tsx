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

  const { data: worksapces, isLoading } = useGetWorkspacesQuery() as {
    data: Workspace[];
    isLoading: boolean;
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <div className="space-y-8 ">
        <div className=" flex items-center justify-between">
          <h2 className="text-xl md:text-3xl font-bold ">Workspaces</h2>

          <Button onClick={() => setIsCreatingWorkspace(true)}>
            <PlusCircle className="size-4 mr-2" />
            New Workspaces
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols- lg:grid-cols-3">
          {worksapces.map((worksapce) => (
            <WorkspaceCard key={worksapce._id} worksapce={worksapce} />
          ))}

          {worksapces.length === 0 && (
            <NoDataFound
              title="No workspace found"
              description="Create a new workspace to get started"
              buttonText="Create Workspaced"
              buttonAction={() => setIsCreatingWorkspace(true)}
            />
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
const WorkspaceCard = ({ worksapce }: { worksapce: Workspace }) => {
  return (
    <Link to={`/workspaces/${worksapce._id}`}>
      <Card className="transition-all hover:shadow-md hover:-translate-y-1">
        <CardHeader className="pb-2 ">
          <div className="flex items-center justify-between ">
            <div className="flex gap-2">
              <WorkspaceAvatar name={worksapce.name} color={worksapce.color} />
              <div className="">
                <CardTitle>{worksapce.name}</CardTitle>
                <span className="text-sm text-muted-foreground">
                  Created at {format(worksapce.createdAt, "MMM d, yyyy h:mm a")}
                </span>
              </div>
            </div>

            <div className="flex items-center text-muted-foreground">
              <Users className="size-4 mr-1" />
              <span className="text-sm">{worksapce.members.length}</span>
            </div>
          </div>

          <CardDescription>
            {worksapce.description || "No description"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="text-sm text-muted-foreground">
            View workspace details and projects
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Workspaces;
