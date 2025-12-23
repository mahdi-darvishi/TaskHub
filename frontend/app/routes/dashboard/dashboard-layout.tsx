import { Header } from "@/components/layout/header";
import SidebarComponenet from "@/components/layout/sidebar-componenet";
import Loader from "@/components/loader";
import { CreateWorkspace } from "@/components/workspace/create-workspace";
import { fetchData } from "@/lib/fetch-util";
import { useAuth } from "@/provider/auth-context";
import type { Workspace } from "@/types/indedx";
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLoaderData } from "react-router";

export const HydrateFallback = () => <Loader />;

export const clientLoader = async () => {
  try {
    const data = await fetchData<{ workspaces: Workspace[] }>("/workspaces");
    return data;
  } catch (error) {
    return { workspaces: [] };
  }
};

const DashboardLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();

  const loaderData = useLoaderData() as any;
  const workspaces = loaderData?.workspaces || [];

  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(
    null
  );

  useEffect(() => {
    if (
      Array.isArray(workspaces) &&
      workspaces.length > 0 &&
      !currentWorkspace
    ) {
      setCurrentWorkspace(workspaces[0]);
    }
  }, [workspaces, currentWorkspace]);

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" />;
  }

  const handleWorkspaceSelected = (workspace: Workspace) => {
    setCurrentWorkspace(workspace);
  };

  return (
    <div className="flex h-screen w-full">
      <SidebarComponenet currentWorkspace={currentWorkspace} />

      <div className="flex flex-1 flex-col h-full">
        <Header
          workspaces={Array.isArray(workspaces) ? workspaces : []}
          onWorkspaceSelected={handleWorkspaceSelected}
          selectedWorkspace={currentWorkspace}
          onCreateWorkspace={() => setIsCreatingWorkspace(true)}
        />

        <main className="flex-1 overflow-y-auto h-full w-full">
          <div className="mx-auto container px-2 sm:px-6 lg:px-8 py-0 md:py-8 w-full h-full">
            <Outlet context={{ currentWorkspace }} />
          </div>
        </main>
      </div>

      <CreateWorkspace
        isCreatingWorkspace={isCreatingWorkspace}
        setIsCreatingWorkspace={setIsCreatingWorkspace}
      />
    </div>
  );
};

export default DashboardLayout;
