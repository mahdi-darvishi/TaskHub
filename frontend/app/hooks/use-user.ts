import { fetchData, updateData } from "@/lib/fetch-util";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// --- Types ---

export interface UpdateProfilePayload {
  name: string;
  profilePicture?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// --- Hooks ---

export const useUserProfile = () => {
  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: () => fetchData("/user/profile"),
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfilePayload) =>
      updateData("/user/profile", data),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["user", "profile"],
      });
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordPayload) =>
      updateData("/user/change-password", data),
  });
};
