import { useAuth } from "@/provider/auth-context";
import { cn } from "@/lib/utils";
import type { Workspace } from "@/types/indedx";
import {
  CheckCircle2,
  ChevronsLeft,
  ChevronsRight,
  LayoutDashboard,
  ListCheck,
  LogOut,
  Settings,
  Users,
  Wrench,
  Archive,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import SidebarNav from "./sidebar-nav";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

// آیتم‌های منو را بیرون تعریف می‌کنیم تا تمیزتر شود
const NAV_ITEMS = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Workspaces",
    href: "/workspaces",
    icon: Users,
  },
  {
    title: "My Tasks",
    href: "/my-tasks",
    icon: ListCheck,
  },
  {
    title: "Members",
    href: `/members`,
    icon: Users,
  },
  {
    title: "Archived",
    href: `/achieved`,
    icon: Archive,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

const SidebarComponent = ({
  currentWorkspace,
}: {
  currentWorkspace: Workspace | null;
}) => {
  const { logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "sticky top-0 left-0 z-50 h-screen flex flex-col border-r bg-card transition-all duration-300 ease-in-out",
          isCollapsed ? " w-14 md:w-[70px]" : "w-[70px] md:w-64",
        )}
      >
        {/* --- Header / Logo --- */}
        <div
          className={cn(
            "flex h-14 items-center border-b px-3 shrink-0",
            isCollapsed ? "justify-center" : "justify-between",
          )}
        >
          <Link
            to="/dashboard"
            className={cn(
              "flex items-center gap-2 font-semibold transition-all hover:opacity-80",
              isCollapsed ? "size-10 justify-center" : "px-2",
            )}
          >
            <div className="flex items-center justify-center rounded-md bg-primary/10 p-1.5 text-primary">
              <Wrench className="size-5" />
            </div>
            {!isCollapsed && (
              <span className="truncate text-lg tracking-tight hidden md:block">
                TaskHub
              </span>
            )}
          </Link>

          {/* Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronsRight className="size-4" />
            ) : (
              <ChevronsLeft className="size-4" />
            )}
          </Button>
        </div>

        {/* --- Navigation Links --- */}
        <ScrollArea className="flex-1 py-4">
          <SidebarNav
            items={NAV_ITEMS}
            isCollapsed={isCollapsed}
            currentWorkspace={currentWorkspace}
          />
        </ScrollArea>

        {/* --- Footer / Logout --- */}
        <div className="border-t p-3 mt-auto shrink-0">
          {isCollapsed ? (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  className="h-9 w-full justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="size-4" />
                  <span className="sr-only">Logout</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Logout</TooltipContent>
            </Tooltip>
          ) : (
            <Button
              variant="ghost"
              onClick={logout}
              className={cn(
                "w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10",
                !isCollapsed && "px-2",
              )}
            >
              <LogOut className="size-4 mr-2" />
              <span className="hidden md:block">Logout</span>
            </Button>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
};

export default SidebarComponent;
