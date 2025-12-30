import { useOutletContext } from "react-router";
import type { Workspace } from "@/types/indedx";

type DashboardContextType = {
  currentWorkspace: Workspace | null;
};

export const useDashboardContext = () => {
  return useOutletContext<DashboardContextType>();
};
