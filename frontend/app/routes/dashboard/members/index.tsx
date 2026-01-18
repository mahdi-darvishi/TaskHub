import { format, formatDistanceToNow } from "date-fns";
import {
  Mail,
  Search,
  Shield,
  ShieldAlert,
  User as UserIcon,
  UserPlus,
  Crown,
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
  // Check if data is stale (from previous workspace)
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
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "OWNER":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800";
      case "ADMIN":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
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
      <div className="flex flex-col items-center justify-center h-[500px] text-muted-foreground animate-in fade-in">
        <ShieldAlert className="size-10 mb-4 opacity-20" />
        <p className="font-medium">No Workspace Selected</p>
      </div>
    );
  }

  if (showLoading) {
    return <Loader />;
  }

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-300 h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team Members</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage who has access to{" "}
            <span className="font-semibold text-foreground">
              {workspace?.name}
            </span>
            .
          </p>
        </div>
        <Button
          className="gap-2 shrink-0"
          onClick={() => setIsInviteOpen(true)}
        >
          <UserPlus className="size-4" />
          Invite Member
        </Button>
      </div>

      <Separator />

      {/* Search & Stats */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            className="pl-9 bg-background/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="text-sm text-muted-foreground hidden sm:block whitespace-nowrap">
          Total Members:{" "}
          <span className="font-medium text-foreground">{members.length}</span>
        </div>
      </div>

      {/* Members List */}
      <div className="border rounded-xl bg-card shadow-sm overflow-hidden flex flex-col">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 text-xs font-medium text-muted-foreground border-b bg-muted/40 uppercase tracking-wider">
          <div className="col-span-8 sm:col-span-6">User</div>
          <div className="col-span-4 sm:col-span-3 text-right sm:text-left">
            Role
          </div>
          <div className="col-span-3 text-right hidden sm:block">Joined</div>
        </div>

        <ScrollArea className="h-[calc(100vh-320px)] min-h-[400px]">
          {filteredMembers.length > 0 ? (
            <div className="divide-y divide-border/50">
              {filteredMembers.map((member) => (
                <div
                  key={member._id}
                  className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/30 transition-colors group"
                >
                  {/* User Info */}
                  <div className="col-span-8 sm:col-span-6 flex items-center gap-3 overflow-hidden">
                    <Avatar className="size-8 sm:size-10 border shadow-sm shrink-0">
                      <AvatarImage
                        src={member.user?.profilePicture}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs">
                        {member.user?.name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <p className=" text-xs md:text-sm font-medium truncate text-foreground">
                          {member.user?.name}
                        </p>
                        {currentUser?._id === member.user?._id && (
                          <Badge
                            variant="secondary"
                            className="text-[10px] h-4 px-1 rounded-sm shrink-0 bg-primary/10 text-primary hover:bg-primary/20"
                          >
                            You
                          </Badge>
                        )}
                      </div>
                      <p className=" text-[10px] md:text-xs text-muted-foreground truncate flex items-center gap-1.5 mt-0.5">
                        <Mail className="size-3 shrink-0 opacity-70" />
                        {member.user?.email}
                      </p>
                    </div>
                  </div>

                  {/* Role */}
                  <div className="col-span-4 sm:col-span-3 flex justify-end sm:justify-start">
                    <Badge
                      variant="outline"
                      className={`font-medium py-0.5  px-1 md:px-2.5  rounded-full text-[9px] md:text-xs transition-colors ${getRoleBadgeColor(
                        member.role,
                      )}`}
                    >
                      {getRoleIcon(member.role)}
                      {member.role}
                    </Badge>
                  </div>

                  {/* Joined Date */}
                  <div className="col-span-3 hidden sm:flex flex-col items-end gap-0.5">
                    {member.joinedAt ? (
                      <>
                        <span className="text-sm font-medium text-foreground/80">
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
            <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground h-full">
              <div className="bg-muted/50 p-4 rounded-full mb-3 ring-1 ring-border">
                <Search className="size-6 opacity-40" />
              </div>
              <p className="text-sm font-medium text-foreground">
                No members found
              </p>
              <p className="text-xs mt-1">
                We couldn't find any member matching "{searchQuery}"
              </p>
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
