import { cn } from "@/lib/utils";
import type { Workspace } from "@/types/indedx";
import type { LucideIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useLocation, useNavigate } from "react-router";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    title: string;
    href: string;
    icon: LucideIcon;
  }[];
  isCollapsed: boolean;
  currentWorkspace: Workspace | null;
  className?: string;
}

const SidebarNav = ({
  items,
  isCollapsed,
  className,
  currentWorkspace,
  ...props
}: SidebarNavProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className={cn("flex flex-col gap-y-2", className)} {...props}>
      {items.map((item) => {
        const Icon = item.icon;

        const isActive = location.pathname === item.href;

        const handleOnClick = () => {
          if (item.href === "/dashboard" && currentWorkspace) {
            navigate(`${item.href}?workspaceId=${currentWorkspace._id}`);
            return;
          } else {
            navigate(item.href);
          }
        };

        return (
          <Button
            key={item.title}
            variant={isActive ? "outline" : "ghost"}
            className={cn(
              "justify-start",
              isActive && "bg-blue-800/20 text-blue-600 font-medium"
            )}
            onClick={handleOnClick}
          >
            <Icon className="mr-2 size-4" />
            {isCollapsed ? (
              <span className="sr-only">{item.title}</span>
            ) : (
              item.title
            )}
          </Button>
        );
      })}
    </nav>
  );
};

export default SidebarNav;
