import { Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

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
  const { workspaceId, inviteCode } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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
          queryClient.invalidateQueries({ queryKey: ["workspaces"] });
          queryClient.invalidateQueries({
            queryKey: ["workspace", workspaceId],
          });
          navigate(`/dashboard?workspaceId=${data.workspaceId}`);
        },
        onError: (error: any) => {
          const message =
            error.response?.data?.message || "Failed to join workspace";

          if (message === "You are already a member") {
            navigate(`/dashboard?workspaceId=${workspaceId}`);
          } else {
            toast.error(message);
          }
        },
      },
    );
  };

  if (!workspaceId || !inviteCode) {
    return (
      <div className="flex h-screen items-center justify-center text-destructive p-4 text-center">
        Error: Missing invitation details.
      </div>
    );
  }

  return (
    // Responsive Container: min-h-screen handles content overflow better than h-screen
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
      <Card className="w-full max-w-md shadow-lg border-t-4 border-t-blue-500">
        <CardHeader className="text-center space-y-4 pb-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-2">
            <UserPlus className="h-7 w-7" />
          </div>
          <div>
            <CardTitle className="text-xl sm:text-2xl font-bold">
              Join Workspace
            </CardTitle>
            <CardDescription className="mt-2 text-sm sm:text-base">
              You've been invited to join a workspace on TaskHub.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="text-center space-y-4">
          <div className="text-sm text-muted-foreground">
            Please confirm that you want to accept this invitation.
          </div>
          <div className="rounded-lg bg-muted p-3 text-xs sm:text-sm font-mono text-muted-foreground break-all border">
            ID: {workspaceId}
          </div>
        </CardContent>

        <CardFooter className="pt-2 pb-6">
          <Button
            className="w-full text-base py-6"
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
