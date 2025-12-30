import { useAuth } from "@/provider/auth-context";
import { useTheme } from "@/provider/theme-provider";
import { useWorkspace } from "@/provider/workspace-provider";
import type { Workspace } from "@/types/indedx";
import {
  Check,
  Laptop,
  LogOut,
  Moon,
  Palette,
  PlusCircle,
  Sun,
  User as UserIcon,
} from "lucide-react";
import { useEffect } from "react";
import { Link, useLoaderData, useNavigate } from "react-router";
import { NotificationList } from "../notification-list";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import WorkspaceAvatar from "../workspace/workspace-avatar";

interface HeaderProps {
  onCreateWorkspace: () => void;
}

export const Header = ({ onCreateWorkspace }: HeaderProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { setTheme, theme } = useTheme();

  const { workspaces } = useLoaderData() as { workspaces: Workspace[] };

  const { activeWorkspace, setActiveWorkspace } = useWorkspace();

  const handleOnClick = (workspace: Workspace) => {
    setActiveWorkspace(workspace);
  };

  useEffect(() => {
    if (workspaces.length === 0) {
      if (activeWorkspace !== null) {
        setActiveWorkspace(null as any);
      }
      return;
    }

    if (activeWorkspace) {
      const isCurrentWorkspaceValid = workspaces.find(
        (w) => w._id === activeWorkspace._id
      );

      if (!isCurrentWorkspaceValid) {
        setActiveWorkspace(workspaces[0]);
      } else {
        if (
          isCurrentWorkspaceValid.name !== activeWorkspace.name ||
          isCurrentWorkspaceValid.color !== activeWorkspace.color
        ) {
          setActiveWorkspace(isCurrentWorkspaceValid);
        }
      }
    } else {
      if (workspaces.length > 0) {
        setActiveWorkspace(workspaces[0]);
      }
    }
  }, [workspaces, activeWorkspace, setActiveWorkspace]);

  return (
    <div className="bg-background sticky top-0 z-40 border-b">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"}>
              {activeWorkspace ? (
                <>
                  {activeWorkspace.color && (
                    <WorkspaceAvatar
                      color={activeWorkspace.color}
                      name={activeWorkspace.name}
                    />
                  )}
                  <span className="font-medium">{activeWorkspace?.name}</span>
                </>
              ) : (
                <span className="font-medium">Select Workspace</span>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuLabel>Workspace</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              {workspaces.length > 0 ? (
                workspaces.map((ws) => (
                  <DropdownMenuItem
                    key={ws._id}
                    onClick={() => handleOnClick(ws)}
                  >
                    {ws.color && (
                      <WorkspaceAvatar color={ws.color} name={ws.name} />
                    )}
                    <span className="ml-2">{ws.name}</span>
                    {activeWorkspace?._id === ws._id && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="p-2 text-sm text-muted-foreground text-center">
                  No workspaces found
                </div>
              )}
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem onClick={onCreateWorkspace}>
                <PlusCircle className="w-4 h-4 mr-2" />
                Create Workspace
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-2">
          <NotificationList />

          <DropdownMenu>
            <DropdownMenuTrigger asChild className="cursor-pointer">
              <button className="rounded-full border p-0.5 w-9 h-9 transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                <Avatar className="w-full h-full">
                  <AvatarImage
                    className="object-cover"
                    src={user?.profilePicture}
                    alt={user?.name}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                    {user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground truncate">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link to="/user/profile" className="cursor-pointer w-full">
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="cursor-pointer">
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="ml-2">Theme</span>
                </DropdownMenuSubTrigger>

                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem
                      onClick={() => setTheme("light")}
                      className="cursor-pointer"
                    >
                      <Sun className="mr-2 h-4 w-4" />
                      <span>Light</span>
                      {theme === "light" && (
                        <Check className="ml-auto h-4 w-4" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setTheme("dark")}
                      className="cursor-pointer"
                    >
                      <Moon className="mr-2 h-4 w-4" />
                      <span>Dark</span>
                      {theme === "dark" && (
                        <Check className="ml-auto h-4 w-4" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setTheme("system")}
                      className="cursor-pointer"
                    >
                      <Laptop className="mr-2 h-4 w-4" />
                      <span>System</span>
                      {theme === "system" && (
                        <Check className="ml-auto h-4 w-4" />
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>

              <DropdownMenuItem asChild>
                <Link to="/settings" className="cursor-pointer w-full">
                  <Palette className="mr-2 h-4 w-4" />
                  <span>Appearance & Color</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={logout}
                className="text-red-600 focus:text-red-600 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
