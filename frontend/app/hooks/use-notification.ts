import { fetchData, updateData } from "@/lib/fetch-util";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// 1. تعریف تایپ‌های مورد نیاز (می‌تونی اینا رو تو فایل types هم ببری)
export interface NotificationType {
  _id: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  sender: {
    name: string;
    profilePicture: string;
  };
  relatedId?: string;
  relatedModel?: "Task" | "Project" | "Comment";
}

// تایپ خروجی API
interface NotificationsResponse {
  notifications: NotificationType[];
  unreadCount: number;
}

export const useGetNotificationsQuery = () => {
  // ✅ اینجا <NotificationsResponse> را اضافه کن تا تایپ‌اسکریپت بفهمه دیتا چیه
  return useQuery<NotificationsResponse>({
    queryKey: ["notifications"],
    queryFn: () => fetchData("/notifications"),
    refetchInterval: 60000,
  });
};

export const useMarkNotificationAsReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => updateData(`/notifications/${id}/read`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export const useMarkAllNotificationsAsReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => updateData(`/notifications/all/read`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
