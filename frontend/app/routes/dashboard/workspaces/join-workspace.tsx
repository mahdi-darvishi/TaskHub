import { Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useJoinWorkspaceMutation } from "@/hooks/use-workspace";
import { useNavigate, useParams } from "react-router";

const JoinWorkspace = () => {
  // 1. Get params from URL
  const { workspaceId, inviteCode } = useParams();
  const navigate = useNavigate();

  // 2. Join Mutation
  const { mutate: joinWorkspace, isPending } = useJoinWorkspaceMutation();

  const handleJoin = () => {
    if (!workspaceId || !inviteCode) {
      toast.error("Invalid invitation link");
      return;
    }

    joinWorkspace(
      { workspaceId, inviteCode },
      {
        onSuccess: (data: any) => {
          toast.success("Successfully joined the workspace!");
          // Redirect to the workspace dashboard
          navigate(`/workspaces/${data.workspaceId}`);
        },
        onError: (error: any) => {
          toast.error(
            error.response?.data?.message || "Failed to join workspace"
          );
          // If already member, redirect anyway (optional)
          if (error.response?.data?.message === "You are already a member") {
            navigate(`/workspaces/${workspaceId}`);
          }
        },
      }
    );
  };

  if (!workspaceId || !inviteCode) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        Error: Missing invitation details.
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <UserPlus className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-2xl">Join Workspace</CardTitle>
            <CardDescription className="mt-2 text-base">
              You've been invited to join a workspace on TaskHub.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="text-center">
          <div className="rounded-md bg-muted p-3 text-sm font-mono text-muted-foreground break-all">
            Workspace ID: {workspaceId}
          </div>
        </CardContent>

        <CardFooter>
          <Button
            className="w-full"
            size="lg"
            onClick={handleJoin}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Joining...
              </>
            ) : (
              "Accept Invite & Join"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default JoinWorkspace;
