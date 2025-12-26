import { Header } from "@/components/layout/header";
import SidebarComponenet from "@/components/layout/sidebar-componenet";
import { CreateWorkspace } from "@/components/workspace/create-workspace";
import { fetchData } from "@/lib/fetch-util";
import { useAuth } from "@/provider/auth-context";
import type { Workspace } from "@/types/indedx";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Navigate,
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router";

export const clientLoader = async () => {
  try {
    const [workspaces] = await Promise.all([fetchData("/workspaces")]);
    return { workspaces };
  } catch (error) {
    console.log(error);
    return { workspaces: [] };
  }
};

const DashboardLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { workspaces } = useLoaderData() as { workspaces: Workspace[] };
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(
    null
  );

  useEffect(() => {
    if (workspaces.length === 0) return;

    const workspaceIdFromUrl = searchParams.get("workspaceId");

    if (workspaceIdFromUrl) {
      const found = workspaces.find((w) => w._id === workspaceIdFromUrl);
      if (found && found._id !== currentWorkspace?._id) {
        setCurrentWorkspace(found);
      }
    } else if (!workspaceIdFromUrl && workspaces.length > 0) {
      const defaultWorkspace = workspaces[0];
      setCurrentWorkspace(defaultWorkspace);

      if (location.pathname === "/" || location.pathname === "/dashboard") {
        navigate(`${location.pathname}?workspaceId=${defaultWorkspace._id}`, {
          replace: true,
        });
      }
    }
  }, [workspaces, searchParams, currentWorkspace, navigate, location.pathname]);

  if (isLoading) return <Loader />;
  if (!isAuthenticated) return <Navigate to="/sign-in" />;

  const handleWorkspaceSelected = (workspace: Workspace) => {
    setCurrentWorkspace(workspace);
    navigate(`/dashboard?workspaceId=${workspace._id}`);
  };

  return (
    <div className="flex w-full min-h-screen bg-background">
      <SidebarComponenet currentWorkspace={currentWorkspace} />

      <div className="flex flex-1 flex-col min-w-0">
        <Header
          onWorkspaceSelected={handleWorkspaceSelected}
          selectedWorkspace={currentWorkspace}
          onCreateWorkspace={() => setIsCreatingWorkspace(true)}
        />

        <main className="flex-1 w-full">
          <div className="mx-auto container px-2 sm:px-6 lg:px-8 py-8">
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
