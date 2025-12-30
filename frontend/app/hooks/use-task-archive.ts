import { deleteData, fetchData, postData } from "@/lib/fetch-util";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// --- Types ---
interface ArchiveFilters {
  projectId?: string;
  status?: string;
  sort?: string;
  search?: string;
}

interface DeleteTaskParams {
  workspaceId: string;
  projectId: string;
  taskId: string;
}

export const useGetArchivedTasks = (
  workspaceId: string,
  filters: ArchiveFilters
) => {
  return useQuery({
    queryKey: ["archived-tasks", workspaceId, filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.projectId && filters.projectId !== "all") {
        params.append("projectId", filters.projectId);
      }
      if (filters.status && filters.status !== "all") {
        params.append("status", filters.status);
      }
      if (filters.sort) {
        params.append("sort", filters.sort);
      }
      if (filters.search) {
        params.append("search", filters.search);
      }

      const url = `/tasks/workspaces/${workspaceId}/archived-tasks?${params.toString()}`;

      return await fetchData(url);
    },
    enabled: !!workspaceId,
  });
};

export const useRestoreTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      return await postData(`/tasks/${taskId}/achieved`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["archived-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["workspace-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["my-tasks"] });
    },
  });
};

export const useDeleteTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      workspaceId,
      projectId,
      taskId,
    }: DeleteTaskParams) => {
      const url = `/tasks/${workspaceId}/projects/${projectId}/tasks/${taskId}`;
      return await deleteData(url);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["archived-tasks"] });
    },
  });
};
