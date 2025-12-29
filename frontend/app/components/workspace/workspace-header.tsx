import type { User, Workspace } from "@/types/indedx";
import WorkspaceAvatar from "./workspace-avatar";
import { Button } from "../ui/button";
import { Plus, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ConfirmDialog } from "../confirm-dialog";
import { useNavigate, useParams } from "react-router";
import { useDeleteWorkspaceMutation } from "@/hooks/use-workspace";
import { toast } from "sonner";

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
            "Permission Denied: Only the owner can delete this workspace."
          );
        } else if (status === 404) {
          toast.error("Workspace not found or already deleted.");
        } else {
          toast.error(
            message || "Failed to delete workspace. Please try again."
          );
        }
      },
    });
  };
  return (
    <div className="space-y-8">
      <div className="space-y-3 ">
        <div className="flex  flex-col-reverse  md:flex-row md:justify-between md:items-center gap-3">
          <div className="flex md:items-center gap-3">
            {workspace.color && (
              <WorkspaceAvatar name={workspace.name} color={workspace.color} />
            )}

            <h2 className="text-xl md:text-2xl font-semibold">
              {workspace.name}
            </h2>
          </div>

          <div className="flex items-center flex-wrap md:items-start justify-between md:justify-start gap-1 md:gap-3 mb-4 md:mb-0">
            <Button variant="ghost" onClick={onInviteMember}>
              <UserPlus className="size-4" />
              Invite
            </Button>

            <Button onClick={onCreateProject}>
              <Plus className="size-4 mr-2" />
              Create Project
            </Button>
            <ConfirmDialog
              title="Delete Workspace?"
              description="This action usually cannot be undone. All projects and tasks will be lost."
              confirmText="Delete Workspace"
              onConfirm={handleDelete}
              isLoading={isPending}
            >
              <Button variant="destructive">Delete Workspace</Button>
            </ConfirmDialog>
          </div>
        </div>

        {workspace.description && (
          <p className="text-sm md:text-base text-muted-foreground">
            {workspace.description}
          </p>
        )}
      </div>

      {members.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Members</span>

          <div className="flex space-x-2">
            {members.map((member) => (
              <Avatar
                key={member._id}
                className="relative h-8 w-8 rounded-full border-2 border-background overflow-hidden"
                title={member.user.name}
              >
                <AvatarImage
                  className="object-cover"
                  src={member.user.profilePicture}
                  alt={member.user.name}
                />
                <AvatarFallback>{member.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceHeader;
