import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Workspace } from "@/types/indedx";
import type { LucideIcon } from "lucide-react";
import { Link, useLocation } from "react-router";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    title: string;
    href: string;
    icon: LucideIcon;
  }[];
  isCollapsed: boolean;
  currentWorkspace: Workspace | null;
}

const SidebarNav = ({
  items,
  isCollapsed,
  className,
  currentWorkspace,
  ...props
}: SidebarNavProps) => {
  const location = useLocation();

  return (
    <nav
      data-collapsed={isCollapsed}
      className={cn(
        "group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2",
        className,
      )}
      {...props}
    >
      <TooltipProvider delayDuration={0}>
        <div className="grid gap-1 px-2 group-data-[collapsed=true]:justify-center roup-data-[collapsed=true]:px-2">
          {items.map((item, index) => {
            const Icon = item.icon;

            // Generate Dynamic Link
            let finalHref = item.href;
            if (item.href === "/dashboard" && currentWorkspace) {
              finalHref = `${item.href}?workspaceId=${currentWorkspace._id}`;
            }

            // Check Active State (Supports nested routes)
            const isActive = location.pathname.startsWith(item.href);

            const linkContent = (
              <Link
                to={finalHref}
                className={cn(
                  buttonVariants({
                    variant: isActive ? "default" : "ghost",
                    size: "default",
                  }),
                  "h-9 w-full ",
                  isCollapsed ? "justify-center" : "justify-start",
                  isActive &&
                    "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
                  !isActive &&
                    "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                <Icon className={cn("size-4", !isCollapsed && "mr-2")} />
                {!isCollapsed && (
                  <span className="truncate hidden md:block">{item.title}</span>
                )}
              </Link>
            );

            if (isCollapsed) {
              return (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="flex items-center gap-4"
                  >
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return <div key={index}>{linkContent}</div>;
          })}
        </div>
      </TooltipProvider>
    </nav>
  );
};

export default SidebarNav;
