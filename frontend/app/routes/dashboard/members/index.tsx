import { useEffect, useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import {
  Loader2,
  Mail,
  Search,
  Shield,
  ShieldAlert,
  User as UserIcon,
  UserPlus,
} from "lucide-react";

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
import { InviteMemberDialog } from "@/components/workspace/invite-member-dialog";

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
      m.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
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
        return <ShieldAlert className="size-3 mr-1" />;
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
    return (
      <div className="flex items-center justify-center h-full min-h-[500px]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground">Loading members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
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
        <Button className="gap-2" onClick={() => setIsInviteOpen(true)}>
          <UserPlus className="size-4" />
          Invite Member
        </Button>
      </div>

      <Separator />

      {/* Search & Stats */}
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="text-sm text-muted-foreground hidden sm:block">
          Total Members:{" "}
          <span className="font-medium text-foreground">{members.length}</span>
        </div>
      </div>

      {/* List */}
      <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 text-xs font-medium text-muted-foreground border-b bg-muted/40">
          <div className="col-span-6">User</div>
          <div className="col-span-3">Role</div>
          <div className="col-span-3 text-right sm:text-left">Joined</div>
        </div>

        <ScrollArea className="h-[500px]">
          {filteredMembers.length > 0 ? (
            <div className="divide-y">
              {filteredMembers.map((member) => (
                <div
                  key={member._id}
                  className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-accent/30 transition-colors"
                >
                  {/* User Info */}
                  <div className="col-span-6 flex items-center gap-3">
                    <Avatar className="size-9 border">
                      <AvatarImage
                        src={member.user?.profilePicture}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {member.user?.name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium truncate flex items-center gap-2">
                        {member.user?.name}
                        {currentUser?._id === member.user?._id && (
                          <Badge
                            variant="secondary"
                            className="text-[10px] h-4 px-1 rounded-sm"
                          >
                            You
                          </Badge>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                        <Mail className="size-3" />
                        {member.user?.email}
                      </p>
                    </div>
                  </div>

                  {/* Role */}
                  <div className="col-span-3">
                    <Badge
                      variant="outline"
                      className={`font-medium py-1 px-2 rounded-md ${getRoleBadgeColor(
                        member.role
                      )}`}
                    >
                      {getRoleIcon(member.role)}
                      {member.role}
                    </Badge>
                  </div>

                  {/* Joined Date */}
                  <div className="col-span-3 flex flex-col items-end sm:items-start gap-0.5">
                    {member.joinedAt ? (
                      <>
                        <span className="text-sm font-medium text-foreground/80">
                          {format(new Date(member.joinedAt), "MMM dd, yyyy")}
                        </span>
                        <span className="text-[11px] text-muted-foreground capitalize">
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
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
              <div className="bg-muted/50 p-4 rounded-full mb-3">
                <Search className="size-6 opacity-40" />
              </div>
              <p className="text-sm">
                No members found matching "{searchQuery}"
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
