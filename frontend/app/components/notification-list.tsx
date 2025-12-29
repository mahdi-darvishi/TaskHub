import { formatDistanceToNow } from "date-fns";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

// Shadcn UI Components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

// Hooks
import {
  useGetNotificationsQuery,
  useMarkAllNotificationsAsReadMutation,
  useMarkNotificationAsReadMutation,
} from "@/hooks/use-notification";
import { useSocket } from "@/provider/socket-context";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface NotificationType {
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

  workspaceId?: string;
  projectId?: string;
}

export const NotificationList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  // Fetch Data
  const { data, isLoading } = useGetNotificationsQuery();
  const notifications = (data?.notifications as NotificationType[]) || [];
  const unreadCount = data?.unreadCount || 0;

  // Mutations
  const { mutate: markAsRead } = useMarkNotificationAsReadMutation();
  const { mutate: markAllAsRead, isPending: isMarkingAll } =
    useMarkAllNotificationsAsReadMutation();

  // 🔥 1. گوش دادن به ایونت‌های سوکت
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (newNotification: NotificationType) => {
      // الف) پخش صدای نوتیفیکیشن (اختیاری)
      // const audio = new Audio("/notification-sound.mp3");
      // audio.play().catch(e => console.log(e));

      // ب) نمایش پیام پاپ‌آپ (Toast)
      toast.info(newNotification.message, {
        description: `By ${newNotification.sender?.name || "Someone"}`,
        action: {
          label: "View",
          onClick: () => handleNotificationClick(newNotification),
        },
      });

      // ج) آپدیت کردن لیست نوتیفیکیشن‌ها (رفرش کردن کوئری)
      // این باعث میشه عدد قرمز و لیست اتوماتیک آپدیت بشه
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    };

    socket.on("newNotification", handleNewNotification);

    // تمیزکاری (خیلی مهم: جلوگیری از تکرار شدن ایونت‌ها)
    return () => {
      socket.off("newNotification", handleNewNotification);
    };
  }, [socket, queryClient]);

  // --- Handlers ---

  const handleNotificationClick = (notification: NotificationType) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
    setIsOpen(false);

    if (!notification.relatedId) return;

    if (notification.relatedModel === "Task") {
      if (notification.workspaceId && notification.projectId) {
        navigate(
          `/workspaces/${notification.workspaceId}/projects/${notification.projectId}/tasks/${notification.relatedId}`
        );
      }
    } else if (notification.relatedModel === "Project") {
      if (notification.workspaceId) {
        navigate(
          `/workspaces/${notification.workspaceId}/projects/${notification.relatedId}`
        );
      }
    }
  };

  const getIconByType = (type: string) => {
    switch (type) {
      case "TASK_ASSIGNED":
        return "📝";
      case "TASK_STATUS_CHANGED":
        return "🔄";
      case "COMMENT_MENTION":
        return "💬";
      case "PROJECT_INVITE":
        return "👋";
      case "TASK_UPDATED":
        return "⚠️";
      default:
        return "🔔";
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 size-2.5 bg-red-500 rounded-full border-2 border-background animate-pulse" />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0 mr-4" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-semibold text-sm">Notifications</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto px-2 text-xs text-blue-500 hover:text-blue-600"
              onClick={() => markAllAsRead()}
              disabled={isMarkingAll}
            >
              Mark all as read
            </Button>
          )}
        </div>

        <ScrollArea className="h-[300px]">
          {isLoading ? (
            <div className="p-4 text-center text-xs text-muted-foreground">
              Loading...
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <Bell className="size-8 mb-2 opacity-20" />
              <p className="text-xs">No notifications yet</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <button
                  key={notification._id}
                  className={`flex items-start gap-3 p-3 text-left transition-colors hover:bg-accent/50 border-b last:border-0 ${
                    !notification.isRead
                      ? "bg-blue-50/50 dark:bg-blue-900/10"
                      : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="relative">
                    <Avatar className="size-9 border">
                      <AvatarImage
                        src={notification.sender?.profilePicture}
                        className="object-cover"
                      />
                      <AvatarFallback>
                        {notification.sender?.name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute -bottom-1 -right-1 text-xs bg-background rounded-full p-0.5 border shadow-sm cursor-default">
                      {getIconByType(notification.type)}
                    </span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <p
                      className={`text-sm leading-tight ${!notification.isRead ? "font-medium text-foreground" : "text-muted-foreground"}`}
                    >
                      {notification.message}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <div className="size-2 mt-1.5 bg-blue-500 rounded-full shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
