import type { Workspace } from "@/types/indedx";
import { createContext, useContext, useState, type ReactNode } from "react";

interface WorkspaceContextType {
  activeWorkspace: Workspace | null;
  setActiveWorkspace: (workspace: Workspace | null) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined
);

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const [activeWorkspace, setActiveWorkspaceState] = useState<Workspace | null>(
    () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("activeWorkspace");
        try {
          return saved ? JSON.parse(saved) : null;
        } catch {
          return null;
        }
      }
      return null;
    }
  );

  const setActiveWorkspace = (workspace: Workspace | null) => {
    setActiveWorkspaceState(workspace);
    if (workspace) {
      localStorage.setItem("activeWorkspace", JSON.stringify(workspace));
    } else {
      localStorage.removeItem("activeWorkspace");
    }
  };

  return (
    <WorkspaceContext.Provider value={{ activeWorkspace, setActiveWorkspace }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
};
