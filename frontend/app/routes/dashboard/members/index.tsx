import { format, formatDistanceToNow } from "date-fns";
import {
  Mail,
  Search,
  Shield,
  ShieldAlert,
  User as UserIcon,
  UserPlus,
  Crown,
  CalendarDays,
} from "lucide-react";
import { useEffect, useState } from "react";

// UI Components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Hooks & Context
import { useGetWorkspaceDetailsQuery } from "@/hooks/use-workspace";
import { useAuth } from "@/provider/auth-context";
import { useWorkspace } from "@/provider/workspace-provider";

// Components
import Loader from "@/components/loader";
import { InviteMemberDialog } from "@/components/workspace/invite-member-dialog";
import type { MetaFunction } from "react-router";
import { cn } from "@/lib/utils";

export const meta: MetaFunction = () => {
  return [{ title: "TaskHub - Team Members" }];
};

// Types
interface Member {
  _id: string;
  role: string;
  joinedAt: string;
  user: {
    _id: string;
    name: string;
    email: string;
    profilePicture: string;
  };
}

interface WorkspaceData {
  _id: string;
  name: string;
  inviteCode?: string;
  members: Member[];
}

export default function MembersPage() {
  const { activeWorkspace } = useWorkspace();
  const workspaceId = activeWorkspace?._id || "";
  const { user: currentUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const {
    data: workspaceData,
    isLoading,
    isFetching,
    refetch,
  } = useGetWorkspaceDetailsQuery(workspaceId);

  useEffect(() => {
    if (workspaceId) {
      setSearchQuery("");
      refetch();
    }
  }, [workspaceId, refetch]);

  const workspace = workspaceData as WorkspaceData;
  const isDataStale = workspace && workspace._id !== workspaceId;
  const showLoading = isLoading || isFetching || isDataStale;

  const members = workspace?.members || [];
  const inviteCode = workspace?.inviteCode || "";

  const filteredMembers = members.filter(
    (m) =>
      m.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // --- Helper Functions ---
  const getRoleBadgeStyles = (role: string) => {
    switch (role?.toUpperCase()) {
      case "OWNER":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800";
      case "ADMIN":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      default: // MEMBER
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role?.toUpperCase()) {
      case "OWNER":
        return <Crown className="size-3 mr-1" />;
      case "ADMIN":
        return <Shield className="size-3 mr-1" />;
      default:
        return <UserIcon className="size-3 mr-1" />;
    }
  };

  // --- Render Conditions ---
  if (!workspaceId) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-muted-foreground animate-in fade-in">
        <div className="bg-muted/50 p-4 rounded-full mb-4">
          <ShieldAlert className="size-10 opacity-50" />
        </div>
        <p className="font-medium text-lg">No Workspace Selected</p>
        <p className="text-sm">Please select a workspace to view members.</p>
      </div>
    );
  }

  if (showLoading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col h-full p-4 sm:p-6 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* --- Header Section --- */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            Team Members
            <Badge
              variant="outline"
              className="ml-2 font-normal text-muted-foreground"
            >
              {members.length}
            </Badge>
          </h1>
          <p className="text-muted-foreground text-sm mt-1 truncate max-w-[300px] sm:max-w-md">
            Manage access to{" "}
            <span className="font-semibold text-foreground">
              {workspace?.name}
            </span>
          </p>
        </div>

        <Button
          className="w-full sm:w-auto gap-2 shadow-sm"
          onClick={() => setIsInviteOpen(true)}
        >
          <UserPlus className="size-4" />
          Invite Member
        </Button>
      </div>

      <Separator className="shrink-0" />

      {/* --- Search Section --- */}
      <div className="shrink-0">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            className="pl-9 bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* --- Members List --- */}
      <div className="flex-1 min-h-0 border rounded-xl bg-card shadow-sm overflow-hidden flex flex-col">
        {/* Table Header (Visible on Desktop) */}
        <div className="grid grid-cols-12 gap-4 p-4 text-xs font-semibold text-muted-foreground border-b bg-muted/40 uppercase tracking-wider shrink-0">
          <div className="col-span-8 sm:col-span-5">User</div>
          <div className="col-span-4 sm:col-span-3 text-right sm:text-left">
            Role
          </div>
          <div className="col-span-4 hidden sm:block text-right">Joined</div>
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1">
          {filteredMembers.length > 0 ? (
            <div className="divide-y divide-border/50">
              {filteredMembers.map((member) => (
                <div
                  key={member._id}
                  className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/30 transition-colors group"
                >
                  {/* User Info Column */}
                  <div className="col-span-8 sm:col-span-5 flex items-center gap-3 overflow-hidden">
                    <Avatar className="size-9 sm:size-10 border shadow-sm shrink-0">
                      <AvatarImage
                        src={member.user?.profilePicture}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-primary/5 text-primary font-medium text-xs">
                        {member.user?.name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col min-w-0 gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate text-foreground">
                          {member.user?.name}
                        </span>
                        {currentUser?._id === member.user?._id && (
                          <Badge
                            variant="secondary"
                            className="text-[10px] h-4 px-1.5 rounded-sm shrink-0 font-normal"
                          >
                            You
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground truncate flex items-center gap-1.5">
                        <Mail className="size-3 shrink-0 opacity-70" />
                        <span className="truncate">{member.user?.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Role Column */}
                  <div className="col-span-4 sm:col-span-3 flex justify-end sm:justify-start">
                    <div
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium border shadow-sm",
                        getRoleBadgeStyles(member.role),
                      )}
                    >
                      {getRoleIcon(member.role)}
                      {member.role}
                    </div>
                  </div>

                  {/* Joined Date Column (Desktop Only) */}
                  <div className="col-span-4 hidden sm:flex flex-col items-end gap-0.5 text-right">
                    {member.joinedAt ? (
                      <>
                        <span className="text-sm text-foreground/80 flex items-center gap-1.5">
                          <CalendarDays className="size-3.5 text-muted-foreground/70" />
                          {format(new Date(member.joinedAt), "MMM dd, yyyy")}
                        </span>
                        <span className="text-[10px] text-muted-foreground capitalize">
                          {formatDistanceToNow(new Date(member.joinedAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center h-full">
              <div className="bg-muted/50 p-4 rounded-full mb-3">
                <Search className="size-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-medium text-foreground">
                No members found
              </h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                We couldn't find any member matching "{searchQuery}"
              </p>
              <Button
                variant="link"
                onClick={() => setSearchQuery("")}
                className="mt-2 text-primary"
              >
                Clear Search
              </Button>
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Invite Modal */}
      <InviteMemberDialog
        isOpen={isInviteOpen}
        onOpenChange={setIsInviteOpen}
        workspaceId={workspaceId}
        inviteCode={inviteCode}
      />
    </div>
  );
}
