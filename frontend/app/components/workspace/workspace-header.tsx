import type { User, Workspace } from "@/types/indedx";
import WorkspaceAvatar from "./workspace-avatar";
import { Button } from "../ui/button";
import { Plus, UserPlus, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ConfirmDialog } from "../confirm-dialog";
import { useNavigate, useParams } from "react-router";
import { useDeleteWorkspaceMutation } from "@/hooks/use-workspace";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface WorkspaceHeaderProps {
  workspace: Workspace;
  members: {
    _id: string;
    user: User;
    role: "admin" | "member" | "owner" | "viewer";
    joinedAt: Date;
  }[];

  onCreateProject: () => void;
  onInviteMember: () => void;
}

const WorkspaceHeader = ({
  workspace,
  members,
  onCreateProject,
  onInviteMember,
}: WorkspaceHeaderProps) => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const { mutate: deleteWorkspace, isPending } = useDeleteWorkspaceMutation();

  const handleDelete = () => {
    if (!workspaceId) return;

    deleteWorkspace(workspaceId, {
      onSuccess: () => {
        toast.success("Workspace deleted successfully");
        navigate(-1);
      },
      onError: (error: any) => {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        if (status === 403) {
          toast.error(
            "Permission Denied: Only the owner can delete this workspace.",
          );
        } else if (status === 404) {
          toast.error("Workspace not found or already deleted.");
        } else {
          toast.error(
            message || "Failed to delete workspace. Please try again.",
          );
        }
      },
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-4">
      {/* Top Section: Title & Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        {/* Left Side: Avatar & Info */}
        <div className="flex items-start gap-3 sm:gap-4 max-w-2xl">
          {workspace.color && (
            <div className="shrink-0">
              <WorkspaceAvatar
                name={workspace.name}
                color={workspace.color}
                // className="size-10 sm:size-14 text-sm sm:text-lg"
              />
            </div>
          )}

          <div className="space-y-1 sm:space-y-2">
            <h2 className="text-lg sm:text-2xl font-bold tracking-tight leading-tight">
              {workspace.name}
            </h2>
            {workspace.description && (
              <p className="text-sm text-muted-foreground line-clamp-3 sm:line-clamp-none leading-relaxed">
                {workspace.description}
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Actions Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto mt-2 md:mt-0">
          <Button
            variant="outline"
            onClick={onInviteMember}
            className="flex-1 sm:flex-none h-9 sm:h-10 text-xs sm:text-sm"
          >
            <UserPlus className="size-3.5 sm:size-4 mr-2" />
            Invite
          </Button>

          <Button
            onClick={onCreateProject}
            className="flex-1 sm:flex-none h-9 sm:h-10 text-xs sm:text-sm"
          >
            <Plus className="size-3.5 sm:size-4 mr-2" />
            New Project
          </Button>

          <ConfirmDialog
            title="Delete Workspace?"
            description="This action cannot be undone. All projects and tasks will be permanently lost."
            confirmText="Delete Workspace"
            onConfirm={handleDelete}
            isLoading={isPending}
            variant="destructive"
          >
            <Button
              variant="destructive"
              size="icon"
              className="h-9 w-9 sm:h-10 sm:w-10 shrink-0"
              title="Delete Workspace"
            >
              <Trash2 className="size-4" />
            </Button>
          </ConfirmDialog>
        </div>
      </div>

      {/* Bottom Section: Members List */}
      {members.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2 sm:pt-0">
          <span className="text-xs sm:text-sm font-medium text-muted-foreground">
            Team Members ({members.length})
          </span>

          <div className="flex -space-x-2 sm:-space-x-3 overflow-x-auto pb-2 sm:pb-0 px-1 scrollbar-hide">
            {members.map((member) => (
              <Avatar
                key={member._id}
                className="relative h-7 w-7 sm:h-9 sm:w-9 rounded-full border-2 border-background ring-1 ring-background transition-transform hover:z-10 hover:scale-110"
                title={member.user.name}
              >
                <AvatarImage
                  className="object-cover"
                  src={member.user.profilePicture}
                  alt={member.user.name}
                />
                <AvatarFallback className="text-[9px] sm:text-xs bg-muted">
                  {member.user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            ))}

            {/* دکمه افزودن عضو جدید به صورت دایره‌ای در انتهای لیست */}
            <button
              onClick={onInviteMember}
              className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/30 bg-muted/30 text-muted-foreground hover:bg-muted transition-colors ml-2 shrink-0"
              title="Add Member"
            >
              <Plus className="size-3 sm:size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceHeader;
