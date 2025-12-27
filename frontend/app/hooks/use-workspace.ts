import type { WorkspaceForm } from "@/components/workspace/create-workspace";
import { deleteData, fetchData, postData } from "@/lib/fetch-util";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateWorkspace = () => {
  return useMutation({
    mutationFn: async (data: WorkspaceForm) => postData("/workspaces", data),
  });
};

export const useGetWorkspacesQuery = () => {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => fetchData("/workspaces"),
  });
};

export const useGetWorkspaceQuery = (workspaceId: string) => {
  return useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: async () => fetchData(`/workspaces/${workspaceId}/projects`),
  });
};

export const useGetWorkspaceStatsQuery = (workspaceId: string) => {
  return useQuery({
    queryKey: ["workspace", workspaceId, "stats"],
    queryFn: async () => fetchData(`/workspaces/${workspaceId}/stats`),
  });
};

export const useGetWorkspaceDetailsQuery = (workspaceId: string) => {
  return useQuery({
    queryKey: ["workspace", workspaceId, "details"],
    queryFn: async () => fetchData(`/workspaces/${workspaceId}`),
  });
};

export const useInviteUserMutation = () => {
  return useMutation({
    mutationFn: ({
      workspaceId,
      email,
      role,
    }: {
      workspaceId: string;
      email: string;
      role: string;
    }) => postData(`/workspaces/${workspaceId}/invite`, { email, role }),
  });
};

export const useJoinWorkspaceMutation = () => {
  return useMutation({
    mutationFn: ({
      workspaceId,
      inviteCode,
    }: {
      workspaceId: string;
      inviteCode: string;
    }) => postData(`/workspaces/join`, { workspaceId, inviteCode }),
  });
};
export const useDeleteWorkspaceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workspaceId: string) =>
      deleteData(`/workspaces/${workspaceId}`),

    onSuccess: (_data, workspaceId) => {
      queryClient.invalidateQueries({
        queryKey: ["workspaces"],
      });
      queryClient.removeQueries({
        queryKey: ["workspace", workspaceId],
      });
    },
  });
};
